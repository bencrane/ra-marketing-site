"use client"

import * as React from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Lead } from "../index"

// Mock data - will be replaced with API call
const MOCK_LISTS = [
  { id: "1", name: "Q1 Outreach", description: "Priority accounts for Q1", count: 127 },
  { id: "2", name: "Enterprise Targets", description: "Large enterprise accounts", count: 45 },
  { id: "3", name: "Recently Funded", description: "Companies with recent funding", count: 89 },
  { id: "4", name: "VP+ Contacts", description: "VP and above decision makers", count: 234 },
]

interface LeadList {
  id: string
  name: string
  description: string
  count: number
}

interface AddToListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLeads: Lead[]
  onAddToList?: (listId: string) => void
  onCreateList?: (name: string, description: string) => void
}

export function AddToListModal({
  open,
  onOpenChange,
  selectedLeads,
  onAddToList,
  onCreateList,
}: AddToListModalProps) {
  const [mode, setMode] = React.useState<"select" | "create">("select")
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null)
  const [newListName, setNewListName] = React.useState("")
  const [newListDescription, setNewListDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setMode("select")
      setSelectedListId(null)
      setNewListName("")
      setNewListDescription("")
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (mode === "select" && selectedListId) {
      onAddToList?.(selectedListId)
    } else if (mode === "create" && newListName.trim()) {
      onCreateList?.(newListName.trim(), newListDescription.trim())
    }

    setIsSubmitting(false)
    onOpenChange(false)
  }

  const canSubmit = mode === "select"
    ? selectedListId !== null
    : newListName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">Add to List</DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="px-6 pb-5">
          <div className="flex rounded-lg bg-secondary/30 p-1">
            <button
              onClick={() => setMode("select")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                mode === "select"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Existing
            </button>
            <button
              onClick={() => setMode("create")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                mode === "create"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="border-t border-border">
          {mode === "select" ? (
            <ScrollArea className="max-h-[280px]">
              <div className="px-3 pt-4 pb-3">
                {MOCK_LISTS.map((list) => (
                  <ListOption
                    key={list.id}
                    list={list}
                    selected={selectedListId === list.id}
                    onSelect={() => setSelectedListId(list.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list-name" className="text-sm font-medium text-foreground">
                  List Name
                </Label>
                <Input
                  id="list-name"
                  placeholder="e.g., Q2 Enterprise Targets"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="h-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-description" className="text-sm font-medium text-foreground">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="list-description"
                  placeholder="Brief description of this list..."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="h-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : mode === "select" ? (
              "Add"
            ) : (
              "Create & Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ListOption({
  list,
  selected,
  onSelect,
}: {
  list: LeadList
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
        selected
          ? "bg-primary/10 ring-1 ring-primary/50"
          : "hover:bg-secondary/50"
      )}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
          selected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        )}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>

      {/* List info */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <span className="font-medium text-foreground truncate">{list.name}</span>
        <span className="text-xs text-muted-foreground shrink-0">{list.count} leads</span>
      </div>
    </button>
  )
}
