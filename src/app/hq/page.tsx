"use client"

import Link from "next/link"
import { Presentation, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const NAV_CARDS: NavCard[] = [
  {
    title: "Demo",
    description: "Demo scenarios and use cases for customer presentations",
    href: "/hq/demo",
    icon: <Presentation className="h-6 w-6" />,
  },
]

export default function HQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-lg font-bold tracking-tight text-foreground">HQ</h1>
          <p className="text-sm text-muted-foreground mt-1">Internal Admin Dashboard</p>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
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
