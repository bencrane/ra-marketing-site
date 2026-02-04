"use client"

import { Suspense } from "react"
import Link from "next/link"
import * as React from "react"
import { ArrowLeft, ExternalLink } from "lucide-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider, useSidebar } from "@/components/sidebar-context"
import { cn } from "@/lib/utils"

// Type based on TargetClientLead schema
interface TargetClientLead {
  id: string
  target_client_domain: string
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
  person_linkedin_url?: string | null
  work_email?: string | null
  company_domain?: string | null
  company_name?: string | null
  company_linkedin_url?: string | null
  source?: string | null
  form_id?: string | null
  form_title?: string | null
  created_at?: string | null
}

interface TargetClientLeadsListResponse {
  success: boolean
  leads: TargetClientLead[]
  count: number
  error?: string | null
}

const columns: ColumnDef<TargetClientLead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-border"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-border"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
  },
  {
    accessorKey: "full_name",
    header: "Name",
    size: 200,
    minSize: 120,
    maxSize: 400,
    cell: ({ row }) => {
      const lead = row.original
      const name = lead.full_name || [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "—"
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{name}</span>
          {lead.person_linkedin_url && (
            <a
              href={lead.person_linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "company_name",
    header: "Company",
    size: 240,
    minSize: 120,
    maxSize: 400,
    cell: ({ row }) => {
      const lead = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="text-foreground">{lead.company_name || "—"}</span>
          {lead.company_linkedin_url && (
            <a
              href={lead.company_linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "work_email",
    header: "Email",
    size: 250,
    minSize: 150,
    maxSize: 350,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.work_email || "—"}</span>
    ),
  },
  {
    accessorKey: "company_domain",
    header: "Domain",
    size: 180,
    minSize: 100,
    maxSize: 250,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.company_domain || "—"}</span>
    ),
  },
  {
    accessorKey: "form_title",
    header: "Form",
    size: 150,
    minSize: 100,
    maxSize: 200,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.form_title || row.original.form_id || "—"}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Submitted",
    size: 140,
    minSize: 100,
    maxSize: 180,
    cell: ({ row }) => {
      const date = row.original.created_at
      if (!date) return <span className="text-muted-foreground">—</span>
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      return <span className="text-muted-foreground">{formatted}</span>
    },
  },
]

function useTargetClientLeads(targetClientDomain: string, source: string) {
  const [leads, setLeads] = React.useState<TargetClientLead[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/target-client/leads/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_client_domain: targetClientDomain,
            source: source,
          }),
        })

        if (!response.ok) throw new Error(`API error: ${response.status}`)

        const data: TargetClientLeadsListResponse = await response.json()
        if (!data.success) throw new Error(data.error || "Failed to fetch leads")

        setLeads(data.leads)
      } catch (err) {
        console.error("Failed to fetch leads:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch leads")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [targetClientDomain, source])

  return { leads, isLoading, error }
}

function DataTable({ columns, data, isLoading }: {
  columns: ColumnDef<TargetClientLead>[]
  data: TargetClientLead[]
  isLoading: boolean
}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: { rowSelection },
  })

  return (
    <div className="border border-border bg-card rounded-lg overflow-x-auto">
      <Table className="table-premium" style={{ width: table.getCenterTotalSize(), tableLayout: 'fixed' }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border/50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-11 px-4 text-xs font-medium text-muted-foreground bg-table-header"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border/30">
                {columns.map((_, j) => (
                  <TableCell key={j} className="px-4 py-4">
                    <Skeleton className="h-4 w-full bg-muted/50" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-border/30 hover:bg-table-row-hover transition-colors cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-4 text-sm align-middle" style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                No demo requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DemoRequestsPageInner() {
  const { state, isLocked } = useSidebar()
  const isCollapsed = state === "collapsed" && !isLocked
  const { leads, isLoading, error } = useTargetClientLeads("securitypalhq.com", "inbound_form")

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col h-screen overflow-x-auto overflow-y-hidden transition-[margin] duration-200",
        isCollapsed ? "ml-12" : "ml-[280px]"
      )}>
        {/* Header Bar */}
        <div className="h-14 flex items-center px-6 border-b border-border">
          <Link href="/hq/client-preview/securitypalhq" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">securitypalhq.com</span>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="h-11 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Demo Requests</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {!isLoading && <span>{leads.length} total</span>}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto px-6 pb-6 pt-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <DataTable columns={columns} data={leads} isLoading={isLoading} />

          {/* Pagination Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <div>
              Showing {leads.length > 0 ? 1 : 0}-{leads.length} of {leads.length}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function DemoRequestsPageSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="fixed left-0 top-0 h-screen w-[280px] border-r border-border bg-sidebar z-30" />
      <main className="ml-[280px] flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-14 flex items-center px-6 border-b border-border">
          <Skeleton className="h-4 w-24 bg-muted/50" />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Skeleton className="h-11 w-full bg-secondary/30" />
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
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

function DemoRequestsPageContent() {
  return (
    <SidebarProvider>
      <DemoRequestsPageInner />
    </SidebarProvider>
  )
}

export default function SecurityPalDemoRequestsPage() {
  return (
    <Suspense fallback={<DemoRequestsPageSkeleton />}>
      <DemoRequestsPageContent />
    </Suspense>
  )
}
