"use client";

import { Maximize2 } from "lucide-react";

interface MiniTimerProps {
  task: string;
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
  isPaused: boolean;
  onMaximize: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function MiniTimer({
  task,
  secondsLeft,
  totalSeconds,
  progress,
  isPaused,
  onMaximize,
}: MiniTimerProps) {
  const elapsedSeconds = totalSeconds - secondsLeft;
  return (
    <button
      type="button"
      onClick={onMaximize}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition-all duration-200 hover:shadow-xl hover:border-zinc-300">
        <div
          className="absolute inset-x-0 top-0 h-[3px] bg-zinc-900 transition-all duration-1000 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />

        <div className="flex items-center gap-4 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-700">
              {task}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {isPaused && (
              <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">
                Paused
              </span>
            )}
            <span className="text-lg font-bold tabular-nums text-zinc-900">
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-xs tabular-nums text-zinc-400">
              {formatTime(secondsLeft)} left
            </span>
            <Maximize2 className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </div>
    </button>
  );
}
