"use client"

import Link from "next/link"
import { ArrowLeft, Users, ArrowRight, Clock, Globe, Upload, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface DemoCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

const DEMO_CARDS: DemoCard[] = [
  {
    id: "1",
    title: "#1 Show ICP Relevant People Who Used to Work at Their Current Customers",
    description: "Find leads who previously worked at your prospect's existing customers",
    icon: <Users className="h-6 w-6" />,
    href: "/hq/demo/1",
  },
  {
    id: "2",
    title: "#2 Show ICP People New in Their Role",
    description: "Job change timing signal — catch buyers when they're most likely to evaluate new tools",
    icon: <Clock className="h-6 w-6" />,
    href: "/hq/demo/2",
  },
  {
    id: "3",
    title: "#3 Show ICP People at Companies Visiting Your Website",
    description: "Web intent signal — using GrowthGraph.com as example client",
    icon: <Globe className="h-6 w-6" />,
    href: "/hq/demo/3",
  },
  {
    id: "4",
    title: "#4 Enrich Uploaded Leads",
    description: "CSV of work emails → full enrichment + customer alumni match",
    icon: <Upload className="h-6 w-6" />,
    href: "/hq/demo/4",
  },
  {
    id: "5",
    title: "#5 Show Companies Most Similar to Your Best Customers",
    description: "Lookalikes from scraping their site — find companies that match your best customers",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/hq/demo/5",
  },
]

export default function HQDemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/hq" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Demo</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_CARDS.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="h-full cursor-pointer group hover:border-foreground/20 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-secondary/80 transition-colors">
                      {card.icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-lg text-foreground mt-4">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
