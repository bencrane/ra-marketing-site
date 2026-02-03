"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Inbox, Users, Target, Layers } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const NAV_CARDS: NavCard[] = [
  {
    title: "Inbound Leads",
    description: "Inbound leads enrichment data",
    href: "/hq/client-preview/securitypalhq/inbound",
    icon: <Inbox className="h-6 w-6" />,
  },
  {
    title: "CRM Leads",
    description: "CRM leads enrichment data",
    href: "/hq/client-preview/securitypalhq/crm-leads",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Outbound TAM",
    description: "Outbound total addressable market",
    href: "/hq/client-preview/securitypalhq/outbound-tam",
    icon: <Target className="h-6 w-6" />,
  },
  {
    title: "All",
    description: "All leads and data combined",
    href: "/hq/client-preview/securitypalhq/all",
    icon: <Layers className="h-6 w-6" />,
  },
]

export default function SecurityPalHQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/hq/client-preview" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">securitypalhq.com</span>
          </Link>
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
