"use client"

import * as React from "react"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useQueryState, parseAsBoolean } from 'nuqs'
import useSWR from "swr"
import { fetcher, API_BASE_URL } from "@/lib/api"

export function Sidebar() {
  const [isCompanyOpen, setIsCompanyOpen] = React.useState(true)
  const [isPersonOpen, setIsPersonOpen] = React.useState(true)
  const [isLocationOpen, setIsLocationOpen] = React.useState(true)
  const [isSignalsOpen, setIsSignalsOpen] = React.useState(false)

  // Signal States (URL Synced)
  const [newInRole, setNewInRole] = useQueryState('new_in_role', parseAsBoolean)
  const [recentlyPromoted, setRecentlyPromoted] = useQueryState('recently_promoted', parseAsBoolean)
  const [atVcPortfolio, setAtVcPortfolio] = useQueryState('at_vc_portfolio', parseAsBoolean)
  const [workedAtCustomer, setWorkedAtCustomer] = useQueryState('worked_at_customer', parseAsBoolean)
  const [pastEmployer, setPastEmployer] = useQueryState('past_employer', parseAsBoolean)

  // Company Filters (URL Synced)
  const [industry, setIndustry] = useQueryState('industry')
  const [companySize, setCompanySize] = useQueryState('employee_range')
  const [companyName, setCompanyName] = useQueryState('company_name')
  const [companyDomain, setCompanyDomain] = useQueryState('company_domain')

  // Person Filters (URL Synced)
  const [jobFunction, setJobFunction] = useQueryState('job_function')
  const [seniority, setSeniority] = useQueryState('seniority')
  const [jobTitle, setJobTitle] = useQueryState('job_title')
  const [fullName, setFullName] = useQueryState('full_name')

  // Location Filters (URL Synced)
  const [personCountry, setPersonCountry] = useQueryState('person_country')
  const [personState, setPersonState] = useQueryState('person_state')
  const [personCity, setPersonCity] = useQueryState('person_city')

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col z-30">
      <div className="p-6">
        <h1 className="text-lg font-bold tracking-tight text-foreground">Revenue Activation</h1>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
        <div className="space-y-8">

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">All Leads</h2>
          </div>

          {/* COMPANY Section */}
          <Collapsible open={isCompanyOpen} onOpenChange={setIsCompanyOpen} className="space-y-3">
            <div className="flex items-center justify-between group">
              <h3 className="sidebar-section-header transition-colors">Company</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-zinc-800 text-zinc-500">
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !isCompanyOpen && "-rotate-90")} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 pt-1">
              <FilterFieldWithSuggestions
                label="Industry"
                placeholder="Type to search industries..."
                value={industry}
                onValueChange={setIndustry}
                endpoint="/api/filters/industries"
              />
              <FilterField
                label="Company Size"
                placeholder="e.g. 51-200"
                value={companySize}
                onValueChange={setCompanySize}
              />
              <FilterField
                label="Company Name"
                placeholder="Enter company name"
                value={companyName}
                onValueChange={setCompanyName}
              />
              <FilterField
                label="Company Domain"
                placeholder="e.g. stripe.com"
                value={companyDomain}
                onValueChange={setCompanyDomain}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* PERSON Section */}
          <Collapsible open={isPersonOpen} onOpenChange={setIsPersonOpen} className="space-y-3">
            <div className="flex items-center justify-between group">
              <h3 className="sidebar-section-header transition-colors">Person</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-zinc-800 text-zinc-500">
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !isPersonOpen && "-rotate-90")} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 pt-1">
              <FilterField
                label="Job Function"
                placeholder="e.g. Sales, Marketing"
                value={jobFunction}
                onValueChange={setJobFunction}
              />
              <FilterField
                label="Seniority"
                placeholder="e.g. VP, Director"
                value={seniority}
                onValueChange={setSeniority}
              />
              <FilterField
                label="Job Title"
                placeholder="e.g. VP of Sales"
                value={jobTitle}
                onValueChange={setJobTitle}
              />
              <FilterField
                label="Full Name"
                placeholder="Search by name"
                value={fullName}
                onValueChange={setFullName}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* LOCATION Section */}
          <Collapsible open={isLocationOpen} onOpenChange={setIsLocationOpen} className="space-y-3">
            <div className="flex items-center justify-between group">
              <h3 className="sidebar-section-header transition-colors">Location</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-zinc-800 text-zinc-500">
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !isLocationOpen && "-rotate-90")} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 pt-1">
              <FilterField
                label="Country"
                placeholder="e.g. United States"
                value={personCountry}
                onValueChange={setPersonCountry}
              />
              <FilterField
                label="State"
                placeholder="e.g. California"
                value={personState}
                onValueChange={setPersonState}
              />
              <FilterField
                label="City"
                placeholder="e.g. San Francisco"
                value={personCity}
                onValueChange={setPersonCity}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* SIGNALS Section */}
          <Collapsible open={isSignalsOpen} onOpenChange={setIsSignalsOpen} className="space-y-3">
            <div className="flex items-center justify-between group">
              <h3 className="sidebar-section-header transition-colors">Signals</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-zinc-800 text-zinc-500">
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !isSignalsOpen && "-rotate-90")} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 pt-1">
              <SignalCheckbox
                id="new-in-role"
                label="New in Role"
                checked={newInRole || false}
                onCheckedChange={(v) => setNewInRole(v ? true : null)}
              />
              <SignalCheckbox
                id="recently-promoted"
                label="Recently Promoted"
                checked={recentlyPromoted || false}
                onCheckedChange={(v) => setRecentlyPromoted(v ? true : null)}
              />
              <SignalCheckbox
                id="at-vc-portfolio"
                label="At VC Portfolio"
                checked={atVcPortfolio || false}
                onCheckedChange={(v) => setAtVcPortfolio(v ? true : null)}
              />
              <SignalCheckbox
                id="worked-at-customer"
                label="Worked at Customer"
                checked={workedAtCustomer || false}
                onCheckedChange={(v) => setWorkedAtCustomer(v ? true : null)}
              />
              <SignalCheckbox
                id="past-employer"
                label="Past Employer"
                checked={pastEmployer || false}
                onCheckedChange={(v) => setPastEmployer(v ? true : null)}
              />
            </CollapsibleContent>
          </Collapsible>

        </div>
      </ScrollArea>
    </aside>
  )
}

function SignalCheckbox({ id, label, checked, onCheckedChange }: { id: string; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center space-x-3 group py-1">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-zinc-700 bg-zinc-950/50 data-[state=checked]:bg-zinc-100 data-[state=checked]:text-zinc-900 data-[state=checked]:border-zinc-100 h-4 w-4 rounded-[4px]"
      />
      <Label htmlFor={id} className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 cursor-pointer transition-colors">
        {label}
      </Label>
    </div>
  )
}

// For fields with predefined options (like Industry) - shows suggestions, only allows valid values
function FilterFieldWithSuggestions({
  label,
  placeholder,
  value,
  onValueChange,
  endpoint,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  onValueChange: (val: string | null) => void;
  endpoint: string;
}) {
  const [inputValue, setInputValue] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Fetch available options from API
  const { data } = useSWR<{ data: Array<{ value: string; count: number }> }>(
    `${API_BASE_URL}${endpoint}`,
    fetcher
  )

  const availableOptions = data?.data.map(o => o.value) || []

  // Filter suggestions based on input
  const suggestions = inputValue.trim()
    ? availableOptions.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 8)
    : []

  // Parse comma-separated values into array
  const values = value ? value.split(',').map(v => v.trim()).filter(Boolean) : []

  const addValue = (newValue: string) => {
    if (!values.includes(newValue)) {
      const newValues = [...values, newValue]
      onValueChange(newValues.join(','))
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeValue = (valueToRemove: string) => {
    const newValues = values.filter(v => v !== valueToRemove)
    onValueChange(newValues.length > 0 ? newValues.join(',') : null)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-zinc-500">{label}</Label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 text-zinc-200 rounded-md"
            >
              {v}
              <button
                type="button"
                onClick={() => removeValue(v)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          className="h-8 text-xs bg-zinc-950/50 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-zinc-700 focus-visible:border-zinc-700"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 150)
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg max-h-48 overflow-auto">
            {suggestions.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                onMouseDown={() => addValue(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// For free text fields (like Job Title) - accepts any value
function FilterField({
  label,
  placeholder,
  value,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  onValueChange: (val: string | null) => void;
}) {
  const [inputValue, setInputValue] = React.useState("")

  // Parse comma-separated values into array
  const values = value ? value.split(',').map(v => v.trim()).filter(Boolean) : []

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newValue = inputValue.trim()
      if (!values.includes(newValue)) {
        const newValues = [...values, newValue]
        onValueChange(newValues.join(','))
      }
      setInputValue("")
    }
  }

  const removeValue = (valueToRemove: string) => {
    const newValues = values.filter(v => v !== valueToRemove)
    onValueChange(newValues.length > 0 ? newValues.join(',') : null)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-zinc-500">{label}</Label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 text-zinc-200 rounded-md"
            >
              {v}
              <button
                type="button"
                onClick={() => removeValue(v)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        className="h-8 text-xs bg-zinc-950/50 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-zinc-700 focus-visible:border-zinc-700"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
