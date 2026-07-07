"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    sessions,
    activeSessionId,
    createNewSession,
    deleteSession,
    setActiveSessionId,
    clearActiveSession,
  } = useChat();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-zinc-950 p-4 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / New Chat */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-base font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Chat Space
          </h1>
          <button
            onClick={createNewSession}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-2 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            History ({sessions.length})
          </div>
          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-zinc-600">
              No chat history yet.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    onClose(); // close mobile sidebar on select
                  }}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-200"
                      : "border border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-400" : "text-zinc-500"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.68 0-5.305.136-7.892.404C2.528 3.636 1.405 5.03 1.405 6.632v5.783Z"
                      />
                    </svg>
                    <span className="truncate pr-1">
                      {session.title || "New Conversation"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className={`rounded p-1 hover:bg-zinc-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-auto border-t border-zinc-900 pt-4">
          <button
            onClick={clearActiveSession}
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
        </div>
      </aside>
    </>
  );
}
