"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Settings, RotateCcw, Building2, User, Inbox, LogOut, Sparkles, List, SlidersHorizontal, Eye } from "lucide-react"
import { useToolbarSettings } from "@/features/settings"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolbarItemConfig {
  key: keyof ReturnType<typeof useToolbarSettings>["settings"]
  label: string
  description: string
  icon: React.ReactNode
}

const TOOLBAR_ITEMS: ToolbarItemConfig[] = [
  {
    key: "showViewToggle",
    label: "View Toggle",
    description: "Companies / People toggle buttons",
    icon: <div className="flex gap-1"><Building2 className="h-4 w-4" /><User className="h-4 w-4" /></div>,
  },
  {
    key: "showInbox",
    label: "Inbox",
    description: "Inbox navigation button",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    key: "showSignOut",
    label: "Sign Out",
    description: "Sign out button",
    icon: <LogOut className="h-4 w-4" />,
  },
  {
    key: "showAiSearch",
    label: "AI Search",
    description: "AI-powered search button (Cmd+K)",
    icon: <Sparkles className="h-4 w-4 text-primary" />,
  },
  {
    key: "showViewLists",
    label: "View Lists",
    description: "View Lists / Add to List button",
    icon: <List className="h-4 w-4" />,
  },
  {
    key: "showColumns",
    label: "Columns",
    description: "Column visibility control",
    icon: <SlidersHorizontal className="h-4 w-4" />,
  },
  {
    key: "showFilters",
    label: "Filters",
    description: "Filters control with target company and clear options",
    icon: <Eye className="h-4 w-4" />,
  },
]

export default function AdminPage() {
  const { settings, setSettings, resetSettings, isLoaded } = useToolbarSettings()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/leads"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leads
            </Link>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Toolbar Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Control which items appear in the leads page toolbar.
            </p>
          </div>

          {/* Settings List */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            {TOOLBAR_ITEMS.map((item, index) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between px-4 py-4",
                  index !== TOOLBAR_ITEMS.length - 1 && "border-b border-border"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 text-muted-foreground">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <Switch
                  checked={settings[item.key]}
                  onCheckedChange={(checked) => setSettings({ [item.key]: checked })}
                />
              </div>
            ))}
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground text-center">
            Settings are saved automatically and persist across sessions.
          </div>
        </div>
      </main>
    </div>
  )
}
