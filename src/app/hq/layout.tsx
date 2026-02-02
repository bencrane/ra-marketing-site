"use client"

import { useState, useEffect } from "react"

const ACCESS_CODE = "access"
const STORAGE_KEY = "hq_access_granted"

export default function HQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setAccessGranted(stored === "true")
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, "true")
      setAccessGranted(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  // Loading state
  if (accessGranted === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Password gate
  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Revenue Activation
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError(false)
                }}
                placeholder="Access code"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/20"
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500 mt-2">
                  Invalid access code
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
