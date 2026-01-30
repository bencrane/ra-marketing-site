"use client"

import { useState } from "react"
import { Building2, Users, Briefcase, Target, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  ResultsTable,
  CTACard,
  type TableColumn,
} from "../components"

const API_BASE = "https://api.revenueinfra.com/api/companies"

interface ValueProposition {
  value_proposition: string
  core_benefit: string
  target_customer: string
  key_differentiator: string
}

interface CompanyICP {
  company_name: string
  customer_domains: string[]
  icp_industries: string[]
  icp_job_titles: string[]
  icp_seniorities: string[]
  icp_job_functions: string[]
  icp_employee_ranges: string[]
  icp_countries: string[]
  value_proposition: ValueProposition | string | null
}

interface Lead {
  person_id: string
  full_name: string
  linkedin_url: string
  matched_cleaned_job_title: string
  matched_job_function: string
  matched_seniority: string
  person_city: string
  person_state: string
  person_country: string
  company_domain: string
  company_name: string
  matched_industry: string
  employee_range: string
  company_country: string
  [key: string]: string | undefined
}

interface Customer {
  name: string
  domain: string
  industry?: string
  matched_industry?: string
  size?: string
  employee_range?: string
  country?: string
  company_country?: string
  [key: string]: string | undefined
}

const CUSTOMER_COLUMNS: TableColumn<Customer>[] = [
  { key: "name", label: "Company", width: "20%" },
  { key: "domain", label: "Domain", width: "20%" },
  {
    key: "industry",
    label: "Industry",
    width: "25%",
    render: (c) => c.industry || c.matched_industry || ""
  },
  {
    key: "size",
    label: "Size",
    width: "15%",
    render: (c) => c.size || c.employee_range || ""
  },
  {
    key: "country",
    label: "Country",
    width: "20%",
    render: (c) => c.country || c.company_country || ""
  },
]

const LEAD_COLUMNS: TableColumn<Lead>[] = [
  { key: "full_name", label: "Name", width: "18%" },
  { key: "matched_cleaned_job_title", label: "Title", width: "18%" },
  { key: "company_name", label: "Company", width: "16%" },
  { key: "matched_industry", label: "Industry", width: "16%" },
  { key: "matched_seniority", label: "Seniority", width: "10%" },
  { key: "employee_range", label: "Size", width: "10%" },
  { key: "person_country", label: "Location", width: "12%" },
]

export default function Demo1Page() {
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)

  // ICP state
  const [companyICP, setCompanyICP] = useState<CompanyICP | null>(null)
  const [isLoadingICP, setIsLoadingICP] = useState(false)

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [showCustomers, setShowCustomers] = useState(false)

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsTotal, setLeadsTotal] = useState<number>(0)
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [showLeads, setShowLeads] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Step 3: Fetch leads with ICP filter presets
  const handleFindPeople = async () => {
    if (!companyICP) return

    setIsLoadingLeads(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set("limit", "50")
      params.set("offset", "0")

      // Map ICP data to filter params
      if (companyICP.icp_industries?.length > 0) {
        params.set("industry", companyICP.icp_industries.join(","))
      }
      if (companyICP.icp_seniorities?.length > 0) {
        params.set("seniority", companyICP.icp_seniorities.join(","))
      }
      if (companyICP.icp_job_functions?.length > 0) {
        params.set("job_function", companyICP.icp_job_functions.join(","))
      }
      if (companyICP.icp_employee_ranges?.length > 0) {
        params.set("employee_range", companyICP.icp_employee_ranges.join(","))
      }
      if (companyICP.icp_countries?.length > 0) {
        params.set("company_country", companyICP.icp_countries.join(","))
      }

      console.log("Leads Request:", `${API_BASE.replace("/companies", "")}/leads?${params.toString()}`)

      const response = await fetch(
        `https://api.revenueinfra.com/api/leads?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Leads Response:", data)

      setLeads(data.data || [])
      setLeadsTotal(data.meta?.total || data.data?.length || 0)
      setShowLeads(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads")
    } finally {
      setIsLoadingLeads(false)
    }
  }

  // Step 1: Fetch company ICP info
  const handleSearch = async () => {
    setIsLoadingICP(true)
    setError(null)
    setSavedDomain(domain.trim())
    setCompanyICP(null)
    setCustomers([])
    setShowCustomers(false)

    try {
      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(domain.trim())}/icp`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("ICP Response:", data)

      if (data.success === false) {
        throw new Error(data.error || "No ICP data found for this company")
      }

      setCompanyICP(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch company info")
    } finally {
      setIsLoadingICP(false)
    }
  }

  // Step 2: Fetch customers
  const handleFetchCustomers = async () => {
    if (!savedDomain) return

    setIsLoadingCustomers(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(savedDomain)}/customers`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Customers Response:", data)
      setCustomers(data.customers || data.data || data || [])
      setShowCustomers(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers")
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  return (
    <DemoPageLayout>
      <DemoSearchCard
        icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
        title="Find ICP-Relevant People at Customer Companies"
        description="Enter a company domain to discover people who previously worked at their current customers."
        placeholder="Enter company domain (e.g. stripe.com)"
        value={domain}
        onChange={setDomain}
        onSubmit={handleSearch}
        isLoading={isLoadingICP}
      />

      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Company ICP Card */}
      {companyICP && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <Building2 className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{companyICP.company_name || savedDomain}</h2>
                  {companyICP.company_name && (
                    <p className="text-sm text-muted-foreground">{savedDomain}</p>
                  )}
                </div>
              </div>

              {companyICP.value_proposition && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Value Proposition</span>
                  </div>
                  {typeof companyICP.value_proposition === "string" ? (
                    <p className="text-sm text-foreground">{companyICP.value_proposition}</p>
                  ) : (
                    <p className="text-sm text-foreground">
                      {companyICP.value_proposition.value_proposition || companyICP.value_proposition.core_benefit}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {companyICP.icp_industries && companyICP.icp_industries.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ICP Industries</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {companyICP.icp_industries.map((industry) => (
                        <span
                          key={industry}
                          className="px-2 py-1 text-xs bg-secondary text-foreground rounded"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {companyICP.icp_job_titles && companyICP.icp_job_titles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ICP Job Titles</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {companyICP.icp_job_titles.map((title) => (
                        <span
                          key={title}
                          className="px-2 py-1 text-xs bg-secondary text-foreground rounded"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Show Customers Button */}
          {!showCustomers && (
            <CTACard
              icon={<Building2 className="h-4 w-4 text-primary" />}
              title={`View ${companyICP.company_name || savedDomain}'s Customers`}
              description="See the companies that are customers of this company."
              buttonLabel={isLoadingCustomers ? "Loading..." : "Show Customers"}
              onAction={handleFetchCustomers}
              disabled={isLoadingCustomers}
            />
          )}
        </div>
      )}

      {/* Customers Table */}
      {showCustomers && customers.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-4">
            {customers.length} customers found for{" "}
            <span className="text-foreground font-medium">{companyICP?.company_name || savedDomain}</span>
          </p>

          <ResultsTable
            data={customers}
            columns={CUSTOMER_COLUMNS}
            getRowKey={(c) => c.domain}
          />

          {!showLeads && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to find ICP-matched leads?"
              description="We'll search for leads matching this company's ICP criteria."
              buttonLabel={isLoadingLeads ? "Loading..." : "Find People"}
              onAction={handleFindPeople}
              disabled={isLoadingLeads}
              className="mt-6"
            />
          )}

          {/* Leads Results */}
          {showLeads && leads.length > 0 && (
            <div className="mt-6">
              <h2 className="text-base font-semibold mb-1">ICP-Matched Leads</h2>
              <p className="text-xs text-muted-foreground mb-4">
                {leadsTotal.toLocaleString()} leads found matching {companyICP?.company_name || savedDomain}&apos;s ICP criteria
              </p>
              <ResultsTable
                data={leads}
                columns={LEAD_COLUMNS}
                getRowKey={(l) => l.person_id}
                maxHeight="400px"
              />
            </div>
          )}

          {showLeads && leads.length === 0 && (
            <Card className="mt-6">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No leads found matching the ICP criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DemoPageLayout>
  )
}
