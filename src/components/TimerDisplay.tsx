import React, { useEffect, useState } from 'react';
import type { StopwatchController } from '../hooks/useTimer';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  stopwatch: StopwatchController;
  className?: string;
}

/**
 * Isolated timer display that re-renders only itself when the clock ticks.
 * Prevents unnecessary re-rendering of the game board and card elements.
 */
export const TimerDisplay: React.FC<TimerDisplayProps> = React.memo(({ stopwatch, className = '' }) => {
  const [formattedTime, setFormattedTime] = useState<string>(() => stopwatch.getFormattedTime());

  useEffect(() => {
    return stopwatch.subscribe((formatted) => {
      setFormattedTime(formatted);
    });
  }, [stopwatch]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-tight text-slate-800 dark:text-slate-100 ${className}`}
      aria-label={`Elapsed time: ${formattedTime}`}
    >
      <Clock className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
      <span>{formattedTime}</span>
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';
