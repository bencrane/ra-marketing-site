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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InboxFilters, Folder, MessageStatus, ReadState } from "../types";

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
    <div className="w-[260px] h-full border-r border-border/50 bg-sidebar flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
      </div>

      {/* Search */}
      <div className="px-4 pb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm transition-all"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Folders Section */}
        <div className="px-4 pb-6">
          <h3 className="px-2 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Folders
          </h3>
          <div className="space-y-1">
            {FOLDERS.map((folder) => (
              <button
                key={folder.id}
                onClick={() => updateFilter("folder", folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  filters.folder === folder.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <folder.icon className={cn(
                  "h-4 w-4 shrink-0",
                  filters.folder === folder.id ? "opacity-100" : "opacity-60"
                )} />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count !== undefined && (
                  <span className={cn(
                    "text-xs tabular-nums",
                    filters.folder === folder.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/60"
                  )}>
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-6 border-t border-border/30" />

        {/* Status Section */}
        <div className="px-4 pb-6">
          <h3 className="px-2 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Filter by Status
          </h3>
          <div className="space-y-1">
            {STATUSES.map((status) => (
              <button
                key={status.id ?? "null"}
                onClick={() => updateFilter("status", filters.status === status.id ? "all" : status.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  filters.status === status.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <status.icon className={cn(
                  "h-4 w-4 shrink-0",
                  filters.status === status.id ? "opacity-100" : "opacity-50"
                )} />
                <span className="flex-1 text-left">{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-6 border-t border-border/30" />

        {/* Read State Toggle */}
        <div className="px-4 pb-6">
          <h3 className="px-2 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Read State
          </h3>
          <div className="flex rounded-lg bg-secondary/40 p-1">
            {(["all", "unread", "read"] as const).map((state) => (
              <button
                key={state}
                onClick={() => updateFilter("readState", state)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-150 capitalize",
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

        {/* Divider */}
        <div className="mx-4 mb-6 border-t border-border/30" />

        {/* Campaign Select */}
        <div className="px-4 pb-6">
          <h3 className="px-2 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Campaign
          </h3>
          <Select
            value={filters.campaign}
            onValueChange={(value) => updateFilter("campaign", value)}
          >
            <SelectTrigger className="w-full h-10 bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <SelectValue placeholder="All campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-6 border-t border-border/30" />

        {/* Sender Account Select */}
        <div className="px-4 pb-8">
          <h3 className="px-2 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Sender Account
          </h3>
          <Select
            value={filters.senderAccount}
            onValueChange={(value) => updateFilter("senderAccount", value)}
          >
            <SelectTrigger className="w-full h-10 bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {senderAccounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
