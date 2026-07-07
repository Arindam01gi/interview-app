"use client";

import React from "react";
import { User } from "@/types/auth";

interface SidebarFooterProps {
  currentUser: User | null;
  onClearChat: () => void;
  onLogout: () => void;
}

export default function SidebarFooter({
  currentUser,
  onClearChat,
  onLogout,
}: SidebarFooterProps) {
  return (
    <div className="mt-auto border-t border-zinc-900 pt-4 space-y-3">
      {/* Clear active chat */}
      <button
        onClick={onClearChat}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-white transition-all duration-200 active:scale-98"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-zinc-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Clear Active Chat
      </button>

      {/* User profile + logout */}
      {currentUser && (
        <div className="flex items-center justify-between border-t border-zinc-900 pt-3 mt-1 px-1">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Avatar initial */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-850 text-xs font-semibold text-indigo-400 border border-zinc-700">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-zinc-200 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
