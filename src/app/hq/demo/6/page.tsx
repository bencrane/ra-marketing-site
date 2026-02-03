"use client"

import { useState } from "react"
import { Inbox, Users, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DemoPageLayout,
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
  const [clientDomain, setClientDomain] = useState("")
  const [email, setEmail] = useState("")
  const [savedClientDomain, setSavedClientDomain] = useState<string | null>(null)
  const [savedEmail, setSavedEmail] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const handleSearch = () => {
    setSavedClientDomain(clientDomain.trim())
    setSavedEmail(email.trim())
    setHasSearched(true)
  }

  const canSearch = clientDomain.trim() && email.trim()

  return (
    <DemoPageLayout>
      {/* Custom search card with two inputs */}
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="p-3 rounded-xl bg-secondary mb-4">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Inbound Leads Enrichment
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your client's domain and the inbound lead's email to enrich with company data, ICP fit scoring, and buying signals.
        </p>

        <Card className="w-full">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Client Domain</Label>
              <Input
                placeholder="e.g. stripe.com"
                value={clientDomain}
                onChange={(e) => setClientDomain(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Work Email</Label>
              <Input
                placeholder="e.g. john@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSearch) {
                    handleSearch()
                  }
                }}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!canSearch}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </CardContent>
        </Card>
      </div>

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
                Full enrichment data for {savedEmail} (Client: {savedClientDomain})
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
