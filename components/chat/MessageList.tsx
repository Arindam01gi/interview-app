"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import MessageItem from "./MessageItem";

export default function MessageList() {
  const { activeSession, isLoading, error } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = activeSession?.messages || [];

  // Auto scroll to bottom when messages or loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.598.598 0 0 1-.655-.07.598.598 0 0 1-.165-.6c.021-.121.106-.87.41-1.74A7.473 7.473 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Welcome to AI Chat</h2>
        <p className="max-w-sm text-sm text-zinc-400">
          Start a new conversation by typing a message below. Ask questions, get help writing code, or just brainstorm ideas!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex w-full items-start gap-3 py-3 md:gap-4 animate-in fade-in duration-300">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-semibold text-indigo-400 shadow-sm">
            AI
          </div>
          <div className="flex flex-col rounded-2xl rounded-tl-none border border-zinc-800 bg-zinc-900 px-4 py-4 shadow-sm">
            <div className="flex gap-1.5 items-center py-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"></span>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex w-full justify-center p-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-900/50 px-4 py-2 text-xs text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-red-500 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
