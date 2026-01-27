"use client"

import * as React from "react"

type SidebarState = "expanded" | "collapsed"

interface SidebarContextValue {
  state: SidebarState
  isLocked: boolean
  isHovered: boolean
  toggle: () => void
  setLocked: (locked: boolean) => void
  setHovered: (hovered: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SidebarState>("expanded")
  const [isLocked, setLocked] = React.useState(true)
  const [isHovered, setHovered] = React.useState(false)

  const toggle = React.useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
  }, [])

  const value = React.useMemo(
    () => ({
      state,
      isLocked,
      isHovered,
      toggle,
      setLocked,
      setHovered,
    }),
    [state, isLocked, isHovered, toggle]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
