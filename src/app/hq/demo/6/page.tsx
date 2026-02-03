"use client"

import { useState } from "react"
import { Inbox, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
} from "../components"

const PROCESSING_STEPS = [
  "Validating email format",
  "Enriching company data",
  "Scoring ICP fit",
  "Identifying buying signals",
]

export default function Demo6Page() {
  const [email, setEmail] = useState("")
  const [savedEmail, setSavedEmail] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const handleSearch = () => {
    setSavedEmail(email.trim())
    setHasSearched(true)
  }

  return (
    <DemoPageLayout>
      <DemoSearchCard
        icon={<Inbox className="h-5 w-5 text-muted-foreground" />}
        title="Inbound Leads Enrichment"
        description="Enter an inbound lead's email to enrich with company data, ICP fit scoring, and buying signals."
        placeholder="Enter work email (e.g. john@stripe.com)"
        value={email}
        onChange={setEmail}
        onSubmit={handleSearch}
      />

      {hasSearched && savedEmail && (
        <div>
          {!isProcessing && !isDone && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to enrich this lead?"
              description="We'll pull company data, score ICP fit, and identify relevant buying signals."
              buttonLabel="Enrich Lead"
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
              <h2 className="text-base font-semibold mb-1">Enriched Lead</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Full enrichment data for {savedEmail}
              </p>
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Enrichment results will be displayed here.
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
