import React from 'react';
import { Pause, Volume2, VolumeX, RotateCcw, Home } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface GameHeaderProps {
  moves: number;
  formattedTime: string;
  matchedPairs: number;
  totalPairs: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  moves,
  formattedTime,
  matchedPairs,
  totalPairs,
  soundEnabled,
  onToggleSound,
  onPause,
  onRestart,
  onQuit,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-3 py-2 sm:py-3 mb-2">
      <div className="flex items-center justify-between gap-2 sm:gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 sm:px-5 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Title & Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onQuit();
            }}
            title="Return to Menu"
            aria-label="Return to Main Menu"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-lg sm:text-xl tracking-tight">
            MEMORY
          </span>
        </div>

        {/* Live Gameplay Metrics (Moves, Time, Pairs) */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
          {/* Moves */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 text-center sm:text-left">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs">Moves</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono text-sm sm:text-base font-bold">{moves}</span>
          </div>

          {/* Time */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 text-center sm:text-left">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs">Time</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm sm:text-base font-bold">{formattedTime}</span>
          </div>

          {/* Pairs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 text-center sm:text-left">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs">Pairs</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm sm:text-base font-bold">
              {matchedPairs} <span className="text-slate-400 text-xs font-normal">/ {totalPairs}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onRestart();
            }}
            aria-label="Restart Game"
            title="Restart"
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Pause */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onPause();
            }}
            aria-label="Pause Game"
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-medium text-xs sm:text-sm border border-indigo-200/50 dark:border-indigo-800/50 transition-colors"
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span className="hidden xs:inline">Pause</span>
          </button>
        </div>
      </div>
    </header>
  );
};
