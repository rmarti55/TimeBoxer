"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

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

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-10">
      <p className="max-w-md text-center text-lg text-zinc-400">
        {task}
      </p>

      <div className="relative flex items-center justify-center">
        <svg width="300" height="300" className="-rotate-90">
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-zinc-100"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
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
            <span className="mt-2 text-xs font-medium tracking-widest uppercase text-zinc-400">
              Paused
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={isPaused ? onResume : onPause}
          className="rounded-full px-8 py-3 text-sm font-medium bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 transition-all duration-200"
        >
          {isPaused ? (
            <><Play className="mr-2 h-4 w-4" /> Resume</>
          ) : (
            <><Pause className="mr-2 h-4 w-4" /> Pause</>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="rounded-full px-8 py-3 text-sm font-medium bg-white text-zinc-600 border-zinc-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
        >
          <Square className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}
