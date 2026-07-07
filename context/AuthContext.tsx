"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { User, StoredUser } from "@/types/auth";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (name: string, email: string, passwordHash: string) => Promise<boolean>;
  signIn: (email: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web Crypto SHA-256 hashing helper
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("Crypto API not available or failed:", err);
    // Simple fallback hash for extremely old environments (should rarely happen in modern Next.js/browsers)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return "fallback_" + hash.toString(16);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load current user on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chat_current_user_v1");
      if (stored) {
        setCurrentUser(JSON.parse(stored) as User);
      }
    } catch (err) {
      console.error("Failed to read user session from localStorage:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = async (name: string, email: string, passwordRaw: string): Promise<boolean> => {
    setError(null);
    if (!name.trim() || !email.trim() || !passwordRaw.trim()) {
      setError("All fields are required.");
      return false;
    }

    try {
      const storedUsers = localStorage.getItem("chat_users_v1");
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user already exists
      const normalizedEmail = email.toLowerCase().trim();
      if (users.some((u) => u.email === normalizedEmail)) {
        setError("An account with this email already exists.");
        return false;
      }

      const passwordHash = await hashPassword(passwordRaw);

      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("chat_users_v1", JSON.stringify(updatedUsers));

      // Auto sign in after sign up
      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      
      localStorage.setItem("chat_current_user_v1", JSON.stringify(userSession));
      setCurrentUser(userSession);
      return true;
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError("Failed to create account. Storage might be full.");
      return false;
    }
  };

  const signIn = async (email: string, passwordRaw: string): Promise<boolean> => {
    setError(null);
    if (!email.trim() || !passwordRaw.trim()) {
      setError("Email and password are required.");
      return false;
    }

    try {
      const storedUsers = localStorage.getItem("chat_users_v1");
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      const normalizedEmail = email.toLowerCase().trim();
      const user = users.find((u) => u.email === normalizedEmail);

      if (!user) {
        setError("Invalid email or password.");
        return false;
      }

      const checkHash = await hashPassword(passwordRaw);

      if (user.passwordHash !== checkHash) {
        setError("Invalid email or password.");
        return false;
      }

      const userSession: User = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      localStorage.setItem("chat_current_user_v1", JSON.stringify(userSession));
      setCurrentUser(userSession);
      return true;
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError("Sign in failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("chat_current_user_v1");
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      console.error("Failed to clear user session on logout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        signUp,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
