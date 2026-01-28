import { components } from "@/api/types"

type Lead = components["schemas"]["Lead"]

interface PhoneCellProps {
  lead: Lead
}

export function PhoneCell({ lead }: PhoneCellProps) {
  const fakePhone = "+1 (555) 123-4567"

  return (
    <span className="text-muted-foreground/60 blur-[6px] select-none pointer-events-none">
      {fakePhone}
    </span>
  )
}
