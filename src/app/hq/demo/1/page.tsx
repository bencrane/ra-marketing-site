"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, Users, Briefcase, Target, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  ResultsTable,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
  type TableColumn,
} from "../components"

const PROCESSING_STEPS = [
  "Loading your customers",
  "Finding alumni matches",
  "Filtering by ICP",
  "Enriching contacts",
]

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

export default function Demo1Page() {
  const router = useRouter()
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)

  // ICP state
  const [companyICP, setCompanyICP] = useState<CompanyICP | null>(null)
  const [isLoadingICP, setIsLoadingICP] = useState(false)

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [showCustomers, setShowCustomers] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Processing animation state
  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  // Navigate to leads page after processing completes
  const handleFindPeople = async () => {
    if (!savedDomain) return
    await startProcessing()
  }

  // Watch for processing completion and navigate to demo subdomain
  useEffect(() => {
    if (isDone && savedDomain) {
      // Navigate to demo.revenueactivation.com with the company filter
      // Using window.location to navigate across subdomains
      const currentHost = window.location.host
      const targetHost = currentHost.replace(/^hq\./, "demo.")
      window.location.href = `${window.location.protocol}//${targetHost}/leads?company=${encodeURIComponent(savedDomain)}`
    }
  }, [isDone, savedDomain])

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

          {!isProcessing && !isDone && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to find ICP-matched leads?"
              description="We'll search for leads matching this company's ICP criteria."
              buttonLabel="Find People"
              onAction={handleFindPeople}
              className="mt-6"
            />
          )}

          {isProcessing && !isDone && (
            <ProcessingChecklist
              steps={PROCESSING_STEPS}
              completedSteps={completedSteps}
              className="mt-6"
            />
          )}
        </div>
      )}
    </DemoPageLayout>
  )
}
