"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "./types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { rowToSession, sessionToInsert, type TimeboxSessionRow } from "./timebox-db";

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

export function useSessionHistory(userId: string | null, authLoading: boolean) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      const t = window.setTimeout(() => {
        setSessions(loadSessions());
        setCloudLoading(false);
        setHistoryError(null);
      }, 0);
      return () => clearTimeout(t);
    }

    const uid = userId;
    const supabase = createBrowserSupabaseClient();
    let cancelled = false;

    async function loadCloud() {
      setCloudLoading(true);
      setHistoryError(null);
      setSessions([]);

      const { data, error } = await supabase
        .from("timebox_sessions")
        .select("*")
        .order("started_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setHistoryError(error.message);
        setCloudLoading(false);
        return;
      }

      const rows = (data ?? []) as TimeboxSessionRow[];
      let list = rows.map(rowToSession);

      const local = loadSessions();
      if (list.length === 0 && local.length > 0) {
        const sortedLocal = [...local].sort((a, b) =>
          b.startedAt.localeCompare(a.startedAt),
        );
        const inserts = sortedLocal.map((s) => sessionToInsert(s, uid));
        const { error: insertError } = await supabase.from("timebox_sessions").insert(inserts);
        if (cancelled) return;
        if (insertError) {
          setHistoryError(insertError.message);
          setCloudLoading(false);
          return;
        }
        localStorage.removeItem(STORAGE_KEY);
        list = sortedLocal;
      }

      if (cancelled) return;
      setSessions(list);
      setCloudLoading(false);
    }

    void loadCloud();
    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  const addSession = useCallback(
    (session: Omit<Session, "id">) => {
      const newSession: Session = {
        ...session,
        id: crypto.randomUUID(),
      };

      if (!userId) {
        setSessions((prev) => {
          const updated = [newSession, ...prev];
          saveSessions(updated);
          return updated;
        });
        return;
      }

      setSessions((prev) => [newSession, ...prev]);

      const supabase = createBrowserSupabaseClient();
      const row = sessionToInsert(newSession, userId);
      void supabase
        .from("timebox_sessions")
        .insert(row)
        .then(({ error }) => {
          if (error) {
            setHistoryError(error.message);
            setSessions((prev) => prev.filter((s) => s.id !== newSession.id));
          }
        });
    },
    [userId],
  );

  const clearHistory = useCallback(() => {
    if (!userId) {
      setSessions([]);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    void supabase
      .from("timebox_sessions")
      .delete()
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) {
          setHistoryError(error.message);
          return;
        }
        setSessions([]);
      });
  }, [userId]);

  return { sessions, addSession, clearHistory, cloudLoading, historyError };
}
