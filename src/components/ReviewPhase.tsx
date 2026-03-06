"use client";

import { useState } from "react";

interface ReviewPhaseProps {
  task: string;
  durationMinutes: number;
  onComplete: (accomplished: boolean, note?: string) => void;
}

export default function ReviewPhase({
  task,
  durationMinutes,
  onComplete,
}: ReviewPhaseProps) {
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <div className="mb-3 text-5xl">⏰</div>
        <h2 className="text-3xl font-bold text-zinc-900">Time&apos;s up!</h2>
        <p className="mt-3 text-zinc-500">
          {durationMinutes} min — {task}
        </p>
      </div>

      <div className="text-center w-full max-w-md mt-4">
        <p className="mb-6 text-lg font-medium text-zinc-800">
          Did you accomplish what you set out to do?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelected(true)}
            className={`rounded-2xl px-10 py-3 text-sm font-semibold transition-all ${
              selected === true
                ? "bg-emerald-600 text-white shadow-md scale-105"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setSelected(false)}
            className={`rounded-2xl px-10 py-3 text-sm font-semibold transition-all ${
              selected === false
                ? "bg-red-600 text-white shadow-md scale-105"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {selected !== null && (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
          <label
            htmlFor="note-input"
            className="mb-2 block text-sm font-medium text-zinc-500"
          >
            Quick reflection (optional)
          </label>
          <textarea
            id="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What went well? What got in the way?"
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
          <button
            onClick={() =>
              onComplete(selected, note.trim() || undefined)
            }
            className="mt-6 w-full rounded-xl bg-zinc-900 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg"
          >
            Save &amp; Start Another
          </button>
        </div>
      )}
    </div>
  );
}
