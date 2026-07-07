"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChat } from "@/context/ChatContext";

export default function ChatWindow() {
  const { activeSession, createNewSession } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main chat section */}
      <main className="flex flex-1 flex-col h-full overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
        
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-4 backdrop-blur-md shrink-0">
          
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white md:hidden active:scale-95 transition-all"
              aria-label="Open Sidebar"
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Active Chat Title */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {activeSession?.title || "New Conversation"}
              </h2>
              <p className="hidden sm:block text-[10px] text-zinc-500">
                Powered by Gemini-2.5-Flash Model
              </p>
            </div>
          </div>

          {/* Top-Right Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={createNewSession}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {/* Message Container list */}
        <MessageList />

        {/* Text Input area */}
        <ChatInput />
      </main>
    </div>
  );
}
