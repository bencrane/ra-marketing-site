import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface EmailCellProps {
  lead: Lead
}

export function EmailCell({ lead }: EmailCellProps) {
  const fakeName = lead.full_name?.toLowerCase().replace(/\s+/g, '.') || 'contact'
  const fakeDomain = lead.company_domain || 'company.com'
  const fakeEmail = `${fakeName}@${fakeDomain}`

  return (
    <span className="text-muted-foreground/60 blur-[6px] select-none pointer-events-none">
      {fakeEmail}
    </span>
  )
}
