import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_BASE_URL } from "@/lib/api";

// Types for AI filter results
export interface AiFilters {
  job_title?: string[];
  seniority?: string[];
  job_function?: string[];
  industry?: string[];
  employee_range?: string[];
  person_state?: string[];
  person_city?: string[];
  person_country?: string[];
  company_name?: string[];
  company_domain?: string[];
  new_in_role?: boolean;
  recently_promoted?: boolean;
}

interface AiSearchRequest {
  query: string;
  history: { role: "user" | "assistant"; content: string }[];
}

interface LeadPreview {
  person_id: string;
  full_name: string;
  matched_cleaned_job_title: string;
  company_name: string;
  person_city?: string;
  person_state?: string;
}

interface AiSearchResponse {
  filters: AiFilters;
  description: string;
  count: number;
  preview: LeadPreview[];
  assistantMessage: string;
}

const FILTER_SYSTEM_PROMPT = `You are an AI assistant that interprets natural language search queries for a B2B lead database and converts them into structured filters.

Available filter fields:
- job_title: Array of job titles to search for (e.g., ["VP of Sales", "Director of Sales"])
- seniority: Array of seniority levels ["C-Level", "VP", "Director", "Manager", "Individual Contributor"]
- job_function: Array of job functions ["Sales", "Marketing", "Engineering", "Finance", "Operations", "HR", "Product", "Customer Success"]
- industry: Array of industries (e.g., ["SaaS", "Logistics", "Healthcare", "Financial Services"])
- employee_range: Array of company size ranges ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"]
- person_state: Array of US state abbreviations (e.g., ["TX", "CA", "NY"])
- person_city: Array of city names
- person_country: Array of country names or codes (default to "United States" for US-specific queries)
- company_name: Array of specific company names
- company_domain: Array of company domains
- new_in_role: Boolean - true if looking for people new in their role (within last 90 days)
- recently_promoted: Boolean - true if looking for people recently promoted

When interpreting queries:
1. Extract relevant filter criteria from the natural language query
2. Map informal terms to the appropriate filter values (e.g., "VPs" → seniority: ["VP"])
3. Handle location queries (e.g., "Texas" → person_state: ["TX"])
4. Handle company size queries (e.g., "mid-size" → employee_range: ["51-200", "201-500"])
5. Only include filters that are explicitly or implicitly mentioned in the query

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "filters": {
    // Only include filter fields that apply to the query
  },
  "description": "Brief human-readable summary of the filters being applied"
}

Examples:
- "VPs of Sales at logistics companies in Texas" → {"filters": {"seniority": ["VP"], "job_function": ["Sales"], "industry": ["Logistics", "Transportation & Logistics"], "person_state": ["TX"]}, "description": "VP-level Sales in Logistics, Texas"}
- "Recently promoted marketing directors" → {"filters": {"seniority": ["Director"], "job_function": ["Marketing"], "recently_promoted": true}, "description": "Recently promoted Marketing Directors"}
- "Engineers at companies with 500+ employees" → {"filters": {"job_function": ["Engineering"], "employee_range": ["501-1000", "1001-5000", "5001-10000", "10001+"]}, "description": "Engineers at companies with 500+ employees"}`;

function parseFiltersFromResponse(content: string): { filters: AiFilters; description: string } {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { filters: {}, description: "Unable to parse filters" };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      filters: parsed.filters || {},
      description: parsed.description || "Custom search",
    };
  } catch {
    return { filters: {}, description: "Unable to parse filters" };
  }
}

function convertFiltersToQueryParams(filters: AiFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Convert arrays to comma-separated strings for the API
  if (filters.job_title?.length) params.set("job_title", filters.job_title.join(","));
  if (filters.seniority?.length) params.set("seniority", filters.seniority.join(","));
  if (filters.job_function?.length) params.set("job_function", filters.job_function.join(","));
  if (filters.industry?.length) params.set("industry", filters.industry.join(","));
  if (filters.employee_range?.length) params.set("employee_range", filters.employee_range.join(","));
  if (filters.person_state?.length) params.set("person_state", filters.person_state.join(","));
  if (filters.person_city?.length) params.set("person_city", filters.person_city.join(","));
  if (filters.person_country?.length) params.set("person_country", filters.person_country.join(","));
  if (filters.company_name?.length) params.set("company_name", filters.company_name.join(","));
  if (filters.company_domain?.length) params.set("company_domain", filters.company_domain.join(","));

  return params;
}

async function fetchLeadsPreview(
  filters: AiFilters
): Promise<{ count: number; preview: LeadPreview[] }> {
  // Determine the endpoint based on signal filters
  let endpoint = `${API_BASE_URL}/api/leads`;

  if (filters.new_in_role) {
    endpoint = `${API_BASE_URL}/api/leads/new-in-role`;
  } else if (filters.recently_promoted) {
    endpoint = `${API_BASE_URL}/api/leads/recently-promoted`;
  }

  const queryParams = convertFiltersToQueryParams(filters);
  queryParams.set("limit", "5"); // Only fetch preview

  const url = `${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      count: data.meta?.total || 0,
      preview: (data.data || []).slice(0, 5).map((lead: Record<string, unknown>) => ({
        person_id: lead.person_id,
        full_name: lead.full_name,
        matched_cleaned_job_title: lead.matched_cleaned_job_title,
        company_name: lead.company_name,
        person_city: lead.person_city,
        person_state: lead.person_state,
      })),
    };
  } catch (error) {
    console.error("Error fetching leads preview:", error);
    return { count: 0, preview: [] };
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { query, history = [] }: AiSearchRequest = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: {
        role: "user",
        parts: [{ text: FILTER_SYSTEM_PROMPT }],
      },
    });

    // Build conversation history for context
    const historyForGemini = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: historyForGemini,
    });

    const result = await chat.sendMessage(query);
    const assistantMessage = result.response.text();

    // Parse the filters from Gemini's response
    const { filters, description } = parseFiltersFromResponse(assistantMessage);

    // Fetch count and preview from the external API
    const { count, preview } = await fetchLeadsPreview(filters);

    const response: AiSearchResponse = {
      filters,
      description,
      count,
      preview,
      assistantMessage,
    };

    return Response.json(response);
  } catch (error) {
    console.error("AI search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "Failed to process search query", details: errorMessage },
      { status: 500 }
    );
  }
}
