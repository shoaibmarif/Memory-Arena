import { useState, useRef, useEffect, useCallback } from 'react';

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function useTimer() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  // High precision timestamp trackers
  const startTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const intervalIdRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (startTimeRef.current !== null) return; // Already running
    startTimeRef.current = Date.now();
    setIsActive(true);

    intervalIdRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        const currentElapsed = accumulatedMsRef.current + (Date.now() - startTimeRef.current);
        setSeconds(Math.floor(currentElapsed / 1000));
      }
    }, 200);
  }, []);

  const pause = useCallback(() => {
    if (startTimeRef.current !== null) {
      accumulatedMsRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsActive(false);
  }, []);

  const resume = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      setIsActive(true);

      intervalIdRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const currentElapsed = accumulatedMsRef.current + (Date.now() - startTimeRef.current);
          setSeconds(Math.floor(currentElapsed / 1000));
        }
      }, 200);
    }
  }, []);

  const stop = useCallback(() => {
    if (startTimeRef.current !== null) {
      accumulatedMsRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsActive(false);
    return Math.floor(accumulatedMsRef.current / 1000);
  }, []);

  const reset = useCallback(() => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    startTimeRef.current = null;
    accumulatedMsRef.current = 0;
    setSeconds(0);
    setIsActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return {
    seconds,
    formattedTime: formatTime(seconds),
    isActive,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
