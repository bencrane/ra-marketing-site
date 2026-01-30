"use client"

import { useState } from "react"
import { Building2, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { API_BASE_URL } from "@/lib/api"
import {
  DemoPageLayout,
  DemoSearchCard,
  ProcessingChecklist,
  ResultsTable,
  CTACard,
  useProcessingSteps,
  type TableColumn,
} from "../components"

interface Customer {
  name: string
  domain: string
  matched_industry: string
  employee_range: string
  company_country: string
}

const PROCESSING_STEPS = [
  "Loading your customers",
  "Finding alumni matches",
  "Filtering by ICP",
  "Enriching contacts",
]

const CUSTOMER_COLUMNS: TableColumn<Customer>[] = [
  { key: "name", label: "Company", width: "20%" },
  { key: "domain", label: "Domain", width: "20%" },
  { key: "matched_industry", label: "Industry", width: "25%" },
  { key: "employee_range", label: "Size", width: "15%" },
  { key: "company_country", label: "Country", width: "20%" },
]

export default function Demo1Page() {
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    setSavedDomain(domain.trim())

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${encodeURIComponent(domain.trim())}/customers?limit=100`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setCustomers(data.data || data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers")
      setCustomers([])
    } finally {
      setIsLoading(false)
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
        isLoading={isLoading}
      />

      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && customers.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-4">
            {customers.length} customers found for{" "}
            <span className="text-foreground font-medium">{savedDomain}</span>
          </p>

          <ResultsTable
            data={customers}
            columns={CUSTOMER_COLUMNS}
            getRowKey={(c) => c.domain}
          />

          {!isProcessing && !isDone && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to find alumni matches?"
              description="We'll scan for ICP-relevant people who previously worked at these customers."
              buttonLabel="Find People"
              onAction={startProcessing}
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

          {isDone && (
            <div className="mt-8">
              <h2 className="text-base font-semibold mb-1">Alumni Matches</h2>
              <p className="text-xs text-muted-foreground mb-3">
                ICP-relevant people who previously worked at {savedDomain}&apos;s customers
              </p>
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Results will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </DemoPageLayout>
  )
}
