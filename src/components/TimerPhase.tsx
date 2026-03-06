"use client";

import { useEffect } from "react";

interface TimerPhaseProps {
  task: string;
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TimerPhase({
  task,
  secondsLeft,
  totalSeconds,
  progress,
  isPaused,
  onPause,
  onResume,
  onCancel,
}: TimerPhaseProps) {
  useEffect(() => {
    const original = document.title;
    document.title = `${formatTime(secondsLeft)} — TimeBoxer`;
    return () => {
      document.title = original;
    };
  }, [secondsLeft]);

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-12">
      <p className="max-w-md text-center text-lg text-zinc-500">
        {task}
      </p>

      <div className="relative flex items-center justify-center">
        <svg width="320" height="320" className="-rotate-90">
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-zinc-200"
          />
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-zinc-900 transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-bold tabular-nums tracking-tight text-zinc-900">
            {formatTime(secondsLeft)}
          </span>
          {isPaused && (
            <span className="mt-2 text-sm font-medium text-amber-600">
              PAUSED
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={isPaused ? onResume : onPause}
          className="rounded-full bg-white border border-zinc-200 px-8 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-full bg-white border border-zinc-200 px-8 py-3 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:border-red-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
