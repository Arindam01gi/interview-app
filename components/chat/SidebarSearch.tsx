"use client";

import React from "react";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function SidebarSearch({ value, onChange, onClear }: SidebarSearchProps) {
  return (
    <div className="relative mb-3">
      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        id="session-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats..."
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-8 pr-8 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
