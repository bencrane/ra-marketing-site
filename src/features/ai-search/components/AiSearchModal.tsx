"use client";

import * as React from "react";
import { Search, Sparkles, X, Loader2, User, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAiSearch } from "../hooks/use-ai-search";
import { AiFilters, LeadPreview } from "../types";

interface AiSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: AiFilters, description: string) => void;
}

export function AiSearchModal({
  open,
  onOpenChange,
  onApplyFilters,
}: AiSearchModalProps) {
  const {
    messages,
    isLoading,
    error,
    currentFilters,
    currentDescription,
    currentCount,
    currentPreview,
    sendMessage,
    clearChat,
  } = useAiSearch();

  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear chat when modal closes
  React.useEffect(() => {
    if (!open) {
      clearChat();
      setInputValue("");
    }
  }, [open, clearChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleApplyFilters = () => {
    if (currentFilters && currentDescription) {
      onApplyFilters(currentFilters, currentDescription);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] bg-card border-border gap-0 p-0 overflow-hidden max-h-[80vh] flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-semibold text-foreground">
                Search Leads
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Describe the leads you&apos;re looking for in natural language
          </p>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 min-h-0">
          <div ref={scrollAreaRef} className="px-6 py-4 space-y-4 min-h-[200px]">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Try &quot;VPs of Sales at logistics companies in Texas&quot;
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* Message */}
                <div
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <AssistantMessageContent
                        count={message.count}
                        description={message.description}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>

                {/* Preview (only for assistant messages with results) */}
                {message.role === "assistant" &&
                  message.preview &&
                  message.preview.length > 0 && (
                    <LeadPreviewList leads={message.preview} />
                  )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="bg-secondary/50 rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2.5 text-sm">
                {error}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 border-t border-border flex-shrink-0"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe the leads you're looking for..."
                className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || isLoading}
              className="h-10 px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {/* Footer with Apply Button */}
        {currentFilters && currentCount !== null && (
          <div className="px-6 py-4 border-t border-border bg-secondary/20 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilters} className="min-w-[140px]">
                Show {currentCount.toLocaleString()} Results
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssistantMessageContent({
  count,
  description,
}: {
  count?: number;
  description?: string;
}) {
  if (count === undefined || count === null) {
    return <span>Processing your search...</span>;
  }

  return (
    <div className="space-y-1">
      <div className="font-medium">
        Found {count.toLocaleString()} leads
        {description && (
          <span className="font-normal text-muted-foreground"> matching:</span>
        )}
      </div>
      {description && (
        <div className="text-muted-foreground">{description}</div>
      )}
    </div>
  );
}

function LeadPreviewList({ leads }: { leads: LeadPreview[] }) {
  return (
    <div className="ml-0 bg-secondary/30 rounded-lg overflow-hidden border border-border/50">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
        Preview
      </div>
      <div className="divide-y divide-border/30">
        {leads.map((lead) => (
          <div
            key={lead.person_id}
            className="px-3 py-2.5 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">
                {lead.full_name}
              </div>
              <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                <span>{lead.matched_cleaned_job_title}</span>
                {lead.company_name && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {lead.company_name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
