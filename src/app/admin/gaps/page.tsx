"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { ArrowLeft, Database, RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react"
import { fetcher } from "@/lib/api"
import { cn } from "@/lib/utils"

// Types based on OpenAPI spec
interface GapRecipe {
  id: string
  label: string
  description: string
  source_table: string
  target_table: string
  join_column: string
  comparison: "not_in_target" | "in_target"
  priority: "P0" | "P1" | "P2"
}

interface GapCountResponse {
  recipe_id: string
  label: string
  count: number
  source_table: string
  target_table: string
}

interface GapSampleResponse {
  recipe_id: string
  label: string
  count: number
  sample: Record<string, unknown>[]
  limit: number
}

const priorityColors: Record<string, string> = {
  P0: "bg-red-500/20 text-red-400 border-red-500/30",
  P1: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  P2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

function RecipeCard({ recipe }: { recipe: GapRecipe }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSample, setShowSample] = useState(false)

  // Fetch count on demand (using local API proxy)
  const { data: countData, isLoading: countLoading, error: countError, mutate: refetchCount } = useSWR<GapCountResponse>(
    isExpanded ? `/api/admin/gaps/recipes/${recipe.id}/count` : null,
    fetcher
  )

  // Fetch sample on demand (using local API proxy)
  const { data: sampleData, isLoading: sampleLoading, error: sampleError } = useSWR<GapSampleResponse>(
    showSample ? `/api/admin/gaps/recipes/${recipe.id}/sample?limit=10` : null,
    fetcher
  )

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-start justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-2 py-0.5 text-xs font-medium rounded border",
              priorityColors[recipe.priority]
            )}>
              {recipe.priority}
            </span>
            <h3 className="font-medium text-foreground truncate">{recipe.label}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Source:</span>{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{recipe.source_table}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Target:</span>{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{recipe.target_table}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Join:</span>{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{recipe.join_column}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Comparison:</span>{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{recipe.comparison}</code>
            </div>
          </div>

          {/* Count section */}
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Records matching gap:</span>
              <div className="text-2xl font-bold text-foreground">
                {countLoading ? (
                  <span className="text-muted-foreground animate-pulse">Loading...</span>
                ) : countError ? (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Error loading count
                  </span>
                ) : countData ? (
                  countData.count.toLocaleString()
                ) : (
                  "—"
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                refetchCount()
              }}
              disabled={countLoading}
              className="p-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
              title="Refresh count"
            >
              <RefreshCw className={cn("h-4 w-4 text-muted-foreground", countLoading && "animate-spin")} />
            </button>
          </div>

          {/* Sample section */}
          <div>
            <button
              onClick={() => setShowSample(!showSample)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {showSample ? "Hide sample" : "View sample (10 records)"}
            </button>

            {showSample && (
              <div className="mt-3">
                {sampleLoading ? (
                  <div className="text-sm text-muted-foreground animate-pulse">Loading sample...</div>
                ) : sampleError ? (
                  <div className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Error loading sample
                  </div>
                ) : sampleData && sampleData.sample.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {Object.keys(sampleData.sample[0]).map((key) => (
                            <th key={key} className="text-left py-2 px-2 font-medium text-muted-foreground whitespace-nowrap">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData.sample.map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="py-2 px-2 text-foreground whitespace-nowrap max-w-[200px] truncate">
                                {value === null ? (
                                  <span className="text-muted-foreground italic">null</span>
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No sample data available</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function GapsPage() {
  const { data, isLoading, error } = useSWR<{ recipes: GapRecipe[] }>(
    `/api/admin/gaps/recipes`,
    fetcher
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-secondary">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Data Gaps</h1>
              <p className="text-sm text-muted-foreground">Identify and analyze data quality gaps</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg bg-card p-4 animate-pulse">
                <div className="h-5 bg-secondary rounded w-1/3 mb-2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Failed to load recipes</h2>
            <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
          </div>
        ) : data?.recipes && data.recipes.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {data.recipes.length} Recipes
              </h2>
            </div>
            {data.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">No recipes found</h2>
            <p className="text-sm text-muted-foreground">There are no gap analysis recipes configured.</p>
          </div>
        )}
      </main>
    </div>
  )
}
