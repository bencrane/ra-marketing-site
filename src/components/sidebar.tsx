"use client"

import * as React from "react"
import {
  ChevronDown,
  X,
  Building2,
  User,
  MapPin,
  Radio,
  PanelLeftClose,
  PanelLeft,
  Lock,
  LockOpen,
  DollarSign,
  Tag,
  Cpu,
  TrendingUp,
  Target,
  Copy,
  Users,
  CreditCard,
  FileText,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
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
import { useSidebar } from "./sidebar-context"

export function Sidebar() {
  const { state, isLocked, toggle, setLocked, setHovered } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [isCompanyOpen, setIsCompanyOpen] = React.useState(true)
  const [isPersonOpen, setIsPersonOpen] = React.useState(true)
  const [isLocationOpen, setIsLocationOpen] = React.useState(false)
  const [isSignalsOpen, setIsSignalsOpen] = React.useState(true)
  const [isFundingOpen, setIsFundingOpen] = React.useState(false)
  const [isPricingPostureOpen, setIsPricingPostureOpen] = React.useState(false)
  const [isTechnologiesOpen, setIsTechnologiesOpen] = React.useState(false)
  const [isRevenueOpen, setIsRevenueOpen] = React.useState(false)
  const [isCompetitiveOpen, setIsCompetitiveOpen] = React.useState(false)
  const [isLookalikesOpen, setIsLookalikesOpen] = React.useState(false)
  const [isHiringOpen, setIsHiringOpen] = React.useState(false)
  const [isPaymentsOpen, setIsPaymentsOpen] = React.useState(false)
  const [isPublicFilingsOpen, setIsPublicFilingsOpen] = React.useState(false)

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

  // Location Filters (URL Synced)
  const [personCountry, setPersonCountry] = useQueryState('person_country')
  const [personState, setPersonState] = useQueryState('person_state')
  const [personCity, setPersonCity] = useQueryState('person_city')

  // Business Model (URL Synced)
  const [isB2B, setIsB2B] = useQueryState('is_b2b', parseAsBoolean)
  const [isB2C, setIsB2C] = useQueryState('is_b2c', parseAsBoolean)
  const [isB2Both, setIsB2Both] = useQueryState('is_b2b_and_b2c', parseAsBoolean)

  // Funding Filters (URL Synced)
  const [totalRaised, setTotalRaised] = useQueryState('total_raised')
  const [lastRoundAmount, setLastRoundAmount] = useQueryState('last_round_amount')
  const [raisedWithin, setRaisedWithin] = useQueryState('raised_within_days')
  const [roundType, setRoundType] = useQueryState('round_type')
  const [vcFirm, setVcFirm] = useQueryState('vc_firm')

  // Pricing Posture Filters (URL Synced)
  const [howTheySell, setHowTheySell] = useQueryState('how_they_sell')
  const [howTheyPrice, setHowTheyPrice] = useQueryState('how_they_price')
  const [enterpriseReadiness, setEnterpriseReadiness] = useQueryState('enterprise_readiness')

  // Technologies (URL Synced)
  const [technologies, setTechnologies] = useQueryState('technologies')

  // Revenue (URL Synced)
  const [revenueRange, setRevenueRange] = useQueryState('revenue_range')

  // Competitive Positioning (URL Synced)
  const [competitors, setCompetitors] = useQueryState('competitors')

  // Lookalikes (URL Synced)
  const [lookalikes, setLookalikes] = useQueryState('lookalikes')

  // Hiring (URL Synced)
  const [hiringFor, setHiringFor] = useQueryState('hiring_for')

  // Payments Data (URL Synced)
  const [paymentsData, setPaymentsData] = useQueryState('payments_data')

  // Public Filings (URL Synced)
  const [publicFilings, setPublicFilings] = useQueryState('public_filings')

  // Additional Signals (URL Synced)
  const [recentlyRaised, setRecentlyRaised] = useQueryState('recently_raised', parseAsBoolean)
  const [rapidGrowth, setRapidGrowth] = useQueryState('rapid_growth', parseAsBoolean)

  return (
    <>
      {/* Collapsed state - just show expand button */}
      {isCollapsed && !isLocked && (
        <div className="fixed left-0 top-0 h-screen w-12 flex flex-col items-center pt-4 z-30">
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Expand sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Full sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[280px] border-r border-border bg-sidebar text-sidebar-foreground flex flex-col z-30 transition-transform duration-200",
          isCollapsed && !isLocked && "-translate-x-full"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border">
          <h1 className="text-base font-semibold tracking-tight text-foreground">Revenue Activation</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLocked(!isLocked)}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isLocked
                  ? "text-foreground hover:bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              title={isLocked ? "Unlock sidebar (auto-hide)" : "Lock sidebar open"}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
            </button>
          </div>
        </div>

      {/* View Label - matches table header height (h-11) */}
      <div className="h-11 px-4 flex items-center border-b border-border">
        <span className="text-sm font-medium text-foreground">All Leads</span>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 pt-4 pb-6 space-y-6">

          {/* COMPANY Section */}
          <Collapsible open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Company</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isCompanyOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              {/* Business Model - Side by side checkboxes */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Business Model</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsB2B(isB2B ? null : true)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                      isB2B
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50"
                    )}
                  >
                    B2B
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsB2C(isB2C ? null : true)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                      isB2C
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50"
                    )}
                  >
                    B2C
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsB2Both(isB2Both ? null : true)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                      isB2Both
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50"
                    )}
                  >
                    Both
                  </button>
                </div>
              </div>
              <FilterFieldWithSuggestions
                label="Industry"
                placeholder="Type to search industries..."
                value={industry}
                onValueChange={setIndustry}
                endpoint="/api/filters/industries"
              />
              <FilterFieldWithSuggestions
                label="Company Size"
                placeholder="e.g. 51-200"
                value={companySize}
                onValueChange={setCompanySize}
                endpoint="/api/filters/employee-ranges"
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
          <Collapsible open={isPersonOpen} onOpenChange={setIsPersonOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Person</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isPersonOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Job Title"
                placeholder="e.g. VP of Sales"
                value={jobTitle}
                onValueChange={setJobTitle}
              />
              <FilterFieldWithSuggestions
                label="Job Function"
                placeholder="e.g. Sales, Marketing"
                value={jobFunction}
                onValueChange={setJobFunction}
                endpoint="/api/filters/job-functions"
              />
              <FilterFieldWithSuggestions
                label="Seniority"
                placeholder="e.g. VP, Director"
                value={seniority}
                onValueChange={setSeniority}
                endpoint="/api/filters/seniorities"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* LOCATION Section */}
          <Collapsible open={isLocationOpen} onOpenChange={setIsLocationOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Location</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isLocationOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterFieldWithSuggestions
                label="Country"
                placeholder="e.g. United States"
                value={personCountry}
                onValueChange={setPersonCountry}
                endpoint="/api/filters/person-countries"
              />
              <FilterFieldWithSuggestions
                label="State"
                placeholder="e.g. California"
                value={personState}
                onValueChange={setPersonState}
                endpoint="/api/filters/person-states"
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
          <Collapsible open={isSignalsOpen} onOpenChange={setIsSignalsOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Radio className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Signals</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isSignalsOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2 pb-2">
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
                id="recently-raised"
                label="Recently Raised"
                checked={recentlyRaised || false}
                onCheckedChange={(v) => setRecentlyRaised(v ? true : null)}
              />
              <SignalCheckbox
                id="rapid-growth"
                label="Rapid Growth"
                checked={rapidGrowth || false}
                onCheckedChange={(v) => setRapidGrowth(v ? true : null)}
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

          {/* FUNDING Section */}
          <Collapsible open={isFundingOpen} onOpenChange={setIsFundingOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Funding</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isFundingOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Total Raised"
                placeholder="e.g. $10M+"
                value={totalRaised}
                onValueChange={setTotalRaised}
              />
              <FilterField
                label="Last Round Amount"
                placeholder="e.g. $5M-$20M"
                value={lastRoundAmount}
                onValueChange={setLastRoundAmount}
              />
              <FilterField
                label="Raised Within"
                placeholder="e.g. 90 days"
                value={raisedWithin}
                onValueChange={setRaisedWithin}
              />
              <FilterField
                label="Round Type"
                placeholder="e.g. Series A, Seed"
                value={roundType}
                onValueChange={setRoundType}
              />
              <FilterFieldWithSuggestions
                label="VC Firm"
                placeholder="e.g. Sequoia, a16z"
                value={vcFirm}
                onValueChange={setVcFirm}
                endpoint="/api/filters/vc-firms"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* PRICING POSTURE Section */}
          <Collapsible open={isPricingPostureOpen} onOpenChange={setIsPricingPostureOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Pricing Posture</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isPricingPostureOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="How They Sell"
                placeholder="e.g. Sales-led, Product-led"
                value={howTheySell}
                onValueChange={setHowTheySell}
              />
              <FilterField
                label="How They Price"
                placeholder="e.g. Usage, Seat, Flat"
                value={howTheyPrice}
                onValueChange={setHowTheyPrice}
              />
              <FilterField
                label="Enterprise Readiness"
                placeholder="e.g. SOC2, HIPAA"
                value={enterpriseReadiness}
                onValueChange={setEnterpriseReadiness}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* TECHNOLOGIES Section */}
          <Collapsible open={isTechnologiesOpen} onOpenChange={setIsTechnologiesOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Technologies</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isTechnologiesOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Tech Stack"
                placeholder="e.g. Salesforce, Snowflake"
                value={technologies}
                onValueChange={setTechnologies}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* REVENUE Section */}
          <Collapsible open={isRevenueOpen} onOpenChange={setIsRevenueOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Revenue</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isRevenueOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Revenue Range"
                placeholder="e.g. $1M-$10M"
                value={revenueRange}
                onValueChange={setRevenueRange}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* COMPETITIVE POSITIONING Section */}
          <Collapsible open={isCompetitiveOpen} onOpenChange={setIsCompetitiveOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Target className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Competitive Positioning</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isCompetitiveOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Competitors"
                placeholder="e.g. Salesforce, HubSpot"
                value={competitors}
                onValueChange={setCompetitors}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* LOOKALIKES Section */}
          <Collapsible open={isLookalikesOpen} onOpenChange={setIsLookalikesOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Lookalikes</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isLookalikesOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Similar To"
                placeholder="e.g. stripe.com"
                value={lookalikes}
                onValueChange={setLookalikes}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* HIRING Section */}
          <Collapsible open={isHiringOpen} onOpenChange={setIsHiringOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Hiring For</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isHiringOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Hiring For"
                placeholder="e.g. Engineering, Sales"
                value={hiringFor}
                onValueChange={setHiringFor}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* PAYMENTS DATA Section */}
          <Collapsible open={isPaymentsOpen} onOpenChange={setIsPaymentsOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Payments Data</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isPaymentsOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Payment Processor"
                placeholder="e.g. Stripe, Braintree"
                value={paymentsData}
                onValueChange={setPaymentsData}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* PUBLIC FILINGS Section */}
          <Collapsible open={isPublicFilingsOpen} onOpenChange={setIsPublicFilingsOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Public Filings</span>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", !isPublicFilingsOpen && "-rotate-90")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pb-2">
              <FilterField
                label="Filing Type"
                placeholder="e.g. SEC, 10-K"
                value={publicFilings}
                onValueChange={setPublicFilings}
              />
            </CollapsibleContent>
          </Collapsible>

        </div>
      </ScrollArea>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-border mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem("session_token");
            localStorage.removeItem("access_token");
            window.location.href = "/sign-in";
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
    </>
  )
}

function SignalCheckbox({ id, label, checked, onCheckedChange }: { id: string; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center space-x-3 group py-1.5 px-1 rounded-md hover:bg-secondary/30 transition-colors">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-border bg-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary h-4 w-4 rounded-[4px]"
      />
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors">
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
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {v}
              <button
                type="button"
                onClick={() => removeValue(v)}
                className="opacity-70 hover:opacity-100 transition-opacity"
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
          autoComplete="off"
          data-form-type="other"
          className="h-8 text-xs bg-input/30 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:border-ring"
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
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
            {suggestions.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full px-3 py-2 text-left text-xs text-popover-foreground hover:bg-secondary transition-colors"
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
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {v}
              <button
                type="button"
                onClick={() => removeValue(v)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        autoComplete="off"
        data-form-type="other"
        className="h-8 text-xs bg-input/30 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:border-ring"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
