"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Thread } from "../types";

interface MessageListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  isLoading?: boolean;
}

export function MessageList({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading = false,
}: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
        <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground/80 mb-1">No messages yet</p>
        <p className="text-xs text-muted-foreground/60 max-w-[200px]">
          Replies will appear here when leads respond to your campaigns
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Panel header with breathing room */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">
          {threads.length} {threads.length === 1 ? "Conversation" : "Conversations"}
        </h2>
      </div>

      {/* Scrollable thread list - flows from top */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-2 pb-4">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={cn(
                "w-full text-left px-4 py-4 rounded-lg transition-all duration-150 relative",
                "hover:bg-secondary/40",
                selectedThreadId === thread.id
                  ? "bg-secondary/60 ring-1 ring-border/50"
                  : "bg-transparent"
              )}
            >
              {/* Unread indicator line */}
              {!thread.isRead && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-primary rounded-r-full" />
              )}

              {/* Header row: Name + Timestamp */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {!thread.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  <span
                    className={cn(
                      "font-semibold truncate",
                      !thread.isRead ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {thread.leadName}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground/60 shrink-0 tabular-nums">
                  {formatTimestamp(thread.lastMessageTimestamp)}
                </span>
              </div>

              {/* Company */}
              {thread.leadCompany && (
                <p className="text-xs text-muted-foreground/60 mb-2 truncate">
                  {thread.leadCompany}
                </p>
              )}

              {/* Subject */}
              <p
                className={cn(
                  "text-sm truncate mb-2",
                  !thread.isRead ? "text-foreground font-medium" : "text-foreground/70"
                )}
              >
                {thread.subject}
              </p>

              {/* Preview */}
              <p className="text-xs text-muted-foreground/50 truncate leading-relaxed">
                {thread.lastMessagePreview}
              </p>

              {/* Message count badge */}
              {thread.messageCount > 1 && (
                <div className="mt-3">
                  <span className="inline-flex items-center text-[10px] font-medium text-muted-foreground/60 bg-secondary/50 px-2 py-1 rounded-md">
                    {thread.messageCount} messages
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}
