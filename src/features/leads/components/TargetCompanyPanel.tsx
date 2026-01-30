"use client"

import * as React from "react"
import { Building2, Target, Users, TrendingUp, Zap, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TargetCompanyData {
  companyDomain: string
  companyName?: string
  description?: string
  criteria?: {
    label: string
    value: string
    icon?: "employees" | "series" | "signal" | "tech"
  }[]
}

interface TargetCompanyPanelProps {
  companyDomain: string
  onClear: () => void
  className?: string
}

// Mock data for demo - will be replaced with API call
function useCompanyData(domain: string): { data: TargetCompanyData | null; isLoading: boolean } {
  const [data, setData] = React.useState<TargetCompanyData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(true)

    // Simulate API delay
    const timer = setTimeout(() => {
      // Mock data based on domain - replace with actual API call
      const mockData: TargetCompanyData = {
        companyDomain: domain,
        companyName: formatDomainToName(domain),
        description: `We help ${formatDomainToName(domain)} sell to decision makers in their target market. Our AI identifies high-intent buyers based on job changes, funding signals, and technology adoption patterns.`,
        criteria: [
          { label: "Employee Size", value: "51-500", icon: "employees" },
          { label: "Series", value: "Series A-C", icon: "series" },
          { label: "Signal", value: "New in Role", icon: "signal" },
          { label: "Tech Stack", value: "Salesforce, HubSpot", icon: "tech" },
        ],
      }
      setData(mockData)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [domain])

  return { data, isLoading }
}

function formatDomainToName(domain: string): string {
  // Convert domain to company name (e.g., "stripe.com" -> "Stripe")
  const name = domain.replace(/\.(com|io|co|ai|org|net)$/i, "")
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function getCriteriaIcon(iconType?: string) {
  switch (iconType) {
    case "employees":
      return <Users className="h-3.5 w-3.5" />
    case "series":
      return <TrendingUp className="h-3.5 w-3.5" />
    case "signal":
      return <Zap className="h-3.5 w-3.5" />
    case "tech":
      return <Building2 className="h-3.5 w-3.5" />
    default:
      return null
  }
}

export function TargetCompanyPanel({ companyDomain, onClear, className }: TargetCompanyPanelProps) {
  const { data, isLoading } = useCompanyData(companyDomain)

  if (isLoading) {
    return (
      <div className={cn("border border-border rounded-lg bg-card card-elevated p-4", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-full bg-muted/50 rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-muted/30 rounded-full" />
            <div className="h-6 w-24 bg-muted/30 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={cn("border border-border rounded-lg bg-card card-elevated overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {data.companyName || data.companyDomain}
            </h3>
            <p className="text-xs text-muted-foreground">{data.companyDomain}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          title="Clear target company"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      {data.description && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.description}
          </p>
        </div>
      )}

      {/* Criteria Tags */}
      {data.criteria && data.criteria.length > 0 && (
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {data.criteria.map((criterion, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border text-sm"
              >
                {getCriteriaIcon(criterion.icon)}
                <span className="text-muted-foreground">{criterion.label}:</span>
                <span className="font-medium text-foreground">{criterion.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
