"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2, RotateCcw } from "lucide-react";
import { formatTimeRange } from "@/lib/utils";

interface HistoryPanelProps {
  sessions: Session[];
  onClear: () => void;
  onRestart: (minutes: number, task: string) => void;
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function HistoryPanel({ sessions, onClear, onRestart }: HistoryPanelProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => { checkScroll(); }, [checkScroll, sessions]);

  if (sessions.length === 0) return null;

  const topMask = canScrollUp ? "transparent, black 24px" : "black, black";
  const bottomMask = canScrollDown ? "black calc(100% - 24px), transparent" : "black, black";
  const mask = `linear-gradient(to bottom, ${topMask}, ${bottomMask})`;

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-medium text-zinc-400">
          History ({sessions.length})
        </h2>
        {confirmClear ? (
          <div className="flex items-center gap-2 animate-in">
            <span className="text-sm text-zinc-400">Clear all?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClear();
                setConfirmClear(false);
              }}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full text-sm"
            >
              Yes, clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClear(false)}
              className="text-zinc-500 hover:text-zinc-700 rounded-full text-sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmClear(true)}
            className="text-zinc-400 hover:text-red-500 transition-colors rounded-full text-sm"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear history
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="max-h-[320px] overflow-y-auto space-y-3 pr-1 scrollbar-thin"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onRestart(s.durationMinutes, s.task)}
            className="w-full text-left rounded-2xl bg-white border border-zinc-100 px-5 py-4 shadow-sm cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium text-zinc-800 text-sm">
                  {s.task}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {s.durationMinutes} min · {formatTimeRange(s.startedAt, s.completedAt)} · {formatShortDate(s.startedAt)}
                </p>
                {s.note && (
                  <p className="mt-2 text-sm text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl">
                    {s.note}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {s.accomplished ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-zinc-300" />
                )}
                <RotateCcw className="h-4 w-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
