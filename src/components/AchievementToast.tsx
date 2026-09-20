import React, { useEffect, useState, useRef } from 'react';
import type { Achievement } from '../types/game';
import { Sparkles, X } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const handleDismiss = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
    exitTimerRef.current = window.setTimeout(() => {
      onDismiss();
    }, 300);
  };

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      timerRef.current = window.setTimeout(() => {
        handleDismiss();
      }, 4500);

      return () => {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (exitTimerRef.current !== null) {
          clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      };
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed top-4 sm:top-5 right-4 sm:right-5 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-full p-3.5 sm:p-4 rounded-2xl
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl
        border-2 border-amber-400/90 dark:border-amber-500/80
        flex items-center gap-3 select-none
        transition-all duration-300 transform
        ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95 pointer-events-none'}
      `}
    >
      {/* Icon */}
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white text-2xl flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
        {achievement.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Badge Unlocked!</span>
        </div>
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-0.5">
          {achievement.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
          {achievement.description}
        </p>
      </div>

      {/* Close / Dismiss Button */}
      <button
        onClick={() => {
          soundEngine.playButtonClick();
          handleDismiss();
        }}
        aria-label="Dismiss achievement"
        title="Dismiss"
        className="p-1.5 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
