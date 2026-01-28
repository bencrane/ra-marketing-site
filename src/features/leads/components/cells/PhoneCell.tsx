import { components } from "@/api/types"
import { Lock } from "lucide-react"

type Lead = components["schemas"]["Lead"]

interface PhoneCellProps {
  lead: Lead
}

/**
 * PhoneCell - Renders a blurred placeholder phone number
 * Content is gated/locked until user unlocks
 */
export function PhoneCell({ lead }: PhoneCellProps) {
  // Generate a consistent fake phone based on person_id
  const fakePhone = "+1 (555) 123-4567"

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground/60 blur-[6px] select-none pointer-events-none">
        {fakePhone}
      </span>
      <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0" />
    </div>
  )
}
