"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DemoPageLayoutProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export function DemoPageLayout({
  children,
  backHref = "/hq/demo",
  backLabel = "Demo",
}: DemoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{backLabel}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
