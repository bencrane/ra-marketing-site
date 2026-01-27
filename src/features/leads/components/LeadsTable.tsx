"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
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
import { components } from "@/api/types"
import { LeadNameCell, CompanyCell, TitleCell } from "./cells"

// Use generated types from OpenAPI spec
export type Lead = components["schemas"]["Lead"]

export const columns: ColumnDef<Lead>[] = [
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
    cell: ({ row }) => <LeadNameCell lead={row.original} />,
  },
  {
    accessorKey: "company_name",
    header: "Company",
    size: 240,
    minSize: 120,
    maxSize: 400,
    cell: ({ row }) => <CompanyCell lead={row.original} />,
  },
  {
    accessorKey: "matched_cleaned_job_title",
    header: "Title",
    size: 280,
    minSize: 120,
    maxSize: 500,
    cell: ({ row }) => <TitleCell lead={row.original} />,
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange')
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
  })

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, table, onSelectionChange])

  const handleRowClick = (row: TData) => {
    // Cast to Lead type to access person_id
    const lead = row as Lead
    if (lead.person_id) {
      router.push(`/leads/${lead.person_id}`)
    }
  }

  return (
    <div className="border border-border bg-card">
      <Table style={{ width: table.getCenterTotalSize(), tableLayout: 'fixed' }}>
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-card relative group"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-4 cursor-col-resize select-none touch-none ${
                          header.column.getIsResizing() ? 'bg-primary' : ''
                        }`}
                        style={{ transform: 'translateX(50%)' }}
                      >
                        <div className={`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity ${
                          header.column.getIsResizing() ? 'opacity-100 bg-primary' : 'bg-border'
                        }`} />
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
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
                  onClick={() => handleRowClick(row.original)}
                  className="border-b border-border/30 hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 text-sm align-middle" style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
  )
}
