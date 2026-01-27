"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Mail, Phone, Linkedin, Building2, GraduationCap, TrendingUp, Calendar, Users, DollarSign, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

// Mock data for now - will be replaced with API call
const mockPerson = {
  id: "1a407db8-a3f4-489f-a216-437e4773a1a1",
  full_name: "Amanda Foster",
  first_name: "Amanda",
  last_name: "Foster",
  latest_title: "VP of Partnerships",
  latest_company: "EduTech Solutions",
  company_domain: "edutechsolutions.com",
  latest_start_date: "2024-09-01",
  location_name: "Austin, Texas, United States",
  matched_city: "Austin",
  matched_state: "TX",
  matched_country: "United States",
  linkedin_url: "https://www.linkedin.com/in/amanda-foster/",
  matched_job_function: "Partnerships",
  matched_seniority: "VP",
  email: "amanda.foster@edutechsolutions.com",
  phone: "+1 (512) 555-0234",
  signals: ["New in Role", "Recently Funded"],
  company: {
    name: "EduTech Solutions",
    domain: "edutechsolutions.com",
    description: "EduTech Solutions provides learning management and educational technology platforms for K-12 schools and universities.",
    industry: "Education",
    employee_range: "201-500",
    headquarters: "Austin, TX",
    revenue: "$10M-$50M",
    recent_funding: {
      amount: "$15M",
      round: "Series A",
      date: "July 2024",
    },
  },
  work_history: [
    {
      company: "EduTech Solutions",
      title: "VP of Partnerships",
      start_date: "2024-09",
      end_date: null,
      is_current: true,
    },
    {
      company: "Learning Innovations",
      title: "Director of Partnerships",
      start_date: "2021-06",
      end_date: "2024-08",
      is_current: false,
    },
    {
      company: "EdTech Ventures",
      title: "Partnership Manager",
      start_date: "2018-09",
      end_date: "2021-05",
      is_current: false,
    },
  ],
  education: [
    {
      institution: "University of Texas at Austin",
      degree: "MA",
      field: "Education Technology",
      year: "2018",
    },
    {
      institution: "Rice University",
      degree: "BA",
      field: "Education",
      year: "2015",
    },
  ],
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function calculateDaysInRole(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function PersonProfilePage() {
  const params = useParams()
  const personId = params.personId as string
  const [activeTab, setActiveTab] = React.useState<"lead" | "company">("lead")

  // For now, use mock data. Later: fetch from API using personId
  const person = mockPerson
  const daysInRole = calculateDaysInRole(person.latest_start_date)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Header Card */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between">
            <div className="flex gap-5">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-medium text-muted-foreground shrink-0">
                {getInitials(person.full_name)}
              </div>

              {/* Main Info */}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{person.full_name}</h1>
                <p className="text-muted-foreground mt-0.5">{person.latest_title}</p>
                <p className="text-foreground font-medium">{person.latest_company}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
                  {person.company.description}
                </p>

                {/* Signal Badges */}
                <div className="flex gap-2 mt-4">
                  {person.signals.includes("New in Role") && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-500/20 text-emerald-400">
                      New in Role
                    </span>
                  )}
                  {person.signals.includes("Recently Funded") && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-zinc-700 text-zinc-300">
                      Recently Funded
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info - Right Side */}
            <div className="space-y-3 text-sm shrink-0">
              {person.signals.includes("Recently Funded") && (
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                  High Priority
                </span>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{person.matched_city}, {person.matched_state}</span>
              </div>
              {person.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                    Email
                  </a>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                    {person.phone}
                  </a>
                </div>
              )}
              {person.linkedin_url && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lead / Company Tabs */}
        <div className="flex rounded-lg bg-muted p-1 w-fit">
          <button
            onClick={() => setActiveTab("lead")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "lead"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lead
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "company"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Company
          </button>
        </div>

        {activeTab === "lead" ? (
          <div className="space-y-6">
            {/* Executive Summary */}
            <section className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-3">Executive Summary</h2>
              <p className="text-muted-foreground leading-relaxed">
                {person.first_name} recently started as {person.latest_title} {daysInRole} days ago at a company that just raised {person.company.recent_funding?.amount} {person.company.recent_funding?.round} funding. This timing makes her highly receptive to partnership discussions, especially around education technology integrations.
              </p>
            </section>

            {/* Intelligence Signals */}
            <section className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-4">Intelligence Signals</h2>
              <div className="space-y-3">
                {person.signals.includes("New in Role") && (
                  <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-900/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium text-foreground">New in Role - High Receptivity Window</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      New leaders often evaluate existing vendors and seek quick wins. They&apos;re more open to meetings in their first 90 days.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Professional Background */}
            <section className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-6">Professional Background</h2>

              {/* Work History */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Work History</h3>
                <div className="space-y-0">
                  {person.work_history.map((job, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 py-4",
                        index < person.work_history.length - 1 && "border-b border-border"
                      )}
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{job.company}</p>
                        <p className="text-sm text-muted-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.start_date} - {job.is_current ? "Present" : job.end_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Education</h3>
                <div className="space-y-4">
                  {person.education.map((edu, index) => (
                    <div key={index} className="flex gap-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.degree}, {edu.field}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Description */}
            <section className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-3">Company Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {person.company.description}
              </p>
            </section>

            {/* Company Intelligence Signals */}
            {person.company.recent_funding && (
              <section className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-lg font-semibold mb-4">Intelligence Signals</h2>
                <div className="p-4 rounded-lg bg-purple-950/50 border border-purple-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="font-medium text-foreground">Recent Funding - Budget Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Recent funding round means budget for new initiatives. Companies typically invest in growth tools within 6 months of raising capital.
                  </p>
                </div>
              </section>
            )}

            {/* Company Intelligence Grid */}
            <section className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-6">Company Intelligence</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium text-foreground">{person.company.industry}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company Size</p>
                    <p className="font-medium text-foreground">{person.company.employee_range} employees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Headquarters</p>
                    <p className="font-medium text-foreground">{person.company.headquarters}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium text-foreground">{person.company.revenue}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Funding */}
            {person.company.recent_funding && (
              <section className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-lg font-semibold mb-6">Recent Funding</h2>
                <div className="flex gap-12">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xl font-semibold text-foreground">{person.company.recent_funding.amount}</p>
                      <p className="text-sm text-muted-foreground">{person.company.recent_funding.round}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xl font-semibold text-foreground">{person.company.recent_funding.date}</p>
                      <p className="text-sm text-muted-foreground">Funding date</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
