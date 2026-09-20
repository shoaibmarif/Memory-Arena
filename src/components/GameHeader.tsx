import React from 'react';
import type { StopwatchController } from '../hooks/useTimer';
import { TimerDisplay } from './TimerDisplay';
import { Pause, Volume2, VolumeX, RotateCcw, Flame } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface GameHeaderProps {
  moves: number;
  stopwatch: StopwatchController;
  matchedPairs: number;
  totalPairs: number;
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(({
  moves,
  stopwatch,
  matchedPairs,
  totalPairs,
  currentStreak,
  soundEnabled,
  onToggleSound,
  onPause,
  onRestart,
}) => {
  const progressPercent = totalPairs > 0 ? Math.round((matchedPairs / totalPairs) * 100) : 0;
  const isComboActive = currentStreak >= 2;

  return (
    <header className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 mb-2">
      <div className="relative overflow-hidden bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl px-3 sm:px-6 py-3 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg transition-all">
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

        <div className="flex items-center justify-between gap-3">
          {/* Metrics Cluster */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Moves Badge */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                Moves
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">
                {moves}
              </span>
            </div>

            {/* Time Badge (Subscribed directly to Stopwatch to prevent app-wide re-renders) */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                Time
              </span>
              <div className="mt-0.5">
                <TimerDisplay stopwatch={stopwatch} className="text-base sm:text-lg font-black" />
              </div>
            </div>

            {/* Pairs Matched */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                Pairs
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
                {matchedPairs}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                  / {totalPairs}
                </span>
              </span>
            </div>

            {/* Combo Streak Indicator */}
            {isComboActive && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md shadow-orange-500/20 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{currentStreak}× STREAK!</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Combo Streak Indicator for Mobile */}
            {isComboActive && (
              <div className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-black animate-pulse">
                <Flame className="w-3 h-3 fill-current" />
                <span>{currentStreak}×</span>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onToggleSound();
              }}
              aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Restart Button */}
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onRestart();
              }}
              aria-label="Restart Game"
              title="Restart Board"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Pause Button */}
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onPause();
              }}
              aria-label="Pause Game"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95 transition shadow-sm"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">Pause</span>
            </button>
          </div>
        </div>

        {/* Dynamic Board Progress Bar */}
        <div className="w-full mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 font-mono">
            {progressPercent}%
          </span>
        </div>
      </div>
    </header>
  );
});

GameHeader.displayName = 'GameHeader';
