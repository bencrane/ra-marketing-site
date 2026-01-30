"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CTACardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonLabel: string
  onAction: () => void
  disabled?: boolean
  className?: string
}

export function CTACard({
  icon,
  title,
  description,
  buttonLabel,
  onAction,
  disabled = false,
  className = "",
}: CTACardProps) {
  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-5 text-center">
        <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
          {icon}
        </div>
        <h2 className="text-base font-semibold mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button onClick={onAction} disabled={disabled}>
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
