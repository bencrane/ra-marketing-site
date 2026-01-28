"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Building2, User, X, SlidersHorizontal, ListPlus, Eye, EyeOff, Sparkles, Inbox, List, LogOut } from "lucide-react"
import * as React from "react"
import { Lead } from "@/features/leads"
import { DataTable, columns, useLeads, AddToListModal, ViewListsModal } from "@/features/leads"
import { useFilterState } from "@/features/filters"
import { AiSearchModal, AiFilters } from "@/features/ai-search"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider, useSidebar } from "@/components/sidebar-context"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function LeadsPageInner() {
  // All filter state consolidated in one hook
  const {
    filters,
    hasActiveFilters,
    clearAll,
    isAiFilterActive,
    aiFilterDescription,
    setAiFilter,
    clearAiFilter,
    getAiFiltersForApi,
    isListFilterActive,
    listFilterName,
    setListFilter,
    clearListFilter,
  } = useFilterState()
  const { state, isLocked } = useSidebar()
  const isCollapsed = state === "collapsed" && !isLocked

  // Track selected rows
  const [selectedRows, setSelectedRows] = React.useState<Lead[]>([])

  // Track if filters are enabled (eye icon toggle)
  const [filtersEnabled, setFiltersEnabled] = React.useState(true)

  // Add to List modal state
  const [addToListOpen, setAddToListOpen] = React.useState(false)

  // View Lists modal state (when no leads selected)
  const [viewListsOpen, setViewListsOpen] = React.useState(false)

  // AI Search modal state
  const [aiSearchOpen, setAiSearchOpen] = React.useState(false)

  // Cmd+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setAiSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Determine which filters to use:
  // - If AI filter is active, use AI filters (manual filters are ignored)
  // - Otherwise, use manual filters (or empty if disabled)
  const aiFiltersForApi = getAiFiltersForApi()
  const activeFilters = React.useMemo(() => {
    if (isAiFilterActive && aiFiltersForApi) {
      return aiFiltersForApi
    }
    return filtersEnabled ? filters : { limit: filters.limit, offset: filters.offset }
  }, [isAiFilterActive, aiFiltersForApi, filtersEnabled, filters])

  const { leads, meta, isLoading } = useLeads(activeFilters)

  const handleApplyAiFilters = (newFilters: AiFilters, description: string) => {
    setAiFilter(newFilters, description)
  }

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
          
          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Inbox */}
            <Link
              href="/inbox"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors"
              title="Inbox"
            >
              <Inbox className="h-4 w-4" />
              Inbox
            </Link>

            {/* Sign Out */}
            <button
              onClick={() => {
                localStorage.removeItem("session_token");
                localStorage.removeItem("access_token");
                window.location.href = "/sign-in";
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* AI Search Button */}
            <button
              onClick={() => setAiSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors"
              title="AI Search (⌘K)"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              AI Search
            </button>

            {/* View Lists / Add to List - Context-aware button */}
            {selectedRows.length === 0 ? (
              <button
                onClick={() => setViewListsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors"
                title="View and manage your lists"
              >
                <List className="h-4 w-4" />
                View Lists
              </button>
            ) : (
              <button
                onClick={() => setAddToListOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors"
                title={`Add ${selectedRows.length} leads to a list`}
              >
                <ListPlus className="h-4 w-4" />
                Add to List ({selectedRows.length})
              </button>
            )}

            {/* Columns */}
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary/50 transition-colors"
              title="Columns"
            >
              Columns
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {/* Filters control */}
            <div className="flex items-center rounded-md border border-border">
              {/* Filters label */}
              <span className={cn(
                "px-3 py-1.5 text-sm font-medium",
                hasActiveFilters || isAiFilterActive || isListFilterActive ? "text-foreground" : "text-muted-foreground"
              )}>
                Filters
              </span>

              {/* Eye toggle - enable/disable filters */}
              <button
                onClick={() => {
                  if (hasActiveFilters || isAiFilterActive || isListFilterActive) {
                    setFiltersEnabled(!filtersEnabled)
                  }
                }}
                disabled={!hasActiveFilters && !isAiFilterActive && !isListFilterActive}
                className={cn(
                  "flex items-center justify-center p-1.5 transition-colors border-l border-border",
                  (hasActiveFilters || isAiFilterActive || isListFilterActive) && filtersEnabled
                    ? "text-foreground hover:bg-secondary/50"
                    : "text-muted-foreground hover:bg-secondary/50",
                  !hasActiveFilters && !isAiFilterActive && !isListFilterActive && "opacity-50 cursor-not-allowed"
                )}
                title={filtersEnabled ? "Disable filters" : "Enable filters"}
              >
                {filtersEnabled ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>

              {/* X to clear filters */}
              <button
                onClick={() => {
                  if (isAiFilterActive) {
                    clearAiFilter()
                  } else if (isListFilterActive) {
                    clearListFilter()
                  } else {
                    clearAll()
                  }
                }}
                disabled={!hasActiveFilters && !isAiFilterActive && !isListFilterActive}
                className={cn(
                  "flex items-center justify-center p-1.5 transition-colors border-l border-border",
                  (hasActiveFilters || isAiFilterActive || isListFilterActive)
                    ? "text-foreground hover:bg-secondary/50"
                    : "text-muted-foreground opacity-50 cursor-not-allowed"
                )}
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Filter Pill - shows when AI filter is active */}
        {isAiFilterActive && aiFilterDescription && (
          <div className="px-6 py-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {aiFilterDescription}
                </span>
                <button
                  onClick={clearAiFilter}
                  className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                  title="Clear AI filter"
                >
                  <X className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                AI-powered search active. Manual filters are paused.
              </span>
            </div>
          </div>
        )}

        {/* List Filter Pill - shows when filtering by a list */}
        {isListFilterActive && listFilterName && (
          <div className="px-6 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                <List className="h-3.5 w-3.5 text-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {listFilterName}
                </span>
                <button
                  onClick={clearListFilter}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors"
                  title="Clear list filter"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                Showing leads from this list only.
              </span>
            </div>
          </div>
        )}

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

      {/* Add to List Modal */}
      <AddToListModal
        open={addToListOpen}
        onOpenChange={setAddToListOpen}
        selectedLeads={selectedRows}
        onAddToList={(listId) => {
          console.log(`Adding ${selectedRows.length} leads to list ${listId}`)
          // TODO: API call to add leads to list
        }}
        onCreateList={(name, description) => {
          console.log(`Creating list "${name}" with ${selectedRows.length} leads`)
          // TODO: API call to create list and add leads
        }}
      />

      {/* AI Search Modal */}
      <AiSearchModal
        open={aiSearchOpen}
        onOpenChange={setAiSearchOpen}
        onApplyFilters={handleApplyAiFilters}
      />

      {/* View Lists Modal */}
      <ViewListsModal
        open={viewListsOpen}
        onOpenChange={setViewListsOpen}
        onSelectList={(listId, listName) => {
          setListFilter(listId, listName)
        }}
        onRenameList={(listId, newName) => {
          console.log(`Renaming list ${listId} to "${newName}"`)
          // TODO: API call to rename list
        }}
        onDeleteList={(listId) => {
          console.log(`Deleting list ${listId}`)
          // TODO: API call to delete list
          // Clear list filter if the deleted list was active
          if (isListFilterActive) {
            clearListFilter()
          }
        }}
        onCreateList={(name, description) => {
          console.log(`Creating new list "${name}"`)
          // TODO: API call to create list
        }}
      />
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
