"use client"

import { useState } from "react"
import { Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
} from "../components"

const PROCESSING_STEPS = [
  "Loading ICP criteria",
  "Scanning job changes",
  "Filtering recent moves",
  "Enriching contacts",
]

export default function Demo2Page() {
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
        icon={<Clock className="h-5 w-5 text-muted-foreground" />}
        title="Show ICP People New in Their Role"
        description="Find people who recently changed jobs — catch buyers when they're most likely to evaluate new tools."
        placeholder="Enter company domain (e.g. stripe.com)"
        value={domain}
        onChange={setDomain}
        onSubmit={handleSearch}
      />

      {hasSearched && savedDomain && (
        <div>
          {!isProcessing && !isDone && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to find new role signals?"
              description="We'll scan for ICP-relevant people who recently started new positions."
              buttonLabel="Find People"
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
              <h2 className="text-base font-semibold mb-1">New in Role Matches</h2>
              <p className="text-xs text-muted-foreground mb-3">
                ICP-relevant people who recently started new roles at {savedDomain}
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
