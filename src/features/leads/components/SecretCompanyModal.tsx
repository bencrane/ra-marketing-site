"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

interface SecretCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { companyName?: string; companyDomain?: string }) => void
}

export function SecretCompanyModal({
  open,
  onOpenChange,
  onSave,
}: SecretCompanyModalProps) {
  const [companyName, setCompanyName] = React.useState("")
  const [companyDomain, setCompanyDomain] = React.useState("")

  const handleSave = () => {
    if (companyName || companyDomain) {
      onSave({
        companyName: companyName || undefined,
        companyDomain: companyDomain || undefined,
      })
      setCompanyName("")
      setCompanyDomain("")
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (companyName || companyDomain)) {
      handleSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5" />
            Target Company
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-sm text-muted-foreground">
              Company Name
            </Label>
            <Input
              id="company-name"
              placeholder="e.g. Stripe"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-input/30 border-border"
              autoComplete="off"
            />
          </div>
          <div className="text-center text-xs text-muted-foreground">or</div>
          <div className="space-y-2">
            <Label htmlFor="company-domain" className="text-sm text-muted-foreground">
              Company Domain
            </Label>
            <Input
              id="company-domain"
              placeholder="e.g. stripe.com"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-input/30 border-border"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!companyName && !companyDomain}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
