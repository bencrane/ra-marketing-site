import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

/**
 * FilterChip - Displays an active filter as a removable chip
 *
 * Used in the sidebar to show applied filters.
 * Clicking the X removes the filter.
 *
 * @example
 * <FilterChip
 *   label="Industry"
 *   value="SaaS"
 *   onRemove={() => setIndustry(null)}
 * />
 */
export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md",
        "bg-secondary text-secondary-foreground",
        "transition-colors",
        className
      )}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 h-3.5 w-3.5 rounded-sm opacity-70 hover:opacity-100 hover:bg-muted flex items-center justify-center"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

interface FilterChipGroupProps {
  children: React.ReactNode
  className?: string
}

/**
 * FilterChipGroup - Container for multiple filter chips
 *
 * @example
 * <FilterChipGroup>
 *   <FilterChip label="Industry" value="SaaS" onRemove={...} />
 *   <FilterChip label="Seniority" value="VP" onRemove={...} />
 * </FilterChipGroup>
 */
export function FilterChipGroup({ children, className }: FilterChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {children}
    </div>
  )
}
