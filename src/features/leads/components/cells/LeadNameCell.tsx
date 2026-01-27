import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface LeadNameCellProps {
  lead: Lead
}

/**
 * LeadNameCell - Renders the lead's name in a table cell
 *
 * Receives the full Lead object from API, extracts what it needs.
 * Can be extended to show avatar, LinkedIn link, etc.
 *
 * @example
 * <LeadNameCell lead={row.original} />
 */
export function LeadNameCell({ lead }: LeadNameCellProps) {
  return (
    <div className="font-medium text-foreground">
      {lead.full_name || "—"}
    </div>
  )
}
