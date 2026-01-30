"use client"

import { useState } from "react"
import { Sparkles, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
} from "../components"

const PROCESSING_STEPS = [
  "Scraping customer list",
  "Analyzing company profiles",
  "Finding lookalike companies",
  "Ranking by similarity",
]

export default function Demo5Page() {
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const handleSearch = () => {
    setSavedDomain(domain.trim())
    setHasSearched(true)
  }

  return (
    <DemoPageLayout>
      <DemoSearchCard
        icon={<Sparkles className="h-5 w-5 text-muted-foreground" />}
        title="Show Companies Most Similar to Your Best Customers"
        description="Find lookalike companies by analyzing your customer base from your website."
        placeholder="Enter company domain (e.g. stripe.com)"
        value={domain}
        onChange={setDomain}
        onSubmit={handleSearch}
      />

      {hasSearched && savedDomain && (
        <div>
          {!isProcessing && !isDone && (
            <CTACard
              icon={<Building2 className="h-4 w-4 text-primary" />}
              title="Ready to find lookalike companies?"
              description="We'll scrape your customer list and find companies that match your best customers."
              buttonLabel="Find Lookalikes"
              onAction={startProcessing}
            />
          )}

          {isProcessing && !isDone && (
            <ProcessingChecklist
              steps={PROCESSING_STEPS}
              completedSteps={completedSteps}
            />
          )}

          {isDone && (
            <div className="mt-6">
              <h2 className="text-base font-semibold mb-1">Lookalike Companies</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Companies most similar to {savedDomain}&apos;s best customers
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
