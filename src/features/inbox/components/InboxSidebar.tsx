"use client";

import {
  Search,
  Inbox,
  Send,
  AlertTriangle,
  Mail,
  Star,
  ThumbsDown,
  Clock,
  PanelLeftClose,
  Lock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InboxFilters, Folder, MessageStatus } from "../types";

interface InboxSidebarProps {
  filters: InboxFilters;
  onFiltersChange: (filters: InboxFilters) => void;
  campaigns?: string[];
  senderAccounts?: string[];
}

const FOLDERS: { id: Folder; label: string; icon: typeof Inbox; count?: number }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "sent", label: "Sent", icon: Send, count: 847 },
  { id: "bounced", label: "Bounced", icon: AlertTriangle, count: 3 },
  { id: "all", label: "All Mail", icon: Mail },
];

const STATUSES: { id: MessageStatus | "all"; label: string; icon: typeof Star }[] = [
  { id: "interested", label: "Interested", icon: Star },
  { id: "not_interested", label: "Not Interested", icon: ThumbsDown },
  { id: "out_of_office", label: "Out of Office", icon: Clock },
];

export function InboxSidebar({
  filters,
  onFiltersChange,
  campaigns = [],
  senderAccounts = [],
}: InboxSidebarProps) {
  const updateFilter = <K extends keyof InboxFilters>(
    key: K,
    value: InboxFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[280px] border-r border-border bg-sidebar flex flex-col z-30">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border shrink-0">
        <span className="text-base font-semibold tracking-tight text-foreground">Revenue Activation</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <PanelLeftClose className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-md text-foreground hover:bg-secondary transition-colors">
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Inbox Selector */}
      <div className="h-11 px-4 flex items-center border-b border-border shrink-0">
        <button className="flex w-full items-center justify-between px-3 py-1.5 text-sm font-medium rounded-md bg-secondary/50 hover:bg-secondary text-foreground transition-colors">
          <span>Inbox</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm"
            />
          </div>
        </div>

        {/* Folders */}
        <div className="px-4 pb-4">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Folders
          </h3>
          <div className="space-y-1">
            {FOLDERS.map((folder) => (
              <button
                key={folder.id}
                onClick={() => updateFilter("folder", folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  filters.folder === folder.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary/60"
                )}
              >
                <folder.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count !== undefined && (
                  <span className={cn(
                    "text-xs tabular-nums",
                    filters.folder === folder.id ? "text-primary-foreground/70" : "text-muted-foreground/60"
                  )}>
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 border-t border-border/30" />

        {/* Status */}
        <div className="px-4 pb-4">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Filter by Status
          </h3>
          <div className="space-y-1">
            {STATUSES.map((status) => (
              <button
                key={status.id}
                onClick={() => updateFilter("status", filters.status === status.id ? "all" : status.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  filters.status === status.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/40"
                )}
              >
                <status.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 border-t border-border/30" />

        {/* Read State */}
        <div className="px-4 pb-4">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Read State
          </h3>
          <div className="flex rounded-lg bg-secondary/40 p-1">
            {(["all", "unread", "read"] as const).map((state) => (
              <button
                key={state}
                onClick={() => updateFilter("readState", state)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize",
                  filters.readState === state
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {state === "all" ? "All" : state}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 border-t border-border/30" />

        {/* Campaign */}
        <div className="px-4 pb-4">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Campaign
          </h3>
          <Select value={filters.campaign} onValueChange={(value) => updateFilter("campaign", value)}>
            <SelectTrigger className="w-full h-9 bg-background/50 border-border">
              <SelectValue placeholder="All campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mx-4 mb-4 border-t border-border/30" />

        {/* Sender Account */}
        <div className="px-4 pb-6">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Sender Account
          </h3>
          <Select value={filters.senderAccount} onValueChange={(value) => updateFilter("senderAccount", value)}>
            <SelectTrigger className="w-full h-9 bg-background/50 border-border">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {senderAccounts.map((account) => (
                <SelectItem key={account} value={account}>{account}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
