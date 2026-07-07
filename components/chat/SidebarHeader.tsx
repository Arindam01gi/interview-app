"use client";

import React from "react";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export default function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h1 className="text-base font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        AI Chat Space
      </h1>
      <button
        onClick={onNewChat}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all duration-200 active:scale-95"
        title="New Chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
