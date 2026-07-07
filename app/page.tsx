"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";
import AuthScreens from "@/components/auth/AuthScreens";

function MainContent() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreens />;
  }

  return <ChatWindow />;
}

export default function Home() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainContent />
      </ChatProvider>
    </AuthProvider>
  );
}
