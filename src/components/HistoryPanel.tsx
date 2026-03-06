"use client";

import { useState } from "react";
import { Session } from "@/lib/types";

interface HistoryPanelProps {
  sessions: Session[];
  onClear: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryPanel({ sessions, onClear }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
      >
        <span>History ({sessions.length})</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">{s.task}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {s.durationMinutes} min · {formatDate(s.completedAt)}
                  </p>
                  {s.note && (
                    <p className="mt-2 text-sm text-zinc-700">
                      {s.note}
                    </p>
                  )}
                </div>
                <span
                  className={`mt-0.5 flex-shrink-0 text-lg font-bold ${
                    s.accomplished ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {s.accomplished ? "✓" : "✗"}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-4 text-center">
            {confirmClear ? (
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm text-zinc-600">Clear all history?</span>
                <button
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-sm text-zinc-500 hover:text-red-600 transition-colors"
              >
                Clear history
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
