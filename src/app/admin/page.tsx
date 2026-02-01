"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Inbox, Settings, ArrowRight, Database, Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ADMIN_PASSWORD = "access"
const STORAGE_KEY = "admin_access_granted"

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const NAV_CARDS: NavCard[] = [
  {
    title: "Leads View",
    description: "Browse and filter leads, manage lists, and apply AI search",
    href: "/leads",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Master Inbox",
    description: "View and manage all incoming messages across channels",
    href: "/inbox",
    icon: <Inbox className="h-6 w-6" />,
  },
  {
    title: "Toolbar Settings",
    description: "Configure which items appear in the leads page toolbar",
    href: "/admin/settings",
    icon: <Settings className="h-6 w-6" />,
  },
  {
    title: "Data Gaps",
    description: "Identify and analyze data quality gaps across tables",
    href: "/admin/gaps",
    icon: <Database className="h-6 w-6" />,
  },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated this session
    const granted = sessionStorage.getItem(STORAGE_KEY)
    if (granted === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-secondary w-fit mb-2">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-lg font-bold tracking-tight text-foreground">Revenue Activation</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className={cn(
                "h-full card-glow cursor-pointer group"
              )}>
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
