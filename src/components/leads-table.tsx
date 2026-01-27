"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
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
import { components } from "@/api/types"

// Use generated types from OpenAPI spec
export type Lead = components["schemas"]["Lead"]

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    size: 180,
    minSize: 100,
    maxSize: 400,
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.full_name || "—"}
      </div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company",
    size: 200,
    minSize: 100,
    maxSize: 400,
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.company_name || "—"}
      </div>
    ),
  },
  {
    accessorKey: "matched_cleaned_job_title",
    header: "Title",
    size: 250,
    minSize: 100,
    maxSize: 500,
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.matched_cleaned_job_title || "—"}
      </div>
    ),
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange')

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden card-elevated">
      <div className="overflow-x-auto">
        <Table style={{ width: table.getCenterTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 px-4 text-xs font-medium text-muted-foreground bg-table-header relative"
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
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-muted ${
                          header.column.getIsResizing() ? 'bg-primary' : ''
                        }`}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border/50">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-4 py-4">
                      <Skeleton className="h-4 w-full bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/50 hover:bg-table-row-hover transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4 text-sm align-top" style={{ width: cell.column.getSize() }}>
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
    </div>
  )
}
