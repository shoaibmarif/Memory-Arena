import React, { useEffect } from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
}) => {
  // Support Escape to resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        <h2 id="pause-title" className="text-2xl font-black text-slate-900 dark:text-white tracking-wider mb-2">
          GAME PAUSED
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
          Take a breath, cards are safe and sound.
        </p>

        <div className="flex flex-col gap-3">
          {/* Resume */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            RESUME GAME
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART
          </button>

          {/* Quit */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onQuit();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Home className="w-4 h-4" />
            QUIT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
