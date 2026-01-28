import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface IndustryCellProps {
  lead: Lead
}

export function IndustryCell({ lead }: IndustryCellProps) {
  return (
    <div className="text-sm text-foreground">
      {lead.matched_industry || "—"}
    </div>
  )
}
