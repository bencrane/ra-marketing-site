import { useState, useCallback } from "react";
import { AiFilters, ChatMessage, AiSearchResult, LeadPreview } from "../types";

interface UseAiSearchReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentFilters: AiFilters | null;
  currentDescription: string | null;
  currentCount: number | null;
  currentPreview: LeadPreview[] | null;
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
}

export function useAiSearch(): UseAiSearchReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<AiFilters | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [currentPreview, setCurrentPreview] = useState<LeadPreview[] | null>(null);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build history for context (exclude current user message)
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history }),
      });

      if (!response.ok) {
        throw new Error("Failed to process search");
      }

      const result: AiSearchResult = await response.json();

      // Add assistant message with results
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.assistantMessage,
        filters: result.filters,
        description: result.description,
        count: result.count,
        preview: result.preview,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update current state
      setCurrentFilters(result.filters);
      setCurrentDescription(result.description);
      setCurrentCount(result.count);
      setCurrentPreview(result.preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentFilters(null);
    setCurrentDescription(null);
    setCurrentCount(null);
    setCurrentPreview(null);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentFilters,
    currentDescription,
    currentCount,
    currentPreview,
    sendMessage,
    clearChat,
  };
}
