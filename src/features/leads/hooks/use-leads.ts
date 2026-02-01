import useSWR from "swr";
import { fetcher, API_BASE_URL } from "@/lib/api";
import { components } from "@/api/types";

// Types from your OpenAPI spec
export type Lead = components["schemas"]["Lead"];
export type PaginationMeta = components["schemas"]["PaginationMeta"];

interface UseLeadsParams {
  limit?: number;
  offset?: number;

  // Signals (checkboxes) - mapped to specific endpoints
  signal_new_in_role?: boolean;
  signal_recently_promoted?: boolean;
  signal_at_vc_portfolio?: boolean;
  signal_worked_at_customer?: boolean;
  signal_past_employer?: boolean;

  // Company Filters
  industry?: string | null;
  employee_range?: string | null;
  company_name?: string | null;
  company_domain?: string | null;

  // Business Model Filter
  business_model?: string | null; // "B2B", "B2C", or "Both"

  // Person Filters
  job_function?: string | null;
  seniority?: string | null;
  job_title?: string | null;
  full_name?: string | null;

  // Location Filters
  person_country?: string | null;
  person_state?: string | null;
  person_city?: string | null;

  // Required params for specific signal endpoints
  domains?: string; // for past_employer
}

export function useLeads(params: UseLeadsParams) {
  // Determine which endpoint to use based on the selected Signal
  let endpoint = `${API_BASE_URL}/api/leads`;
  const queryParams = new URLSearchParams();

  // Add pagination
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  // Add company filters
  if (params.industry) queryParams.set("industry", params.industry);
  if (params.employee_range) queryParams.set("employee_range", params.employee_range);
  if (params.company_name) queryParams.set("company_name", params.company_name);
  if (params.company_domain) queryParams.set("company_domain", params.company_domain);
  if (params.business_model) queryParams.set("business_model", params.business_model);

  // Add person filters
  if (params.job_function) queryParams.set("job_function", params.job_function);
  if (params.seniority) queryParams.set("seniority", params.seniority);
  if (params.job_title) queryParams.set("job_title", params.job_title);
  if (params.full_name) queryParams.set("full_name", params.full_name);

  // Add location filters
  if (params.person_country) queryParams.set("person_country", params.person_country);
  if (params.person_state) queryParams.set("person_state", params.person_state);
  if (params.person_city) queryParams.set("person_city", params.person_city);

  // Handle Signals - Switch endpoint based on selection
  // These map to distinct endpoints, prioritize the first active one
  if (params.signal_new_in_role) {
    endpoint = `${API_BASE_URL}/api/leads/new-in-role`;
  } else if (params.signal_recently_promoted) {
    endpoint = `${API_BASE_URL}/api/leads/recently-promoted`;
  } else if (params.signal_at_vc_portfolio) {
    endpoint = `${API_BASE_URL}/api/leads/at-vc-portfolio`;
  } else if (params.signal_worked_at_customer && params.company_domain) {
    endpoint = `${API_BASE_URL}/api/leads/by-company-customers`;
    // company_domain already added above
  } else if (params.signal_past_employer && params.domains) {
    endpoint = `${API_BASE_URL}/api/leads/by-past-employer`;
    queryParams.set("domains", params.domains);
  }

  const url = `${endpoint}?${queryParams.toString()}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    leads: (data?.data as Lead[]) || [],
    meta: (data?.meta as PaginationMeta) || { total: 0, limit: 50, offset: 0 },
    isLoading,
    isError: error,
  };
}
