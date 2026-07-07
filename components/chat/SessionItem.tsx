"use client";

import React from "react";
import { ChatSession } from "@/types/chat";

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  matchSnippet: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SessionItem({
  session,
  isActive,
  matchSnippet,
  onSelect,
  onDelete,
}: SessionItemProps) {
  return (
    <div
      onClick={() => onSelect(session.id)}
      className={`group flex items-start justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-200"
          : "border border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >
      <div className="flex items-start gap-2.5 overflow-hidden">
        {/* Chat icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.68 0-5.305.136-7.892.404C2.528 3.636 1.405 5.03 1.405 6.632v5.783Z"
          />
        </svg>

        <div className="overflow-hidden">
          <span className="block truncate pr-1 text-xs font-medium">
            {session.title || "New Conversation"}
          </span>
          {matchSnippet && (
            <span className="block truncate text-[10px] text-zinc-500 mt-0.5">
              {matchSnippet}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(session.id);
        }}
        className={`rounded p-1 hover:bg-zinc-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ${
          isActive ? "text-indigo-400" : "text-zinc-500"
        }`}
        title="Delete Conversation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
