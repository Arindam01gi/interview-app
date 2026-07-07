"use client";

import React, { useState, useMemo } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SessionList from "./SessionList";
import SidebarFooter from "./SidebarFooter";

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

  const { currentUser, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter sessions by title OR message content
  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-zinc-950 p-4 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader onNewChat={createNewSession} />

        <SidebarSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        <SessionList
          sessions={filteredSessions}
          activeSessionId={activeSessionId}
          searchQuery={searchQuery}
          totalCount={sessions.length}
          onSelect={setActiveSessionId}
          onDelete={deleteSession}
          onClose={onClose}
        />

        <SidebarFooter
          currentUser={currentUser}
          onClearChat={clearActiveSession}
          onLogout={logout}
        />
      </aside>
    </>
  );
}
