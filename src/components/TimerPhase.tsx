"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Square, CheckCircle, Minimize2 } from "lucide-react";
import { formatTimeRange } from "@/lib/utils";

interface TimerPhaseProps {
  task: string;
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
  isPaused: boolean;
  startedAt: string;
  endsAt: string;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onFinishEarly: () => void;
  onMinimize: () => void;
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
  startedAt,
  endsAt,
  onPause,
  onResume,
  onCancel,
  onFinishEarly,
  onMinimize,
}: TimerPhaseProps) {
  const elapsedSeconds = totalSeconds - secondsLeft;

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-10">
      <p className="max-w-md text-center text-2xl font-semibold text-zinc-700">
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
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            elapsed
          </span>
          <span className="text-6xl font-bold tabular-nums tracking-tight text-zinc-900">
            {formatTime(elapsedSeconds)}
          </span>
          <span className="mt-1 text-sm tabular-nums text-zinc-400">
            {formatTime(secondsLeft)} remaining
          </span>
          <span className="mt-0.5 text-xs text-zinc-400/70">
            {formatTimeRange(startedAt, endsAt)}
          </span>
          {isPaused && (
            <span className="mt-1 text-xs font-medium tracking-widest uppercase text-zinc-400">
              Paused
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={isPaused ? onResume : onPause}
            className="rounded-full px-10 py-4 text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200"
          >
            {isPaused ? (
              <><Play className="mr-2 h-5 w-5" /> Resume</>
            ) : (
              <><Pause className="mr-2 h-5 w-5" /> Pause</>
            )}
          </Button>
          <Button
            variant="default"
            onClick={onFinishEarly}
            className="rounded-full px-10 py-4 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Done
          </Button>
          <Button
            variant="default"
            onClick={onCancel}
            className="rounded-full px-10 py-4 text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
          >
            <Square className="mr-2 h-5 w-5" /> Cancel
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={onMinimize}
          className="rounded-full px-6 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all duration-200"
        >
          <Minimize2 className="mr-1.5 h-4 w-4" /> Minimize
        </Button>
      </div>
    </div>
  );
}
