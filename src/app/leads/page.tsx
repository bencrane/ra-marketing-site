"use client"

import * as React from "react"
import { useQueryState, parseAsBoolean, parseAsInteger } from 'nuqs'
import { DataTable, columns } from "@/components/leads-table"
import { useLeads } from "@/hooks/use-leads"
import { Sidebar } from "@/components/sidebar"

export default function LeadsPage() {
  // Pagination
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(50))
  const [offset] = useQueryState('offset', parseAsInteger.withDefault(0))

  // Signals
  const [newInRole] = useQueryState('new_in_role', parseAsBoolean)
  const [recentlyPromoted] = useQueryState('recently_promoted', parseAsBoolean)
  const [atVcPortfolio] = useQueryState('at_vc_portfolio', parseAsBoolean)
  const [workedAtCustomer] = useQueryState('worked_at_customer', parseAsBoolean)
  const [pastEmployer] = useQueryState('past_employer', parseAsBoolean)

  // Company Filters
  const [industry] = useQueryState('industry')
  const [employeeRange] = useQueryState('employee_range')
  const [companyName] = useQueryState('company_name')
  const [companyDomain] = useQueryState('company_domain')

  // Person Filters
  const [jobFunction] = useQueryState('job_function')
  const [seniority] = useQueryState('seniority')
  const [jobTitle] = useQueryState('job_title')
  const [fullName] = useQueryState('full_name')

  // Location Filters
  const [personCountry] = useQueryState('person_country')
  const [personState] = useQueryState('person_state')
  const [personCity] = useQueryState('person_city')

  // Fetch data with all filters
  const { leads, meta, isLoading } = useLeads({
    limit,
    offset,
    // Signals
    signal_new_in_role: newInRole || false,
    signal_recently_promoted: recentlyPromoted || false,
    signal_at_vc_portfolio: atVcPortfolio || false,
    signal_worked_at_customer: workedAtCustomer || false,
    signal_past_employer: pastEmployer || false,
    // Company
    industry,
    employee_range: employeeRange,
    company_name: companyName,
    company_domain: companyDomain,
    // Person
    job_function: jobFunction,
    seniority,
    job_title: jobTitle,
    full_name: fullName,
    // Location
    person_country: personCountry,
    person_state: personState,
    person_city: personCity,
  })

  // Pass API data directly to table - no transformation layer
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="ml-[280px] flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <DataTable columns={columns} data={leads} isLoading={isLoading} />

          {/* Pagination Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <div>
              SHOWING {meta.total > 0 ? meta.offset + 1 : 0}-{Math.min(meta.offset + meta.limit, meta.total)} OF {meta.total.toLocaleString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
