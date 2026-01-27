"use client"

import * as React from "react"
import { MoreHorizontal, Plus, Pencil, Trash2, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data - will be replaced with API call
const MOCK_LISTS = [
  { id: "1", name: "Q1 Outreach", description: "Priority accounts for Q1", count: 127 },
  { id: "2", name: "Enterprise Targets", description: "Large enterprise accounts", count: 45 },
  { id: "3", name: "Recently Funded", description: "Companies with recent funding", count: 89 },
  { id: "4", name: "VP+ Contacts", description: "VP and above decision makers", count: 234 },
]

export interface LeadList {
  id: string
  name: string
  description: string
  count: number
}

interface ViewListsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectList?: (listId: string, listName: string) => void
  onRenameList?: (listId: string, newName: string) => void
  onDeleteList?: (listId: string) => void
  onCreateList?: (name: string, description: string) => void
}

export function ViewListsModal({
  open,
  onOpenChange,
  onSelectList,
  onRenameList,
  onDeleteList,
  onCreateList,
}: ViewListsModalProps) {
  const [lists, setLists] = React.useState<LeadList[]>(MOCK_LISTS)
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [newListName, setNewListName] = React.useState("")
  const [newListDescription, setNewListDescription] = React.useState("")
  const [editingListId, setEditingListId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState("")

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setShowCreateForm(false)
      setNewListName("")
      setNewListDescription("")
      setEditingListId(null)
      setEditingName("")
    }
  }, [open])

  const handleCreateList = () => {
    if (newListName.trim()) {
      // For now, add to local state - will be replaced with API call
      const newList: LeadList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        description: newListDescription.trim(),
        count: 0,
      }
      setLists([...lists, newList])
      onCreateList?.(newListName.trim(), newListDescription.trim())
      setShowCreateForm(false)
      setNewListName("")
      setNewListDescription("")
    }
  }

  const handleRename = (listId: string) => {
    if (editingName.trim()) {
      setLists(lists.map(list =>
        list.id === listId ? { ...list, name: editingName.trim() } : list
      ))
      onRenameList?.(listId, editingName.trim())
      setEditingListId(null)
      setEditingName("")
    }
  }

  const handleDelete = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId))
    onDeleteList?.(listId)
  }

  const handleSelectList = (list: LeadList) => {
    onSelectList?.(list.id, list.name)
    onOpenChange(false)
  }

  const startEditing = (list: LeadList) => {
    setEditingListId(list.id)
    setEditingName(list.name)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">Your Lists</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="border-t border-border">
          <ScrollArea className="max-h-[360px]">
            <div className="px-3 pt-4 pb-3 space-y-1">
              {lists.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No lists yet</p>
                  <p className="text-xs mt-1">Create your first list to organize leads</p>
                </div>
              ) : (
                lists.map((list) => (
                  <div key={list.id} className="group">
                    {editingListId === list.id ? (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/30">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 flex-1 bg-background border-border text-foreground"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(list.id)
                            if (e.key === "Escape") {
                              setEditingListId(null)
                              setEditingName("")
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRename(list.id)}
                          className="h-8 px-3"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingListId(null)
                            setEditingName("")
                          }}
                          className="h-8 px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectList(list)}
                          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-foreground">{list.name}</span>
                            {list.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {list.description}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground shrink-0">
                            {list.count.toLocaleString()} leads
                          </span>
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => startEditing(list)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(list.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Create New List Section */}
        <div className="px-6 py-4 border-t border-border bg-secondary/20">
          {showCreateForm ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="new-list-name" className="text-sm font-medium text-foreground">
                  List Name
                </Label>
                <Input
                  id="new-list-name"
                  placeholder="e.g., Q2 Enterprise Targets"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newListName.trim()) handleCreateList()
                    if (e.key === "Escape") {
                      setShowCreateForm(false)
                      setNewListName("")
                      setNewListDescription("")
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-list-desc" className="text-sm font-medium text-foreground">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="new-list-desc"
                  placeholder="Brief description..."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewListName("")
                    setNewListDescription("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                >
                  Create List
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-dashed"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4" />
              New List
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
