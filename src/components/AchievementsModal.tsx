import React, { useState } from 'react';
import type { Achievement } from '../types/game';
import { X, Trophy, Lock, CheckCircle2, Trash2 } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { resetAchievements } from '../utils/storage';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onResetAchievements?: () => void;
}

type FilterTab = 'all' | 'unlocked' | 'locked';

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onResetAchievements,
}) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;
  const lockedCount = achievements.length - unlockedCount;
  const progressPercent = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0;

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return Boolean(a.unlockedAt);
    if (filter === 'locked') return !a.unlockedAt;
    return true;
  });

  const handleReset = () => {
    resetAchievements();
    onResetAchievements?.();
    setShowConfirmReset(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 id="achievements-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
              Badges & Achievements
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            aria-label="Close Achievements"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Summary */}
        <div className="my-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/40">
          <div className="flex justify-between items-center text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
            <span>Badge Collection</span>
            <span>{unlockedCount} / {achievements.length} Unlocked ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-amber-200 dark:bg-amber-900/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`
              py-1.5 rounded-lg text-xs font-bold transition-all
              ${filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            All ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`
              py-1.5 rounded-lg text-xs font-bold transition-all
              ${filter === 'unlocked'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`
              py-1.5 rounded-lg text-xs font-bold transition-all
              ${filter === 'locked'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            Locked ({lockedCount})
          </button>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
          {filteredAchievements.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No badges match the selected filter.
            </div>
          ) : (
            filteredAchievements.map((achievement) => {
              const isUnlocked = Boolean(achievement.unlockedAt);
              return (
                <div
                  key={achievement.id}
                  className={`
                    p-3 rounded-2xl border flex items-center gap-3.5 transition-all
                    ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-800/90 border-amber-300/80 dark:border-amber-700/60 shadow-sm'
                        : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/50 opacity-70'
                    }
                  `}
                >
                  {/* Badge Icon */}
                  <div
                    className={`
                      w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-inner relative
                      ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-amber-500/20 shadow'
                          : 'bg-slate-200 dark:bg-slate-700/70 text-slate-400'
                      }
                    `}
                  >
                    {achievement.icon}
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-600 dark:bg-slate-600 rounded-full flex items-center justify-center text-white shadow">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {achievement.title}
                      </h3>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      {achievement.description}
                    </p>
                    {isUnlocked && achievement.unlockedAt ? (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
                        🔒 Not yet unlocked
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Reset Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
          {showConfirmReset ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-red-500 font-semibold">Reset badges?</span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Badges</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
