import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface EmployeeSizeCellProps {
  lead: Lead
}

export function EmployeeSizeCell({ lead }: EmployeeSizeCellProps) {
  return (
    <div className="text-sm text-foreground">
      {lead.employee_range || "—"}
    </div>
  )
}
