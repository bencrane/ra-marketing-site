import { useQueryState, parseAsBoolean, parseAsInteger } from "nuqs"

/**
 * Filter keys that match API query params exactly
 */
export const FILTER_KEYS = {
  // Pagination
  limit: "limit",
  offset: "offset",

  // Signals (boolean flags)
  new_in_role: "new_in_role",
  recently_promoted: "recently_promoted",
  at_vc_portfolio: "at_vc_portfolio",
  worked_at_customer: "worked_at_customer",
  past_employer: "past_employer",

  // Company filters
  industry: "industry",
  employee_range: "employee_range",
  company_name: "company_name",
  company_domain: "company_domain",

  // Person filters
  job_function: "job_function",
  seniority: "seniority",
  job_title: "job_title",
  full_name: "full_name",

  // Location filters
  person_country: "person_country",
  person_state: "person_state",
  person_city: "person_city",
} as const

export type FilterKey = keyof typeof FILTER_KEYS

/**
 * Active filter representation for display
 */
export interface ActiveFilter {
  key: FilterKey
  label: string
  value: string
  onRemove: () => void
}

/**
 * useFilterState - Consolidated hook for all filter state
 *
 * Wraps nuqs useQueryState for URL-synced filter management.
 * Single source of truth for all filters.
 *
 * @example
 * const { filters, setFilter, clearFilter, clearAll, activeFilters } = useFilterState()
 *
 * // Set a filter
 * setFilter("industry", "SaaS")
 *
 * // Clear a specific filter
 * clearFilter("industry")
 *
 * // Clear all filters
 * clearAll()
 *
 * // Get active filters for display
 * activeFilters.map(f => <FilterChip key={f.key} {...f} />)
 */
export function useFilterState() {
  // Pagination
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(50))
  const [offset, setOffset] = useQueryState("offset", parseAsInteger.withDefault(0))

  // Signals
  const [newInRole, setNewInRole] = useQueryState("new_in_role", parseAsBoolean)
  const [recentlyPromoted, setRecentlyPromoted] = useQueryState("recently_promoted", parseAsBoolean)
  const [atVcPortfolio, setAtVcPortfolio] = useQueryState("at_vc_portfolio", parseAsBoolean)
  const [workedAtCustomer, setWorkedAtCustomer] = useQueryState("worked_at_customer", parseAsBoolean)
  const [pastEmployer, setPastEmployer] = useQueryState("past_employer", parseAsBoolean)

  // Company filters
  const [industry, setIndustry] = useQueryState("industry")
  const [employeeRange, setEmployeeRange] = useQueryState("employee_range")
  const [companyName, setCompanyName] = useQueryState("company_name")
  const [companyDomain, setCompanyDomain] = useQueryState("company_domain")

  // Person filters
  const [jobFunction, setJobFunction] = useQueryState("job_function")
  const [seniority, setSeniority] = useQueryState("seniority")
  const [jobTitle, setJobTitle] = useQueryState("job_title")
  const [fullName, setFullName] = useQueryState("full_name")

  // Location filters
  const [personCountry, setPersonCountry] = useQueryState("person_country")
  const [personState, setPersonState] = useQueryState("person_state")
  const [personCity, setPersonCity] = useQueryState("person_city")

  // All filters as object (for passing to useLeads)
  const filters = {
    limit,
    offset,
    // Signals
    signal_new_in_role: newInRole || false,
    signal_recently_promoted: recentlyPromoted || false,
    signal_at_vc_portfolio: atVcPortfolio || false,
    signal_worked_at_customer: workedAtCustomer || false,
    signal_past_employer: pastEmployer || false,
    // Company
    industry,
    employee_range: employeeRange,
    company_name: companyName,
    company_domain: companyDomain,
    // Person
    job_function: jobFunction,
    seniority,
    job_title: jobTitle,
    full_name: fullName,
    // Location
    person_country: personCountry,
    person_state: personState,
    person_city: personCity,
  }

  // Setters map
  const setters: Record<string, (val: string | boolean | number | null) => void> = {
    limit: (v) => setLimit(v as number),
    offset: (v) => setOffset(v as number),
    new_in_role: (v) => setNewInRole(v ? true : null),
    recently_promoted: (v) => setRecentlyPromoted(v ? true : null),
    at_vc_portfolio: (v) => setAtVcPortfolio(v ? true : null),
    worked_at_customer: (v) => setWorkedAtCustomer(v ? true : null),
    past_employer: (v) => setPastEmployer(v ? true : null),
    industry: (v) => setIndustry(v as string | null),
    employee_range: (v) => setEmployeeRange(v as string | null),
    company_name: (v) => setCompanyName(v as string | null),
    company_domain: (v) => setCompanyDomain(v as string | null),
    job_function: (v) => setJobFunction(v as string | null),
    seniority: (v) => setSeniority(v as string | null),
    job_title: (v) => setJobTitle(v as string | null),
    full_name: (v) => setFullName(v as string | null),
    person_country: (v) => setPersonCountry(v as string | null),
    person_state: (v) => setPersonState(v as string | null),
    person_city: (v) => setPersonCity(v as string | null),
  }

  // Set a specific filter
  const setFilter = (key: string, value: string | boolean | number | null) => {
    const setter = setters[key]
    if (setter) setter(value)
  }

  // Clear a specific filter
  const clearFilter = (key: string) => {
    setFilter(key, null)
  }

  // Clear all filters (except pagination)
  const clearAll = () => {
    setNewInRole(null)
    setRecentlyPromoted(null)
    setAtVcPortfolio(null)
    setWorkedAtCustomer(null)
    setPastEmployer(null)
    setIndustry(null)
    setEmployeeRange(null)
    setCompanyName(null)
    setCompanyDomain(null)
    setJobFunction(null)
    setSeniority(null)
    setJobTitle(null)
    setFullName(null)
    setPersonCountry(null)
    setPersonState(null)
    setPersonCity(null)
    setOffset(0) // Reset pagination too
  }

  // Build active filters list for display
  const activeFilters: ActiveFilter[] = []

  // Helper to add filter chips for comma-separated values
  const addChips = (key: FilterKey, label: string, value: string | null) => {
    if (!value) return
    const values = value.split(",").map((v) => v.trim()).filter(Boolean)
    values.forEach((v) => {
      activeFilters.push({
        key,
        label,
        value: v,
        onRemove: () => {
          const remaining = values.filter((val) => val !== v)
          setFilter(key, remaining.length > 0 ? remaining.join(",") : null)
        },
      })
    })
  }

  // Signal chips
  if (newInRole) {
    activeFilters.push({
      key: "new_in_role",
      label: "Signal",
      value: "New in Role",
      onRemove: () => setNewInRole(null),
    })
  }
  if (recentlyPromoted) {
    activeFilters.push({
      key: "recently_promoted",
      label: "Signal",
      value: "Recently Promoted",
      onRemove: () => setRecentlyPromoted(null),
    })
  }
  if (atVcPortfolio) {
    activeFilters.push({
      key: "at_vc_portfolio",
      label: "Signal",
      value: "At VC Portfolio",
      onRemove: () => setAtVcPortfolio(null),
    })
  }
  if (workedAtCustomer) {
    activeFilters.push({
      key: "worked_at_customer",
      label: "Signal",
      value: "Worked at Customer",
      onRemove: () => setWorkedAtCustomer(null),
    })
  }
  if (pastEmployer) {
    activeFilters.push({
      key: "past_employer",
      label: "Signal",
      value: "Past Employer",
      onRemove: () => setPastEmployer(null),
    })
  }

  // Text filter chips
  addChips("industry", "Industry", industry)
  addChips("employee_range", "Size", employeeRange)
  addChips("company_name", "Company", companyName)
  addChips("company_domain", "Domain", companyDomain)
  addChips("job_function", "Function", jobFunction)
  addChips("seniority", "Seniority", seniority)
  addChips("job_title", "Title", jobTitle)
  addChips("full_name", "Name", fullName)
  addChips("person_country", "Country", personCountry)
  addChips("person_state", "State", personState)
  addChips("person_city", "City", personCity)

  return {
    // Raw filter values (for useLeads)
    filters,

    // Individual values (if needed)
    values: {
      limit,
      offset,
      newInRole,
      recentlyPromoted,
      atVcPortfolio,
      workedAtCustomer,
      pastEmployer,
      industry,
      employeeRange,
      companyName,
      companyDomain,
      jobFunction,
      seniority,
      jobTitle,
      fullName,
      personCountry,
      personState,
      personCity,
    },

    // Individual setters (if needed)
    setters: {
      setLimit,
      setOffset,
      setNewInRole,
      setRecentlyPromoted,
      setAtVcPortfolio,
      setWorkedAtCustomer,
      setPastEmployer,
      setIndustry,
      setEmployeeRange,
      setCompanyName,
      setCompanyDomain,
      setJobFunction,
      setSeniority,
      setJobTitle,
      setFullName,
      setPersonCountry,
      setPersonState,
      setPersonCity,
    },

    // Actions
    setFilter,
    clearFilter,
    clearAll,

    // For display
    activeFilters,
    hasActiveFilters: activeFilters.length > 0,
    activeFilterCount: activeFilters.length,
  }
}
