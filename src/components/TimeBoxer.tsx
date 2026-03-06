"use client";

import { useState, useCallback, useRef } from "react";
import { Phase } from "@/lib/types";
import { useTimer } from "@/lib/useTimer";
import { useSessionHistory } from "@/lib/useSessionHistory";
import SetupPhase from "./SetupPhase";
import TimerPhase from "./TimerPhase";
import ReviewPhase from "./ReviewPhase";
import HistoryPanel from "./HistoryPanel";

export default function TimeBoxer() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const startedAtRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { sessions, addSession, clearHistory } = useSessionHistory();

  const handleTimerComplete = useCallback(() => {
    setPhase("review");
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/alarm.wav");
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("TimeBoxer", {
        body: `Time's up! Did you finish: ${task}?`,
      });
    }
  }, [task]);

  const timer = useTimer({ onComplete: handleTimerComplete });

  const handleStart = (minutes: number, taskText: string) => {
    setTask(taskText);
    setDurationMinutes(minutes);
    startedAtRef.current = new Date().toISOString();
    setPhase("running");
    timer.start(minutes * 60);

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleCancel = () => {
    timer.cancel();
    setPhase("setup");
  };

  const handleReviewComplete = (accomplished: boolean, note?: string) => {
    addSession({
      task,
      durationMinutes,
      startedAt: startedAtRef.current,
      completedAt: new Date().toISOString(),
      accomplished,
      note,
    });
    setPhase("setup");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {phase === "setup" && <SetupPhase onStart={handleStart} />}
        {phase === "running" && (
          <TimerPhase
            task={task}
            secondsLeft={timer.secondsLeft}
            totalSeconds={timer.totalSeconds}
            progress={timer.progress}
            isPaused={timer.isPaused}
            onPause={timer.pause}
            onResume={timer.resume}
            onCancel={handleCancel}
          />
        )}
        {phase === "review" && (
          <ReviewPhase
            task={task}
            durationMinutes={durationMinutes}
            onComplete={handleReviewComplete}
          />
        )}
      </div>

      <div className="mt-12 w-full max-w-lg">
        <HistoryPanel sessions={sessions} onClear={clearHistory} />
      </div>
    </div>
  );
}
