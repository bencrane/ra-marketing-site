"use client"

import * as React from "react"

export interface ToolbarSettings {
  showViewToggle: boolean      // Companies/People toggle
  showInbox: boolean           // Inbox button
  showSignOut: boolean         // Sign out button
  showAiSearch: boolean        // AI Search button
  showViewLists: boolean       // View Lists / Add to List button
  showColumns: boolean         // Columns button
  showFilters: boolean         // Filters control (with eye and X)
}

const DEFAULT_SETTINGS: ToolbarSettings = {
  showViewToggle: true,
  showInbox: true,
  showSignOut: true,
  showAiSearch: true,
  showViewLists: true,
  showColumns: true,
  showFilters: true,
}

const STORAGE_KEY = "toolbar_settings"

function loadSettings(): ToolbarSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error("Failed to load toolbar settings:", e)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: ToolbarSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error("Failed to save toolbar settings:", e)
  }
}

export function useToolbarSettings() {
  const [settings, setSettingsState] = React.useState<ToolbarSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load settings from localStorage on mount
  React.useEffect(() => {
    setSettingsState(loadSettings())
    setIsLoaded(true)
  }, [])

  const setSettings = React.useCallback((newSettings: Partial<ToolbarSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings }
      saveSettings(updated)
      return updated
    })
  }, [])

  const resetSettings = React.useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
  }, [])

  return {
    settings,
    setSettings,
    resetSettings,
    isLoaded,
  }
}
