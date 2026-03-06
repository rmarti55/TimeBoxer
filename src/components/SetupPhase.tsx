"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESETS = [5, 10, 15, 20, 30, 45, 60];

interface SetupPhaseProps {
  onStart: (minutes: number, task: string) => void;
}

export default function SetupPhase({ onStart }: SetupPhaseProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (selectedMinutes === null && task.trim().length === 0) {
      setError("Select a duration and enter what you want to focus on.");
      return;
    }
    if (selectedMinutes === null) {
      setError("Select a duration.");
      return;
    }
    if (task.trim().length === 0) {
      setError("Enter what you want to focus on.");
      return;
    }
    setError("");
    onStart(selectedMinutes, task.trim());
  };

  const handleSelectMinutes = (m: number) => {
    setSelectedMinutes(m);
    if (error) setError("");
  };

  const handleTaskChange = (val: string) => {
    setTask(val);
    if (error) setError("");
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          TimeBoxer
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Pick a duration and set your intention
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {PRESETS.map((m) => (
          <Button
            key={m}
            variant="outline"
            onClick={() => handleSelectMinutes(m)}
            className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
              selectedMinutes === m
                ? "bg-zinc-900 text-white border-transparent hover:bg-zinc-800 hover:text-white"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800"
            }`}
          >
            {m >= 60 ? `${m / 60} hr` : `${m} min`}
          </Button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <label
          htmlFor="task-input"
          className="mb-2 block text-sm font-medium text-zinc-400"
        >
          What do you want to focus on?
        </label>
        <Input
          id="task-input"
          type="text"
          value={task}
          onChange={(e) => handleTaskChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
          placeholder="e.g. Write the intro paragraph..."
          className="w-full rounded-2xl border-zinc-200 bg-white px-5 py-4 text-base text-zinc-800 shadow-sm transition-all placeholder:text-zinc-300 focus-visible:ring-zinc-200 focus-visible:border-zinc-400"
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleStart}
          className="rounded-full px-10 py-4 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm transition-all duration-200"
        >
          Start
        </Button>
        {error && (
          <p className="text-sm text-zinc-400 animate-in">{error}</p>
        )}
      </div>
    </div>
  );
}
