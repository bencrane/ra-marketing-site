"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import {
  InboxSidebar,
  MessageList,
  MessageDetail,
  type Thread,
  type InboxFilters,
  type MessageStatus,
} from "@/features/inbox";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const MOCK_THREADS: Thread[] = [
  {
    id: "1",
    leadName: "Sarah Chen",
    leadEmail: "sarah.chen@techcorp.com",
    leadCompany: "TechCorp Industries",
    subject: "Re: Quick question about your platform",
    lastMessagePreview:
      "Thanks for reaching out! I'd love to learn more about how your solution could help us...",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messageCount: 3,
    isRead: false,
    status: "interested",
    folder: "inbox",
    campaign: "Q1 Outreach",
    senderAccount: "sales@company.com",
    messages: [
      {
        id: "1-1",
        threadId: "1",
        from: { name: "You", email: "sales@company.com" },
        to: { name: "Sarah Chen", email: "sarah.chen@techcorp.com" },
        subject: "Quick question about your platform",
        preview: "Hi Sarah, I noticed TechCorp has been expanding...",
        body: "Hi Sarah,\n\nI noticed TechCorp has been expanding rapidly in the enterprise space. I wanted to reach out because we've helped similar companies streamline their sales operations.\n\nWould you have 15 minutes this week for a quick call?\n\nBest,\nAlex",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true,
        status: null,
        folder: "sent",
      },
      {
        id: "1-2",
        threadId: "1",
        from: { name: "Sarah Chen", email: "sarah.chen@techcorp.com" },
        to: { name: "You", email: "sales@company.com" },
        subject: "Re: Quick question about your platform",
        preview: "Hi Alex, Thanks for reaching out!",
        body: "Hi Alex,\n\nThanks for reaching out! I'd love to learn more about how your solution could help us. We've been looking for ways to improve our outbound process.\n\nI'm free Thursday afternoon if that works?\n\nBest,\nSarah",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: true,
        status: "interested",
        folder: "inbox",
      },
      {
        id: "1-3",
        threadId: "1",
        from: { name: "You", email: "sales@company.com" },
        to: { name: "Sarah Chen", email: "sarah.chen@techcorp.com" },
        subject: "Re: Quick question about your platform",
        preview: "Thursday works great!",
        body: "Thursday works great! I'll send over a calendar invite for 2pm PT.\n\nLooking forward to chatting!\n\nBest,\nAlex",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: true,
        status: null,
        folder: "sent",
      },
    ],
  },
  {
    id: "2",
    leadName: "Michael Rodriguez",
    leadEmail: "m.rodriguez@acme.io",
    leadCompany: "Acme Solutions",
    subject: "Re: Partnership opportunity",
    lastMessagePreview:
      "I appreciate you thinking of us, but we're not looking for new vendors at this time...",
    lastMessageTimestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 5
    ).toISOString(),
    messageCount: 2,
    isRead: true,
    status: "not_interested",
    folder: "inbox",
    campaign: "Q1 Outreach",
    senderAccount: "sales@company.com",
    messages: [
      {
        id: "2-1",
        threadId: "2",
        from: { name: "You", email: "sales@company.com" },
        to: { name: "Michael Rodriguez", email: "m.rodriguez@acme.io" },
        subject: "Partnership opportunity",
        preview: "Hi Michael, I wanted to explore...",
        body: "Hi Michael,\n\nI wanted to explore a potential partnership between our companies. I think there could be some great synergies.\n\nWould you be open to a brief conversation?\n\nBest,\nAlex",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        isRead: true,
        status: null,
        folder: "sent",
      },
      {
        id: "2-2",
        threadId: "2",
        from: { name: "Michael Rodriguez", email: "m.rodriguez@acme.io" },
        to: { name: "You", email: "sales@company.com" },
        subject: "Re: Partnership opportunity",
        preview: "I appreciate you thinking of us...",
        body: "Hi Alex,\n\nI appreciate you thinking of us, but we're not looking for new vendors at this time. We recently signed a 2-year contract with another provider.\n\nFeel free to check back next year.\n\nBest,\nMichael",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isRead: true,
        status: "not_interested",
        folder: "inbox",
      },
    ],
  },
  {
    id: "3",
    leadName: "Emily Watson",
    leadEmail: "emily.w@globaltech.com",
    leadCompany: "GlobalTech",
    subject: "Out of Office: Re: Collaboration idea",
    lastMessagePreview:
      "I'm currently out of the office until January 15th with limited access to email...",
    lastMessageTimestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 8
    ).toISOString(),
    messageCount: 2,
    isRead: false,
    status: "out_of_office",
    folder: "inbox",
    campaign: "Enterprise Push",
    senderAccount: "partnerships@company.com",
    messages: [
      {
        id: "3-1",
        threadId: "3",
        from: { name: "You", email: "partnerships@company.com" },
        to: { name: "Emily Watson", email: "emily.w@globaltech.com" },
        subject: "Collaboration idea",
        preview: "Hi Emily, I had an idea...",
        body: "Hi Emily,\n\nI had an idea I wanted to run by you regarding a potential collaboration between our teams.\n\nDo you have time for a quick sync this week?\n\nBest,\nAlex",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        isRead: true,
        status: null,
        folder: "sent",
      },
      {
        id: "3-2",
        threadId: "3",
        from: { name: "Emily Watson", email: "emily.w@globaltech.com" },
        to: { name: "You", email: "partnerships@company.com" },
        subject: "Out of Office: Re: Collaboration idea",
        preview: "I'm currently out of the office...",
        body: "Hi,\n\nI'm currently out of the office until January 15th with limited access to email. I'll respond to your message when I return.\n\nFor urgent matters, please contact my colleague James at james@globaltech.com.\n\nBest,\nEmily",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        isRead: false,
        status: "out_of_office",
        folder: "inbox",
      },
    ],
  },
];

const MOCK_CAMPAIGNS = ["Q1 Outreach", "Enterprise Push", "Product Launch"];
const MOCK_SENDER_ACCOUNTS = [
  "sales@company.com",
  "partnerships@company.com",
  "marketing@company.com",
];

export default function InboxPage() {
  const [filters, setFilters] = useState<InboxFilters>({
    folder: "inbox",
    status: "all",
    readState: "all",
    campaign: "all",
    senderAccount: "all",
    search: "",
  });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);

  // Filter threads based on current filters
  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      if (filters.folder !== "all" && thread.folder !== filters.folder) {
        return false;
      }
      if (filters.status !== "all" && thread.status !== filters.status) {
        return false;
      }
      if (filters.readState === "unread" && thread.isRead) {
        return false;
      }
      if (filters.readState === "read" && !thread.isRead) {
        return false;
      }
      if (
        filters.campaign !== "all" &&
        thread.campaign !== filters.campaign
      ) {
        return false;
      }
      if (
        filters.senderAccount !== "all" &&
        thread.senderAccount !== filters.senderAccount
      ) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          thread.leadName.toLowerCase().includes(searchLower) ||
          thread.leadEmail.toLowerCase().includes(searchLower) ||
          thread.subject.toLowerCase().includes(searchLower) ||
          thread.leadCompany?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [threads, filters]);

  const selectedThread = useMemo(() => {
    return threads.find((t) => t.id === selectedThreadId) || null;
  }, [threads, selectedThreadId]);

  const handleStatusChange = (threadId: string, status: MessageStatus) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, status: t.status === status ? null : status }
          : t
      )
    );
  };

  const handleReply = (threadId: string, message: string) => {
    console.log(`Sending reply to thread ${threadId}:`, message);
  };

  // Count unread messages
  const unreadCount = threads.filter((t) => !t.isRead && t.folder === "inbox").length;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <InboxSidebar
        filters={filters}
        onFiltersChange={setFilters}
        campaigns={MOCK_CAMPAIGNS}
        senderAccounts={MOCK_SENDER_ACCOUNTS}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden ml-[280px]">
        {/* Header row - aligned with sidebar header */}
        <div className="h-14 flex items-center px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {filteredThreads.length} Conversations
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground h-8">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Content - 2 panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Message List */}
          <div className="w-[380px] border-r border-border flex flex-col bg-card/30">
            <MessageList
              threads={filteredThreads}
              selectedThreadId={selectedThreadId}
              onSelectThread={setSelectedThreadId}
            />
          </div>

          {/* Message Detail */}
          <MessageDetail
            thread={selectedThread}
            onStatusChange={handleStatusChange}
            onReply={handleReply}
          />
        </div>
      </main>
    </div>
  );
}
