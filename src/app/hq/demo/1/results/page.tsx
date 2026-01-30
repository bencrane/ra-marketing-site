"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Demo1ResultsPage() {
  const searchParams = useSearchParams()
  const domain = searchParams.get("domain")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/hq/demo/1" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Alumni Matches</h1>
          {domain && (
            <p className="text-muted-foreground mt-1">
              ICP-relevant people who previously worked at {domain}&apos;s customers
            </p>
          )}
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Results will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
