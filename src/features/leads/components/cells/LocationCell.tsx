import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface LocationCellProps {
  lead: Lead
}

export function LocationCell({ lead }: LocationCellProps) {
  const parts = [lead.person_city, lead.person_state, lead.person_country].filter(Boolean)
  const location = parts.join(", ")

  return (
    <div className="text-sm text-foreground">
      {location || "—"}
    </div>
  )
}
