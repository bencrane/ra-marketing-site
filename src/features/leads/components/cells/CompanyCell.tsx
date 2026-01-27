import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface CompanyCellProps {
  lead: Lead
}

/**
 * CompanyCell - Renders the lead's company in a table cell
 *
 * Receives the full Lead object from API, extracts what it needs.
 * Can be extended to show company logo, domain link, industry badge, etc.
 *
 * @example
 * <CompanyCell lead={row.original} />
 */
export function CompanyCell({ lead }: CompanyCellProps) {
  return (
    <div className="text-muted-foreground">
      {lead.company_name || "—"}
    </div>
  )
}
