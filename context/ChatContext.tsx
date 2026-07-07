"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  setActiveSessionId: (id: string) => void;
  clearActiveSession: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions and active ID from LocalStorage when user changes
  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setActiveSessionId(null);
      return;
    }

    try {
      const storedSessions = localStorage.getItem(`chat_app_v1_${userId}`);
      const storedActiveId = localStorage.getItem(`chat_active_id_v1_${userId}`);

      let loadedSessions: ChatSession[] = [];
      let loadedActiveId: string | null = null;

      if (storedSessions) {
        loadedSessions = JSON.parse(storedSessions) as ChatSession[];
      }

      if (storedActiveId) {
        loadedActiveId = storedActiveId;
      }

      if (loadedSessions.length > 0) {
        setSessions(loadedSessions);
        // Ensure active ID exists in loaded sessions, otherwise default to first
        if (loadedActiveId && loadedSessions.some(s => s.id === loadedActiveId)) {
          setActiveSessionId(loadedActiveId);
        } else {
          setActiveSessionId(loadedSessions[0].id);
        }
      } else {
        // Create an initial session if none exist
        const initialId = crypto.randomUUID();
        const initialSession: ChatSession = {
          id: initialId,
          title: "New Conversation",
          messages: [],
          createdAt: Date.now(),
        };
        setSessions([initialSession]);
        setActiveSessionId(initialId);
      }
    } catch (err) {
      console.error("Failed to load state from localStorage:", err);
    }
  }, [userId]);

  // Save sessions and active session ID to LocalStorage with 300ms debounce
  useEffect(() => {
    if (!userId || sessions.length === 0) return;

    const handler = setTimeout(() => {
      try {
        localStorage.setItem(`chat_app_v1_${userId}`, JSON.stringify(sessions));
        if (activeSessionId) {
          localStorage.setItem(`chat_active_id_v1_${userId}`, activeSessionId);
        }
      } catch (err) {
        console.error("Failed to write state to localStorage (possibly quota exceeded/private browsing):", err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [sessions, activeSessionId, userId]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const createNewSession = () => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setError(null);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // If deleted the active one, pick the next available
      if (activeSessionId === id) {
        if (filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
        } else {
          // If no sessions left, create a fresh one
          const freshId = crypto.randomUUID();
          const freshSession: ChatSession = {
            id: freshId,
            title: "New Conversation",
            messages: [],
            createdAt: Date.now(),
          };
          setActiveSessionId(freshId);
          return [freshSession];
        }
      }
      return filtered;
    });
  };

  const clearActiveSession = () => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [] } : s))
    );
    setError(null);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);

    let currentSessionId = activeSessionId;
    let currentSessions = [...sessions];

    // If no active session or no sessions exist, create one first
    if (!currentSessionId || currentSessions.length === 0) {
      const newId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
        createdAt: Date.now(),
      };
      currentSessionId = newId;
      currentSessions = [newSession, ...currentSessions];
      setSessions(currentSessions);
      setActiveSessionId(newId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    // Update active session messages locally with user message
    let updatedMessages: Message[] = [];
    const updatedSessions = currentSessions.map((s) => {
      if (s.id === currentSessionId) {
        updatedMessages = [...s.messages, userMessage];
        // Auto update session title if it was the default one
        const title = s.title === "New Conversation"
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : s.title;
        return {
          ...s,
          title,
          messages: updatedMessages,
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate AI response.");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.text,
        createdAt: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, assistantMessage] }
            : s
        )
      );
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        isLoading,
        error,
        sendMessage,
        createNewSession,
        deleteSession,
        setActiveSessionId,
        clearActiveSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
