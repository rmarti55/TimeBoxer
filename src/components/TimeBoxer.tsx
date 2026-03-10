"use client";

import { useState, useCallback, useRef } from "react";
import { Phase } from "@/lib/types";
import { useTimer } from "@/lib/useTimer";
import { useSessionHistory } from "@/lib/useSessionHistory";
import SetupPhase from "./SetupPhase";
import TimerPhase from "./TimerPhase";
import ReviewPhase from "./ReviewPhase";
import HistoryPanel from "./HistoryPanel";

function playAlarmSound() {
  try {
    const ctx = new AudioContext();
    const beepCount = 3;
    const beepDuration = 0.15;
    const gap = 0.12;

    for (let i = 0; i < beepCount; i++) {
      const startTime = ctx.currentTime + i * (beepDuration + gap);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + beepDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + beepDuration);
    }
  } catch {}
}

export default function TimeBoxer() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [finishedEarly, setFinishedEarly] = useState(false);
  const startedAtRef = useRef<string>("");
  const endedAtRef = useRef<string>("");

  const { sessions, addSession, clearHistory } = useSessionHistory();

  const handleTimerComplete = useCallback(() => {
    endedAtRef.current = new Date().toISOString();
    setFinishedEarly(false);
    setPhase("review");
    playAlarmSound();

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

  const handleFinishEarly = () => {
    timer.cancel();
    endedAtRef.current = new Date().toISOString();
    setFinishedEarly(true);
    setPhase("review");
  };

  const handleReviewComplete = (accomplished: boolean, note?: string) => {
    addSession({
      task,
      durationMinutes,
      startedAt: startedAtRef.current,
      completedAt: endedAtRef.current,
      accomplished,
      note,
    });
    setPhase("setup");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16 bg-[#fafafa]">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-full animate-in fade-in duration-500">
          {phase === "setup" && <SetupPhase onStart={handleStart} />}
          {phase === "running" && (
            <TimerPhase
              task={task}
              secondsLeft={timer.secondsLeft}
              totalSeconds={timer.totalSeconds}
              progress={timer.progress}
              isPaused={timer.isPaused}
              startedAt={startedAtRef.current}
              endsAt={new Date(new Date(startedAtRef.current).getTime() + durationMinutes * 60_000).toISOString()}
              onPause={timer.pause}
              onResume={timer.resume}
              onCancel={handleCancel}
              onFinishEarly={handleFinishEarly}
            />
          )}
          {phase === "review" && (
            <ReviewPhase
              task={task}
              durationMinutes={durationMinutes}
              finishedEarly={finishedEarly}
              startedAt={startedAtRef.current}
              endedAt={endedAtRef.current}
              onComplete={handleReviewComplete}
            />
          )}
        </div>

        {phase === "setup" && sessions.length > 0 && (
          <div className="w-full animate-in fade-in duration-700 delay-150 fill-mode-both">
            <HistoryPanel sessions={sessions} onClear={clearHistory} onRestart={handleStart} />
          </div>
        )}
      </div>
    </div>
  );
}
