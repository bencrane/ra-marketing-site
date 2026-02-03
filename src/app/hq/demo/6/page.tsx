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

// Toggle to enable/disable the processing animation
const SHOW_PROCESSING_ANIMATION = false

const PROCESSING_STEPS = [
  "Validating email format",
  "Enriching company data",
  "Scoring ICP fit",
  "Identifying buying signals",
]

export default function Demo6Page() {
  // Client config
  const [clientDomain, setClientDomain] = useState("")
  const [formId, setFormId] = useState("")

  // Form fields (simulating inbound form)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const [savedData, setSavedData] = useState<Record<string, string> | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSearch = async () => {
    const payload = {
      client_domain: clientDomain.trim(),
      form_id: formId.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      business_email: businessEmail.trim(),
      company_name: companyName.trim(),
      phone: phone.trim(),
      message: message.trim(),
    }

    setSavedData(payload)
    setIsSubmitting(true)

    try {
      console.log("Sending to Clay webhook:", payload)

      const response = await fetch("/api/clay-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log("Clay webhook response:", result)
    } catch (err) {
      console.error("Failed to send to Clay webhook:", err)
    } finally {
      setIsSubmitting(false)
      setHasSearched(true)
    }
  }

  // All fields optional now
  const canSearch = true

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
            {/* Client Domain - Required config */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Client Domain</Label>
              <Input
                placeholder="e.g. securitypalhq.com"
                value={clientDomain}
                onChange={(e) => setClientDomain(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Form ID */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Form ID</Label>
              <Input
                placeholder="e.g. contact-form-1"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  Simulated Inbound Form Fields
                </span>
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">First Name</Label>
              <Input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Last Name</Label>
              <Input
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Business Email */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Business Email</Label>
              <Input
                placeholder="john@acme.com"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Company Name</Label>
              <Input
                placeholder="Acme Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-sm bg-input/30 border-border"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Message</Label>
              <textarea
                placeholder="I'm interested in learning more..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 text-sm bg-input/30 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </CardContent>
        </Card>
      </div>

      {hasSearched && savedData && (
        <div>
          {/* Processing animation - toggle SHOW_PROCESSING_ANIMATION to enable */}
          {SHOW_PROCESSING_ANIMATION && (
            <>
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
                    Full enrichment data (Client: {savedData.client_domain})
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
            </>
          )}

          {/* Simple confirmation when animation is disabled */}
          {!SHOW_PROCESSING_ANIMATION && (
            <div className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-foreground font-medium mb-1">Submitted!</p>
                  <p className="text-xs text-muted-foreground">
                    {savedData.business_email || "No email"} (Client: {savedData.client_domain || "Not specified"})
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
