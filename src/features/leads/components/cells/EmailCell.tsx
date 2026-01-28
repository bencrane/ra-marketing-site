import { components } from "@/api/types"
import { Lock } from "lucide-react"

type Lead = components["schemas"]["Lead"]

interface EmailCellProps {
  lead: Lead
}

/**
 * EmailCell - Renders a blurred placeholder email
 * Content is gated/locked until user unlocks
 */
export function EmailCell({ lead }: EmailCellProps) {
  // Generate a fake email based on name for consistent blur
  const fakeName = lead.full_name?.toLowerCase().replace(/\s+/g, '.') || 'contact'
  const fakeDomain = lead.company_domain || 'company.com'
  const fakeEmail = `${fakeName}@${fakeDomain}`

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground/60 blur-[6px] select-none pointer-events-none">
        {fakeEmail}
      </span>
      <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0" />
    </div>
  )
}
