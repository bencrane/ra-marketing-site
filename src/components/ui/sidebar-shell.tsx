"use client"

import * as React from "react"
import Link from "next/link"
import { PanelLeftClose, PanelLeft, Lock, LockOpen, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarShellProps {
  /** Content for the header title area - defaults to "Revenue Activation" link */
  title?: React.ReactNode
  /** Header action buttons (collapse, lock, etc.) */
  headerActions?: React.ReactNode
  /** Optional secondary row below header (e.g., list selector) */
  secondaryRow?: React.ReactNode
  /** Main scrollable content */
  children: React.ReactNode
  /** Optional footer content (e.g., sign out button) */
  footer?: React.ReactNode
  /** Whether sidebar is collapsed */
  isCollapsed?: boolean
  /** Whether sidebar is locked open */
  isLocked?: boolean
  /** Toggle collapse state */
  onToggle?: () => void
  /** Toggle lock state */
  onLockChange?: (locked: boolean) => void
  /** Mouse enter handler for hover-to-expand */
  onMouseEnter?: () => void
  /** Mouse leave handler for hover-to-collapse */
  onMouseLeave?: () => void
  /** Additional className for the container */
  className?: string
}

/**
 * SidebarShell - Shared structure for all sidebar implementations
 *
 * Provides consistent layout with:
 * - Fixed positioning (280px width)
 * - Header with title and action buttons
 * - Optional secondary row (selectors, etc.)
 * - Scrollable content area
 * - Optional footer
 *
 * @example
 * <SidebarShell
 *   headerActions={<HeaderButtons />}
 *   secondaryRow={<ListSelector />}
 *   footer={<SignOutButton />}
 * >
 *   <FilterSections />
 * </SidebarShell>
 */
export function SidebarShell({
  title,
  headerActions,
  secondaryRow,
  children,
  footer,
  isCollapsed = false,
  isLocked = true,
  onToggle,
  onLockChange,
  onMouseEnter,
  onMouseLeave,
  className,
}: SidebarShellProps) {
  const showCollapsedButton = isCollapsed && !isLocked && onToggle

  return (
    <>
      {/* Collapsed state - just show expand button */}
      {showCollapsedButton && (
        <div className="fixed left-0 top-0 h-screen w-12 flex flex-col items-center pt-4 z-30">
          <button
            onClick={onToggle}
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
          isCollapsed && !isLocked && "-translate-x-full",
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border shrink-0">
          {title ?? (
            <Link
              href="/admin"
              className="text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              Revenue Activation
            </Link>
          )}
          {headerActions ?? (
            <DefaultHeaderActions
              isCollapsed={isCollapsed}
              isLocked={isLocked}
              onToggle={onToggle}
              onLockChange={onLockChange}
            />
          )}
        </div>

        {/* Secondary Row */}
        {secondaryRow && (
          <div className="h-11 px-4 flex items-center border-b border-border shrink-0">
            {secondaryRow}
          </div>
        )}

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          {children}
        </ScrollArea>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-4 border-t border-border mt-auto shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </>
  )
}

function DefaultHeaderActions({
  isCollapsed,
  isLocked,
  onToggle,
  onLockChange,
}: {
  isCollapsed?: boolean
  isLocked?: boolean
  onToggle?: () => void
  onLockChange?: (locked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {onToggle && (
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      )}
      {onLockChange && (
        <button
          onClick={() => onLockChange(!isLocked)}
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
      )}
    </div>
  )
}

interface SidebarSelectorProps {
  value: string
  onClick?: () => void
  className?: string
}

/**
 * SidebarSelector - Dropdown-style selector for the secondary row
 */
export function SidebarSelector({ value, onClick, className }: SidebarSelectorProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between px-3 py-1.5 text-sm font-medium rounded-md bg-secondary/50 hover:bg-secondary text-foreground transition-colors",
        className
      )}
    >
      <span>{value}</span>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}
