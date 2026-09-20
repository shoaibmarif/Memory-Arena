import React, { useEffect, useState } from 'react';
import type { Achievement } from '../types/game';
import { Sparkles } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400); // Allow exit transition
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl
        border-2 border-amber-400 dark:border-amber-500/80
        flex items-center gap-3.5 select-none
        transition-all duration-400 transform
        ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95'}
      `}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white text-2xl flex items-center justify-center shrink-0 shadow-md">
        {achievement.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Achievement Unlocked!
        </div>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate mt-0.5">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};
