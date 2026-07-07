"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import VoiceInput from "./VoiceInput";

export default function ChatInput() {
  const { sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-resize textarea as text is entered
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  // Clear error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleTranscript = (transcript: string) => {
    setInput((prev) => {
      const space = prev.trim().length > 0 ? " " : "";
      return prev + space + transcript;
    });
  };

  const handleVoiceError = (error: string) => {
    setErrorMessage(error);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // Stop listening if we submit
    if (isListening) {
      setIsListening(false);
    }

    const text = input;
    setInput("");
    
    // Reset height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-zinc-800 dark:border-zinc-800 bg-zinc-900/60 dark:bg-zinc-900/60 p-4 backdrop-blur-md relative">
      {/* Temporary error overlay tooltip */}
      {errorMessage && (
        <div className="absolute left-1/2 -top-10 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg animate-bounce select-none z-50">
          {errorMessage}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <div className="relative flex items-end gap-2 rounded-xl border border-zinc-800 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 px-3 py-2 shadow-inner focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask AI anything... (Enter to send, Shift+Enter for new line)"}
            className="flex-1 resize-none bg-transparent py-1 px-1 text-sm text-zinc-100 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800"
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Separate VoiceInput Component */}
            <VoiceInput
              onTranscript={handleTranscript}
              onError={handleVoiceError}
              isListening={isListening}
              setIsListening={setIsListening}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm transition-all duration-200 ${
                input.trim() && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-500 active:scale-95"
                  : "bg-zinc-800 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
