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
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SidebarShell, SidebarSelector } from "@/components/ui/sidebar-shell";
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
    <SidebarShell
      secondaryRow={<SidebarSelector value="Inbox" />}
    >
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* Search */}
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

        {/* Folders */}
        <div>
          <h3 className="sidebar-section-header px-2 mb-2">Folders</h3>
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

        <div className="border-t border-border/30" />

        {/* Status */}
        <div>
          <h3 className="sidebar-section-header px-2 mb-2">Filter by Status</h3>
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

        <div className="border-t border-border/30" />

        {/* Read State */}
        <div>
          <h3 className="sidebar-section-header px-2 mb-2">Read State</h3>
          <SegmentedControl
            options={[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ]}
            value={filters.readState}
            onChange={(state) => updateFilter("readState", state)}
            size="sm"
          />
        </div>

        <div className="border-t border-border/30" />

        {/* Campaign */}
        <div>
          <h3 className="sidebar-section-header px-2 mb-2">Campaign</h3>
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

        <div className="border-t border-border/30" />

        {/* Sender Account */}
        <div>
          <h3 className="sidebar-section-header px-2 mb-2">Sender Account</h3>
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
    </SidebarShell>
  );
}
