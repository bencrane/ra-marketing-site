"use client"

import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DemoSearchCardProps {
  icon: React.ReactNode
  title: string
  description: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  buttonLabel?: string
}

export function DemoSearchCard({
  icon,
  title,
  description,
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading = false,
  buttonLabel = "Search",
}: DemoSearchCardProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onSubmit()
  }

  return (
    <div className="max-w-lg mx-auto text-center mb-8">
      <div className="inline-flex p-2 rounded-lg bg-secondary mb-4">
        {icon}
      </div>
      <h1 className="text-lg font-bold tracking-tight mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground mb-5">{description}</p>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !value.trim()} size="sm">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1.5" />
                    {buttonLabel}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
