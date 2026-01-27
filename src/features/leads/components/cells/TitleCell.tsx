import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface TitleCellProps {
  lead: Lead
}

/**
 * TitleCell - Renders the lead's job title in a table cell
 *
 * Receives the full Lead object from API, extracts what it needs.
 * Can be extended to show seniority badge, job function icon, etc.
 *
 * @example
 * <TitleCell lead={row.original} />
 */
export function TitleCell({ lead }: TitleCellProps) {
  return (
    <div className="text-muted-foreground">
      {lead.matched_cleaned_job_title || "—"}
    </div>
  )
}
