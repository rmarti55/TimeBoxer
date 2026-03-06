"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlarmClock, CheckCircle } from "lucide-react";

interface ReviewPhaseProps {
  task: string;
  durationMinutes: number;
  finishedEarly?: boolean;
  onComplete: (accomplished: boolean, note?: string) => void;
}

export default function ReviewPhase({
  task,
  durationMinutes,
  finishedEarly = false,
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
    <div className="flex flex-col items-center gap-8">
      <div className="text-center flex flex-col items-center">
        {finishedEarly ? (
          <CheckCircle className="mb-3 h-9 w-9 text-emerald-400" strokeWidth={1.5} />
        ) : (
          <AlarmClock className="mb-3 h-9 w-9 text-zinc-300" strokeWidth={1.5} />
        )}
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
          {finishedEarly ? "Nice work!" : "Time\u2019s up!"}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {durationMinutes} min session
        </p>
      </div>

      <p className="max-w-md text-center text-2xl font-semibold text-zinc-700">
        {task}
      </p>

      <div className="text-center w-full max-w-md">
        <p className="mb-4 text-base font-medium text-zinc-600">
          Did you accomplish your goal?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleSelect(true)}
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 ${
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
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 ${
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

      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleSave}
          className="rounded-full px-10 py-4 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm transition-all duration-200"
        >
          Done
        </Button>
        {error && (
          <p className="text-sm text-zinc-400 animate-in">{error}</p>
        )}
      </div>
    </div>
  );
}
