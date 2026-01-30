"use client"

import { Card } from "@/components/ui/card"

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  width?: string
  render?: (item: T) => React.ReactNode
}

interface ResultsTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  maxHeight?: string
  emptyMessage?: string
  getRowKey?: (item: T, index: number) => string
}

export function ResultsTable<T extends Record<string, unknown>>({
  data,
  columns,
  maxHeight = "240px",
  emptyMessage = "No results found.",
  getRowKey = (_, i) => String(i),
}: ResultsTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-hidden">
        <table className="w-full text-xs table-fixed">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2 text-left font-medium text-muted-foreground"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto" style={{ maxHeight }}>
          <table className="w-full text-xs table-fixed">
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={getRowKey(item, i)}
                  className="border-t border-border hover:bg-secondary/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={String(col.key)}
                      className={`px-3 py-2 truncate ${
                        colIndex === 0 ? "font-medium" : "text-muted-foreground"
                      }`}
                      style={{ width: col.width }}
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
