import { cn } from "@/lib/utils"

/**
 * Signal types matching the API endpoints and URL params
 * These are the intelligence signals that indicate lead quality
 */
export type SignalType =
  | "newInRole"
  | "recentlyPromoted"
  | "atVcPortfolio"
  | "workedAtCustomer"
  | "pastEmployer"

interface SignalBadgeProps {
  signal: SignalType
  className?: string
}

/**
 * Configuration for each signal type
 * - label: Display text
 * - className: Design system CSS class (defined in globals.css)
 * - description: Tooltip/accessibility text
 */
const signalConfig: Record<SignalType, { label: string; className: string; description: string }> = {
  newInRole: {
    label: "New in Role",
    className: "badge-new-role",
    description: "Started a new position within the last 90 days",
  },
  recentlyPromoted: {
    label: "Recently Promoted",
    className: "badge-promoted",
    description: "Promoted within the last 180 days",
  },
  atVcPortfolio: {
    label: "At VC Portfolio",
    className: "badge-vc",
    description: "Works at a VC portfolio company",
  },
  workedAtCustomer: {
    label: "Worked at Customer",
    className: "badge-customer",
    description: "Previously worked at one of your customers",
  },
  pastEmployer: {
    label: "Past Employer",
    className: "badge-funded",
    description: "Previously worked at a specified company",
  },
}

/**
 * SignalBadge - Displays an intelligence signal indicator
 *
 * Uses design system CSS classes for consistent styling.
 * Each signal type has semantic color meaning defined in globals.css.
 *
 * @example
 * <SignalBadge signal="newInRole" />
 * <SignalBadge signal="recentlyPromoted" />
 */
export function SignalBadge({ signal, className }: SignalBadgeProps) {
  const config = signalConfig[signal]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
        config.className,
        className
      )}
      title={config.description}
    >
      {config.label}
    </span>
  )
}

/**
 * Helper to convert URL param name to SignalType
 * URL params use snake_case, component uses camelCase
 */
export function urlParamToSignalType(param: string): SignalType | null {
  const mapping: Record<string, SignalType> = {
    new_in_role: "newInRole",
    recently_promoted: "recentlyPromoted",
    at_vc_portfolio: "atVcPortfolio",
    worked_at_customer: "workedAtCustomer",
    past_employer: "pastEmployer",
  }
  return mapping[param] || null
}

/**
 * Helper to get all active signals from URL params
 */
export function getActiveSignals(params: Record<string, boolean | null>): SignalType[] {
  const signals: SignalType[] = []

  if (params.new_in_role) signals.push("newInRole")
  if (params.recently_promoted) signals.push("recentlyPromoted")
  if (params.at_vc_portfolio) signals.push("atVcPortfolio")
  if (params.worked_at_customer) signals.push("workedAtCustomer")
  if (params.past_employer) signals.push("pastEmployer")

  return signals
}
