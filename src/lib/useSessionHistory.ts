"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "./types";

const STORAGE_KEY = "timebox-sessions";

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const addSession = useCallback((session: Omit<Session, "id">) => {
    const newSession: Session = {
      ...session,
      id: crypto.randomUUID(),
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      saveSessions(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { sessions, addSession, clearHistory };
}
