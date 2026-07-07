"use client";

import React from "react";
import { ChatSession } from "@/types/chat";
import SessionItem from "./SessionItem";

/** Build a content snippet around the first query match in message content. */
function buildSnippet(session: ChatSession, query: string): string | null {
  if (!query) return null;
  const q = query.toLowerCase();
  if (session.title.toLowerCase().includes(q)) return null;

  const matched = session.messages.find((m) =>
    m.content.toLowerCase().includes(q)
  );
  if (!matched) return null;

  const idx = matched.content.toLowerCase().indexOf(q);
  const start = Math.max(0, idx - 20);
  const raw = matched.content.slice(start, idx + q.length + 30);
  return (
    (start > 0 ? "…" : "") +
    raw +
    (start + raw.length < matched.content.length ? "…" : "")
  );
}

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  searchQuery: string;
  totalCount: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function SessionList({
  sessions,
  activeSessionId,
  searchQuery,
  totalCount,
  onSelect,
  onDelete,
  onClose,
}: SessionListProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-2 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
      {/* Counter label */}
      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
        {searchQuery ? `Results (${sessions.length})` : `History (${totalCount})`}
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className="px-2 py-6 text-center text-xs text-zinc-600">
          {searchQuery
            ? `No chats matching "${searchQuery}"`
            : "No chat history yet."}
        </div>
      ) : (
        sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            matchSnippet={buildSnippet(session, searchQuery.trim().toLowerCase())}
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
