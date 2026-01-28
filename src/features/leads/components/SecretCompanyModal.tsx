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
import { Building2, Loader2 } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

interface CompanySearchResult {
  name: string
  domain: string
  industry?: string
  employee_range?: string
}

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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<CompanySearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<CompanySearchResult | null>(null)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Search for companies as user types
  React.useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/companies/search?q=${encodeURIComponent(searchQuery)}`
        )
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.data || data || [])
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Company search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSelectCompany = (company: CompanySearchResult) => {
    setSelectedCompany(company)
    setSearchQuery(company.name)
    setShowSuggestions(false)
  }

  const handleSave = () => {
    if (selectedCompany) {
      onSave({
        companyName: selectedCompany.name,
        companyDomain: selectedCompany.domain,
      })
    } else if (searchQuery) {
      onSave({
        companyName: searchQuery,
        companyDomain: undefined,
      })
    }
    // Reset state
    setSearchQuery("")
    setSelectedCompany(null)
    setSuggestions([])
    onOpenChange(false)
  }

  const handleClose = () => {
    setSearchQuery("")
    setSelectedCompany(null)
    setSuggestions([])
    setShowSuggestions(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5" />
            Target Company
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2 relative">
            <Label htmlFor="company-search" className="text-sm text-muted-foreground">
              Search Company
            </Label>
            <div className="relative">
              <Input
                id="company-search"
                placeholder="Type company name or domain..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedCompany(null)
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="bg-input/30 border-border pr-8"
                autoComplete="off"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((company, index) => (
                  <button
                    key={`${company.domain}-${index}`}
                    onClick={() => handleSelectCompany(company)}
                    className="w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="font-medium text-sm text-foreground">{company.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{company.domain}</span>
                      {company.industry && (
                        <>
                          <span>•</span>
                          <span>{company.industry}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected company display */}
          {selectedCompany && (
            <div className="p-3 bg-secondary/30 rounded-md border border-border">
              <div className="font-medium text-foreground">{selectedCompany.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedCompany.domain}
                {selectedCompany.industry && ` • ${selectedCompany.industry}`}
                {selectedCompany.employee_range && ` • ${selectedCompany.employee_range} employees`}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!searchQuery && !selectedCompany}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
