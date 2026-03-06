"use client";

import { useState } from "react";

const PRESETS = [5, 10, 15, 20, 30, 45, 60];

interface SetupPhaseProps {
  onStart: (minutes: number, task: string) => void;
}

export default function SetupPhase({ onStart }: SetupPhaseProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [task, setTask] = useState("");

  const canStart = selectedMinutes !== null && task.trim().length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">TimeBoxer</h1>
        <p className="mt-2 text-zinc-500">
          Pick a duration and set your intention
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMinutes(m)}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              selectedMinutes === m
                ? "bg-zinc-900 text-white shadow-md scale-105"
                : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {m >= 60 ? `${m / 60} hr` : `${m} min`}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <label
          htmlFor="task-input"
          className="mb-2 block text-sm font-medium text-zinc-500"
        >
          What do you want to focus on?
        </label>
        <input
          id="task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canStart) {
              onStart(selectedMinutes!, task.trim());
            }
          }}
          placeholder="e.g. Write the intro paragraph..."
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      <button
        disabled={!canStart}
        onClick={() => canStart && onStart(selectedMinutes!, task.trim())}
        className="rounded-xl bg-zinc-900 px-10 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        Start
      </button>
    </div>
  );
}
