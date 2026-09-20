import { useRef, useEffect } from 'react';

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}

export type TimerListener = (formatted: string, seconds: number) => void;

/**
 * High-performance stopwatch that decouples the ticking clock from the React tree.
 * Subscribers (like TimerDisplay) update independently, eliminating unnecessary re-renders of the board.
 */
export class StopwatchController {
  private startTime: number | null = null;
  private accumulatedMs = 0;
  private intervalId: number | null = null;
  private listeners = new Set<TimerListener>();
  private active = false;

  public start = () => {
    if (this.startTime !== null) return;
    this.startTime = Date.now();
    this.active = true;

    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => {
        const sec = this.getSeconds();
        const formatted = formatTime(sec);
        this.listeners.forEach(cb => cb(formatted, sec));
      }, 500);
    }
  };

  public pause = () => {
    if (this.startTime !== null) {
      this.accumulatedMs += Date.now() - this.startTime;
      this.startTime = null;
    }
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.active = false;
  };

  public resume = () => {
    if (this.startTime === null && this.accumulatedMs >= 0) {
      this.startTime = Date.now();
      this.active = true;

      if (this.intervalId === null) {
        this.intervalId = window.setInterval(() => {
          const sec = this.getSeconds();
          const formatted = formatTime(sec);
          this.listeners.forEach(cb => cb(formatted, sec));
        }, 500);
      }
    }
  };

  public stop = (): number => {
    this.pause();
    return this.getSeconds();
  };

  public reset = () => {
    this.pause();
    this.accumulatedMs = 0;
    this.startTime = null;
    this.listeners.forEach(cb => cb('00:00', 0));
  };

  public getSeconds = (): number => {
    const elapsed = this.accumulatedMs + (this.startTime ? Date.now() - this.startTime : 0);
    return Math.floor(elapsed / 1000);
  };

  public getFormattedTime = (): string => {
    return formatTime(this.getSeconds());
  };

  public get isActive(): boolean {
    return this.active;
  }

  public subscribe = (listener: TimerListener): (() => void) => {
    this.listeners.add(listener);
    listener(this.getFormattedTime(), this.getSeconds());
    return () => {
      this.listeners.delete(listener);
    };
  };
}

export function useStopwatch() {
  const stopwatchRef = useRef<StopwatchController | null>(null);
  if (!stopwatchRef.current) {
    stopwatchRef.current = new StopwatchController();
  }

  useEffect(() => {
    return () => {
      stopwatchRef.current?.pause();
    };
  }, []);

  return stopwatchRef.current;
}
