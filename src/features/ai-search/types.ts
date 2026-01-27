// AI Filter types matching the API route
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

export interface LeadPreview {
  person_id: string;
  full_name: string;
  matched_cleaned_job_title: string;
  company_name: string;
  person_city?: string;
  person_state?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  filters?: AiFilters;
  description?: string;
  count?: number;
  preview?: LeadPreview[];
}

export interface AiSearchResult {
  filters: AiFilters;
  description: string;
  count: number;
  preview: LeadPreview[];
  assistantMessage: string;
}
