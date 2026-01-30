"use client"

import { cn } from "@/lib/utils"

interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: "sm" | "md"
  className?: string
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs font-semibold",
  md: "px-4 py-2 text-sm font-medium",
}

/**
 * SegmentedControl - A toggle between 2+ mutually exclusive options
 *
 * Used for mode switching (sign-in/request-access, existing/new list, etc.)
 *
 * @example
 * <SegmentedControl
 *   options={[
 *     { value: "existing", label: "Existing" },
 *     { value: "new", label: "New" },
 *   ]}
 *   value={mode}
 *   onChange={setMode}
 * />
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("flex rounded-lg bg-secondary/30 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded-md transition-all",
            sizeClasses[size],
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
