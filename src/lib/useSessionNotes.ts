"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const PREFIX = "timebox-notes-";

function storageKey(sessionKey: string) {
  return `${PREFIX}${sessionKey}`;
}

function loadDraft(sessionKey: string): string {
  if (typeof window === "undefined" || !sessionKey) return "";
  try {
    return localStorage.getItem(storageKey(sessionKey)) ?? "";
  } catch {
    return "";
  }
}

function saveDraft(sessionKey: string, value: string) {
  if (!sessionKey) return;
  try {
    localStorage.setItem(storageKey(sessionKey), value);
  } catch {}
}

function removeDraft(sessionKey: string) {
  if (!sessionKey) return;
  try {
    localStorage.removeItem(storageKey(sessionKey));
  } catch {}
}

export function useSessionNotes(sessionKey: string) {
  const [notes, setNotes] = useState(() => loadDraft(sessionKey));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef(notes);

  useEffect(() => {
    setNotes(loadDraft(sessionKey));
  }, [sessionKey]);

  useEffect(() => {
    latestRef.current = notes;
  }, [notes]);

  const updateNotes = useCallback(
    (value: string) => {
      setNotes(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveDraft(sessionKey, value);
      }, 500);
    },
    [sessionKey],
  );

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    saveDraft(sessionKey, latestRef.current);
  }, [sessionKey]);

  const clearNotes = useCallback(() => {
    setNotes("");
    if (timerRef.current) clearTimeout(timerRef.current);
    removeDraft(sessionKey);
  }, [sessionKey]);

  const getNotes = useCallback(() => latestRef.current, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { notes, updateNotes, clearNotes, flush, getNotes };
}
