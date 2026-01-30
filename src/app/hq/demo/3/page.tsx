"use client"

import { useState } from "react"
import { Globe, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
} from "../components"

const PROCESSING_STEPS = [
  "Connecting to website visitor data",
  "Identifying companies",
  "Matching ICP criteria",
  "Finding key contacts",
]

export default function Demo3Page() {
  const [domain, setDomain] = useState("growthgraph.com")
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
        icon={<Globe className="h-5 w-5 text-muted-foreground" />}
        title="Show ICP People at Companies Visiting Your Website"
        description="Web intent signal — identify companies visiting your site and find ICP-relevant contacts."
        placeholder="Enter your domain (e.g. growthgraph.com)"
        value={domain}
        onChange={setDomain}
        onSubmit={handleSearch}
      />

      {hasSearched && savedDomain && (
        <div>
          {!isProcessing && !isDone && (
            <CTACard
              icon={<Users className="h-4 w-4 text-primary" />}
              title="Ready to find website visitor contacts?"
              description="We'll identify ICP-relevant people at companies visiting your website."
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
              <h2 className="text-base font-semibold mb-1">Website Visitor Contacts</h2>
              <p className="text-xs text-muted-foreground mb-3">
                ICP-relevant people at companies visiting {savedDomain}
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
