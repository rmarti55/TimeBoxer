"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Phase } from "@/lib/types";
import { useTimer } from "@/lib/useTimer";
import { useSessionHistory } from "@/lib/useSessionHistory";
import { useSessionNotes } from "@/lib/useSessionNotes";
import SetupPhase from "./SetupPhase";
import TimerPhase from "./TimerPhase";
import ReviewPhase from "./ReviewPhase";
import HistoryPanel from "./HistoryPanel";
import MiniTimer from "./MiniTimer";
import NotesPanel from "./NotesPanel";

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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TimeBoxer() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [finishedEarly, setFinishedEarly] = useState(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);
  const startedAtRef = useRef<string>("");
  const endedAtRef = useRef<string>("");

  const { sessions, addSession, clearHistory } = useSessionHistory();
  const sessionNotes = useSessionNotes(startedAtRef.current);

  const handleTimerComplete = useCallback(() => {
    endedAtRef.current = new Date().toISOString();
    sessionNotes.flush();
    setFinishedEarly(false);
    setIsTimerMinimized(false);
    setPhase("review");
    playAlarmSound();

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("TimeBoxer", {
        body: `Time's up! Did you finish: ${task}?`,
      });
    }
  }, [task, sessionNotes.flush]);

  const timer = useTimer({ onComplete: handleTimerComplete });

  useEffect(() => {
    if (phase !== "running") return;
    const original = document.title;
    const elapsed = timer.totalSeconds - timer.secondsLeft;
    document.title = `${formatTime(elapsed)} elapsed — TimeBoxer`;
    return () => {
      document.title = original;
    };
  }, [phase, timer.secondsLeft, timer.totalSeconds]);

  const handleStart = (minutes: number, taskText: string) => {
    setTask(taskText);
    setDurationMinutes(minutes);
    startedAtRef.current = new Date().toISOString();
    setIsTimerMinimized(false);
    setPhase("running");
    timer.start(minutes * 60);

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleCancel = () => {
    timer.cancel();
    sessionNotes.clearNotes();
    setIsTimerMinimized(false);
    setPhase("setup");
  };

  const handleFinishEarly = () => {
    timer.cancel();
    sessionNotes.flush();
    endedAtRef.current = new Date().toISOString();
    setFinishedEarly(true);
    setIsTimerMinimized(false);
    setPhase("review");
  };

  const handleReviewComplete = (accomplished: boolean, note?: string) => {
    const inSessionNotes = sessionNotes.getNotes().trim() || undefined;
    addSession({
      task,
      durationMinutes,
      startedAt: startedAtRef.current,
      completedAt: endedAtRef.current,
      accomplished,
      note,
      notes: inSessionNotes,
    });
    sessionNotes.clearNotes();
    setPhase("setup");
  };

  const showSetupAndHistory = phase === "setup" || (phase === "running" && isTimerMinimized);

  const isFullTimer = phase === "running" && !isTimerMinimized;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16 bg-[#fafafa]">
      <div className={`w-full flex flex-col items-center ${isFullTimer ? "max-w-5xl" : "max-w-2xl"}`}>
        <div className="w-full animate-in fade-in duration-500">
          {showSetupAndHistory && <SetupPhase onStart={handleStart} />}
          {isFullTimer && (
            <div className="flex items-start justify-center gap-8 w-full">
              <div className="flex-1 flex justify-center">
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
                  onMinimize={() => setIsTimerMinimized(true)}
                />
              </div>
              <NotesPanel
                notes={sessionNotes.notes}
                onChange={sessionNotes.updateNotes}
              />
            </div>
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

        {showSetupAndHistory && sessions.length > 0 && (
          <div className="w-full animate-in fade-in duration-700 delay-150 fill-mode-both">
            <HistoryPanel sessions={sessions} onClear={clearHistory} onRestart={handleStart} />
          </div>
        )}
      </div>

      {phase === "running" && isTimerMinimized && (
        <MiniTimer
          task={task}
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          progress={timer.progress}
          isPaused={timer.isPaused}
          onMaximize={() => setIsTimerMinimized(false)}
        />
      )}
    </div>
  );
}
