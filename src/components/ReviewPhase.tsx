"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlarmClock } from "lucide-react";

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
  const [error, setError] = useState("");

  const handleSave = () => {
    if (selected === null) {
      setError("Let us know — did you accomplish your goal?");
      return;
    }
    setError("");
    onComplete(selected, note.trim() || undefined);
  };

  const handleSelect = (val: boolean) => {
    setSelected(val);
    if (error) setError("");
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center flex flex-col items-center">
        <AlarmClock className="mb-4 h-10 w-10 text-zinc-300" strokeWidth={1.5} />
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">
          Time&apos;s up!
        </h2>
        <p className="mt-3 text-lg text-zinc-400">
          {durationMinutes} min — {task}
        </p>
      </div>

      <div className="text-center w-full max-w-md">
        <p className="mb-5 text-base font-medium text-zinc-600">
          Did you accomplish what you set out to do?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleSelect(true)}
            className={`rounded-full px-10 py-3 text-sm font-medium transition-all duration-200 ${
              selected === true
                ? "bg-zinc-900 text-white border-transparent hover:bg-zinc-800 hover:text-white"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800"
            }`}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSelect(false)}
            className={`rounded-full px-10 py-3 text-sm font-medium transition-all duration-200 ${
              selected === false
                ? "bg-zinc-900 text-white border-transparent hover:bg-zinc-800 hover:text-white"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800"
            }`}
          >
            No
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <label
          htmlFor="note-input"
          className="mb-2 block text-sm font-medium text-zinc-400"
        >
          Quick reflection (optional)
        </label>
        <Textarea
          id="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What went well? What got in the way?"
          rows={3}
          className="w-full rounded-2xl bg-white px-5 py-4 text-base text-zinc-800 border-zinc-200 shadow-sm transition-all resize-none placeholder:text-zinc-300 focus-visible:ring-zinc-200 focus-visible:border-zinc-400"
        />
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <Button
          onClick={handleSave}
          className="w-full rounded-full px-10 py-4 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm transition-all duration-200"
        >
          Save &amp; Start Another
        </Button>
        {error && (
          <p className="text-sm text-zinc-400 animate-in">{error}</p>
        )}
      </div>
    </div>
  );
}
