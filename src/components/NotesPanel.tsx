"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenLine, X } from "lucide-react";

interface NotesPanelProps {
  notes: string;
  onChange: (value: string) => void;
}

export default function NotesPanel({ notes, onChange }: NotesPanelProps) {
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const justOpened = useRef(false);

  useEffect(() => {
    if (open && justOpened.current) {
      justOpened.current = false;
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) {
    return (
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            justOpened.current = true;
            setOpen(true);
          }}
          className="rounded-full h-12 w-12 p-0 bg-white border-zinc-200 shadow-md hover:shadow-lg hover:border-zinc-300 transition-all duration-200"
          title="Open notes"
        >
          <PenLine className="h-5 w-5 text-zinc-500" />
          {notes.trim() && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-zinc-900" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-10 w-80 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-600">Notes</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-7 w-7 p-0 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            title="Close notes"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Jot down thoughts, links, ideas..."
            className="w-full min-h-[280px] max-h-[60vh] resize-none rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-800 border-none outline-none placeholder:text-zinc-300 focus:bg-zinc-50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
