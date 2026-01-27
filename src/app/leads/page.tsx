"use client"

import { Suspense } from "react"
import { Building2, User, X, SlidersHorizontal, ListPlus, Eye, EyeOff } from "lucide-react"
import * as React from "react"
import { Lead } from "@/features/leads"
import { DataTable, columns, useLeads } from "@/features/leads"
import { useFilterState } from "@/features/filters"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider, useSidebar } from "@/components/sidebar-context"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function LeadsPageInner() {
  // All filter state consolidated in one hook
  const { filters, hasActiveFilters, clearAll } = useFilterState()
  const { state, isLocked } = useSidebar()
  const isCollapsed = state === "collapsed" && !isLocked

  // Track selected rows
  const [selectedRows, setSelectedRows] = React.useState<Lead[]>([])

  // Track if filters are enabled (eye icon toggle)
  const [filtersEnabled, setFiltersEnabled] = React.useState(true)

  // Fetch data with filters (pass empty object if filters disabled)
  const activeFilters = filtersEnabled ? filters : { limit: filters.limit, offset: filters.offset }
  const { leads, meta, isLoading } = useLeads(activeFilters)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col h-screen overflow-hidden transition-[margin] duration-200",
        isCollapsed ? "ml-12" : "ml-[280px]"
      )}>
        {/* Header Bar - matches sidebar header */}
        <div className="h-14 flex items-center px-6">
        </div>

        {/* View Toggle Bar - matches sidebar toggle height */}
        <div className="h-11 flex items-center justify-between px-6 border-b border-border">
          <div className="flex rounded-md bg-secondary/30 p-0.5">
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded text-muted-foreground hover:text-foreground transition-colors">
              <Building2 className="h-4 w-4" />
              Companies
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded bg-secondary text-foreground transition-colors">
              <User className="h-4 w-4" />
              People
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Add to List - only shows when rows selected */}
            {selectedRows.length > 0 && (
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors">
                <ListPlus className="h-4 w-4" />
                Add to List
                <span className="text-xs text-muted-foreground">({selectedRows.length})</span>
              </button>
            )}

            {/* Filters control */}
            <div className="flex items-center rounded-md border border-border">
              {/* Eye toggle - enable/disable filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => setFiltersEnabled(!filtersEnabled)}
                  className={cn(
                    "flex items-center justify-center px-2 py-1.5 transition-colors border-r border-border",
                    filtersEnabled
                      ? "text-foreground hover:bg-secondary/50"
                      : "text-muted-foreground hover:bg-secondary/50"
                  )}
                  title={filtersEnabled ? "Disable filters" : "Enable filters"}
                >
                  {filtersEnabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Filters label */}
              <span className={cn(
                "px-3 py-1.5 text-sm font-medium",
                hasActiveFilters ? "text-foreground" : "text-muted-foreground"
              )}>
                Filters
              </span>

              {/* X to clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="flex items-center justify-center px-2 py-1.5 text-foreground hover:bg-secondary/50 transition-colors border-l border-border"
                  title="Clear all filters"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors">
              Columns
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto px-6 pb-6 pt-6">
          <DataTable columns={columns} data={leads} isLoading={isLoading} onSelectionChange={setSelectedRows} />

          {/* Pagination Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <div>
              Showing {meta.total > 0 ? meta.offset + 1 : 0}-{Math.min(meta.offset + meta.limit, meta.total)} of {meta.total.toLocaleString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LeadsPageSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="fixed left-0 top-0 h-screen w-[280px] border-r border-border bg-sidebar z-30" />
      <main className="ml-[280px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar Skeleton */}
        <div className="h-14 flex items-center px-6 border-b border-border">
          <Skeleton className="h-4 w-24 bg-muted/50" />
        </div>
        {/* Table Skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Skeleton className="h-11 w-full bg-secondary/30" />
            <div className="space-y-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex border-b border-border/30">
                  <Skeleton className="h-14 flex-1 bg-muted/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LeadsPageContent() {
  return (
    <SidebarProvider>
      <LeadsPageInner />
    </SidebarProvider>
  )
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadsPageSkeleton />}>
      <LeadsPageContent />
    </Suspense>
  )
}
