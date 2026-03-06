"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseTimerOptions {
  onComplete?: () => void;
}

export function useTimer({ onComplete }: UseTimerOptions = {}) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (durationSeconds: number) => {
      clearTimer();
      setTotalSeconds(durationSeconds);
      setSecondsLeft(durationSeconds);
      setIsRunning(true);
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsPaused(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      clearTimer();
      setIsPaused(true);
    }
  }, [isRunning, isPaused, clearTimer]);

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsPaused(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isRunning, isPaused, clearTimer]);

  const cancel = useCallback(() => {
    clearTimer();
    setSecondsLeft(0);
    setTotalSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  return { secondsLeft, totalSeconds, isRunning, isPaused, progress, start, pause, resume, cancel };
}
