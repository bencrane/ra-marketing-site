"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ThumbsDown,
  Clock,
  Reply,
  MoreHorizontal,
  Send,
  Building2,
  Mail,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Thread, Message, MessageStatus } from "../types";

interface MessageDetailProps {
  thread: Thread | null;
  onStatusChange?: (threadId: string, status: MessageStatus) => void;
  onReply?: (threadId: string, message: string) => void;
  aiDraft?: string | null;
  isGeneratingDraft?: boolean;
  onRegenerateDraft?: (threadId: string) => void;
}

const STATUS_OPTIONS: {
  id: MessageStatus;
  label: string;
  icon: typeof Star;
  activeColor: string;
}[] = [
  { id: "interested", label: "Interested", icon: Star, activeColor: "text-yellow-500" },
  { id: "not_interested", label: "Not Interested", icon: ThumbsDown, activeColor: "text-red-400" },
  { id: "out_of_office", label: "Out of Office", icon: Clock, activeColor: "text-blue-400" },
];

export function MessageDetail({
  thread,
  onStatusChange,
  onReply,
  aiDraft,
  isGeneratingDraft = false,
  onRegenerateDraft,
}: MessageDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [lastThreadId, setLastThreadId] = useState<string | null>(null);

  // When thread changes or aiDraft arrives, update state
  useEffect(() => {
    if (thread && thread.id !== lastThreadId) {
      setLastThreadId(thread.id);
      if (aiDraft) {
        setReplyText(aiDraft);
        setIsAiDraft(true);
        setIsReplying(true);
      } else {
        setReplyText("");
        setIsAiDraft(false);
        setIsReplying(false);
      }
    } else if (thread && aiDraft && !replyText && !isAiDraft) {
      // Draft arrived after thread was already selected
      setReplyText(aiDraft);
      setIsAiDraft(true);
      setIsReplying(true);
    }
  }, [thread, aiDraft, lastThreadId, replyText, isAiDraft]);

  // Handle text change - removes AI draft status on edit
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setReplyText(newText);
    if (isAiDraft) {
      setIsAiDraft(false);
    }
  };

  // Clear the draft
  const clearDraft = () => {
    setReplyText("");
    setIsAiDraft(false);
  };

  // Request regeneration
  const handleRegenerate = () => {
    if (thread && onRegenerateDraft) {
      onRegenerateDraft(thread.id);
    }
  };

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
          <Mail className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-foreground/60">Select a conversation</p>
        <p className="text-xs text-muted-foreground/50 mt-1">
          Choose a message from the list to view details
        </p>
      </div>
    );
  }

  const handleSendReply = () => {
    if (replyText.trim() && onReply) {
      onReply(thread.id, replyText.trim());
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Sticky Header */}
      <div className="px-8 pt-6 pb-5 border-b border-border/50 shrink-0 bg-background">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground truncate mb-1.5">
              {thread.subject}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">{thread.leadName}</span>
              {thread.leadCompany && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {thread.leadCompany}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-secondary/30 rounded-lg p-1">
            {STATUS_OPTIONS.map((status) => {
              const isActive = thread.status === status.id;
              return (
                <button
                  key={status.id}
                  onClick={() => onStatusChange?.(thread.id, status.id)}
                  className={cn(
                    "p-2 rounded-md transition-all duration-150",
                    isActive
                      ? "bg-background shadow-sm"
                      : "hover:bg-secondary/50"
                  )}
                  title={status.label}
                >
                  <status.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? status.activeColor : "text-muted-foreground/50"
                    )}
                  />
                </button>
              );
            })}
            <div className="w-px h-5 bg-border/50 mx-1" />
            <button className="p-2 rounded-md text-muted-foreground/50 hover:bg-secondary/50 hover:text-muted-foreground transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages - anchored to bottom */}
      <div className="flex-1 overflow-y-auto px-8 flex flex-col">
        <div className="flex-1" /> {/* Spacer pushes messages to bottom */}
        <div className="max-w-3xl w-full space-y-8 py-8">
          {thread.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isFirst={index === 0}
              isLast={index === thread.messages.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Reply area */}
      <div className="px-8 py-5 border-t border-border/50 bg-secondary/10 shrink-0">
        <div className="max-w-3xl">
          {isReplying || isGeneratingDraft ? (
            <div className="space-y-3">
              <div className="relative">
                {/* AI Draft badge */}
                {(isAiDraft || isGeneratingDraft) && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {isGeneratingDraft ? (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          <Sparkles className="h-3 w-3" />
                          AI Draft
                        </span>
                        <button
                          onClick={clearDraft}
                          className="p-1 rounded-md bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          title="Clear draft"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                )}
                <textarea
                  value={replyText}
                  onChange={handleTextChange}
                  placeholder={`Reply to ${thread.leadName}...`}
                  className={cn(
                    "w-full min-h-[140px] px-4 py-4 pr-32 rounded-lg border border-border/50 bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm leading-relaxed resize-y transition-all",
                    isAiDraft ? "text-foreground/60" : "text-foreground"
                  )}
                  autoFocus
                  disabled={isGeneratingDraft}
                />
              </div>
              {/* Regenerate link when empty */}
              {!replyText.trim() && !isGeneratingDraft && onRegenerateDraft && (
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Generate draft
                </button>
              )}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                    setIsAiDraft(false);
                  }}
                  className="text-muted-foreground"
                  disabled={isGeneratingDraft}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isGeneratingDraft}
                  className="gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Reply
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsReplying(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-border/50 bg-background/50 text-muted-foreground/60 hover:bg-background hover:text-muted-foreground hover:border-border transition-all"
            >
              <Reply className="h-4 w-4" />
              <span className="text-sm">Reply to {thread.leadName}...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isFirst,
  isLast,
}: {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isFromYou = message.folder === "sent";

  return (
    <div className="border-b border-border/30 last:border-b-0">
      {/* Email header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold",
            isFromYou
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-foreground/70"
          )}
        >
          {message.from.name.charAt(0).toUpperCase()}
        </div>

        {/* Header info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {message.from.name}
              </span>
              {isFromYou && (
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  You
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground/60 tabular-nums shrink-0">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            to {message.to.name} &lt;{message.to.email}&gt;
          </p>
        </div>
      </div>

      {/* Email body */}
      <div className="pl-14 pb-6">
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message.body}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(timestamp: string): string {
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
    return "Yesterday " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}
