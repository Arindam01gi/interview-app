"use client";

import React from "react";
import { Message } from "@/types/chat";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  // Simple formatting helper to handle basic code blocks and line breaks
  const renderContent = (text: string) => {
    if (!text) return null;

    // Split text by code blocks ```
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check if it's a code block
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        // Check for language declaration
        const language = lines[0] && lines[0].length < 15 ? lines[0] : "";
        const code = language ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
            {language && (
              <div className="flex items-center justify-between bg-zinc-900 px-4 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400 select-none">
                <span>{language}</span>
                <span className="text-[9px]">Code</span>
              </div>
            )}
            <pre className="overflow-x-auto p-4 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Handle normal paragraphs, bold formatting **text**, and list items
      const paragraphs = part.split("\n").map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-2" />;

        // Handle simple bold parsing: **text** -> <strong>text</strong>
        const boldRegex = /\*\*(.*?)\*\*/g;
        const lineParts = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            lineParts.push(line.substring(lastIndex, match.index));
          }
          lineParts.push(
            <strong key={match.index} className="font-semibold text-white">
              {match[1]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }

        if (lastIndex < line.length) {
          lineParts.push(line.substring(lastIndex));
        }

        // Handle list bullet items: starts with * or -
        if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
          return (
            <li key={lineIdx} className="ml-5 list-disc py-0.5 leading-relaxed text-zinc-200">
              {lineParts.length > 0 ? lineParts : line.trim().substring(2)}
            </li>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed mb-1">
            {lineParts.length > 0 ? lineParts : line}
          </p>
        );
      });

      return <div key={index}>{paragraphs}</div>;
    });
  };

  return (
    <div
      className={`flex w-full items-start gap-3 py-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg text-sm font-semibold shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            : "bg-zinc-800 border border-zinc-700 text-indigo-400"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble Message */}
      <div
        className={`flex max-w-[85%] flex-col rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-[70%] ${
          isUser
            ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none"
            : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
        }`}
      >
        <div className="break-words">{renderContent(message.content)}</div>
        <div
          className={`mt-1.5 text-[10px] ${
            isUser ? "text-indigo-200" : "text-zinc-500"
          } self-end select-none`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
