"use client";

import { useState } from "react";
import { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";

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
  const [confirmClear, setConfirmClear] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <Accordion className="w-full">
        <AccordionItem value="history" className="border-none">
          <AccordionTrigger className="hover:no-underline rounded-full bg-white border border-zinc-200 shadow-sm px-6 py-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 transition-all duration-200">
            History ({sessions.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-4 space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl bg-white border border-zinc-100 px-5 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-800 text-sm">
                        {s.task}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {s.durationMinutes} min · {formatDate(s.completedAt)}
                      </p>
                      {s.note && (
                        <p className="mt-2 text-sm text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl">
                          {s.note}
                        </p>
                      )}
                    </div>
                    <div className="mt-0.5 flex-shrink-0">
                      {s.accomplished ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-zinc-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 text-center">
                {confirmClear ? (
                  <div className="flex items-center justify-center gap-3 animate-in">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
