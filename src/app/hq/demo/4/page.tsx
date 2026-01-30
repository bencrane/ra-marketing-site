"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Building2, FileSpreadsheet, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Papa from "papaparse"
import { DemoPageLayout, ResultsTable, type TableColumn } from "../components"

interface Lead {
  first_name?: string
  last_name?: string
  company_name?: string
  domain?: string
  work_email?: string
  phone_number?: string
  [key: string]: string | undefined
}

const LEAD_COLUMNS: TableColumn<Lead>[] = [
  { key: "first_name", label: "First Name", width: "15%" },
  { key: "last_name", label: "Last Name", width: "15%" },
  { key: "company_name", label: "Company", width: "18%" },
  { key: "domain", label: "Domain", width: "17%" },
  { key: "work_email", label: "Email", width: "20%" },
  { key: "phone_number", label: "Phone", width: "15%" },
]

export default function Demo4Page() {
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault()
    if (domain.trim()) {
      setSavedDomain(domain.trim())
    }
  }

  const parseCSV = useCallback((file: File) => {
    setFileName(file.name)
    Papa.parse<Lead>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setLeads(results.data)
      },
      error: (error) => {
        console.error("CSV parse error:", error)
      },
    })
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      parseCSV(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "text/csv") {
      parseCSV(file)
    }
  }, [parseCSV])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearFile = () => {
    setLeads([])
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <DemoPageLayout>
      {/* Domain Input Section */}
      <div className="max-w-lg mx-auto text-center mb-8">
        <div className="inline-flex p-2 rounded-lg bg-secondary mb-4">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-bold tracking-tight mb-1">Enrich Uploaded Leads</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Upload a CSV of work emails to get full enrichment + customer alumni matching.
        </p>

        <form onSubmit={handleSaveDomain}>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter company domain (e.g. acme.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!domain.trim()}>
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {savedDomain && (
          <p className="text-sm text-muted-foreground mt-3">
            Company: <span className="text-foreground font-medium">{savedDomain}</span>
          </p>
        )}
      </div>

      {/* CSV Upload Section */}
      {savedDomain && (
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!fileName ? (
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent className="p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Drop your CSV file here</p>
                <p className="text-xs text-muted-foreground">
                  or click to browse from your computer
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{fileName}</p>
                    <p className="text-xs text-muted-foreground">{leads.length} leads loaded</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Leads Table */}
      {leads.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">
            {leads.length} leads ready for enrichment
          </p>
          <ResultsTable
            data={leads}
            columns={LEAD_COLUMNS}
            maxHeight="300px"
            getRowKey={(lead, i) => lead.work_email || String(i)}
          />
        </div>
      )}
    </DemoPageLayout>
  )
}
