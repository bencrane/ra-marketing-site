"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SecurityPalDemoRequestsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/hq/client-preview/securitypalhq" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Demo Requests</span>
          </Link>
        </div>
      </header>

      {/* Content - Empty for now */}
      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-muted-foreground">Content coming soon...</p>
        </div>
      </main>
    </div>
  )
}
