import React, { useState } from 'react';
import type { GameStats, DifficultyLevel } from '../types/game';
import { X, Trophy, Flame, Award, Trash2 } from 'lucide-react';
import { formatTime } from '../hooks/useTimer';
import { soundEngine } from '../utils/sound';
import { resetStatistics } from '../utils/storage';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onReset: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onReset,
}) => {
  const [selectedTab, setSelectedTab] = useState<DifficultyLevel>('easy');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesCompleted / stats.gamesPlayed) * 100)
    : 0;

  const handleReset = () => {
    resetStatistics();
    onReset();
    setShowConfirmReset(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            <h2 id="stats-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
              Your Statistics
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            aria-label="Close Statistics"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Played</span>
            <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {stats.gamesPlayed}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Won</span>
            <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {stats.gamesCompleted}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Win Rate</span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {winRate}%
            </span>
          </div>
        </div>

        {/* Streaks & Pairs */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Flame className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Win Streak
              </span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {stats.currentStreak} <span className="text-xs text-slate-400 font-normal">(Max: {stats.longestStreak})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Award className="w-6 h-6 text-indigo-500 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Total Pairs
              </span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {stats.totalPairsMatched}
              </span>
            </div>
          </div>
        </div>

        {/* Tabbed Records by Difficulty */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Records by Difficulty
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedTab(level)}
                className={`
                  py-1.5 rounded-lg text-xs font-bold capitalize transition-all
                  ${
                    selectedTab === level
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Best Score</span>
              <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                {stats.bestScores[selectedTab] > 0 ? stats.bestScores[selectedTab].toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Best Time</span>
              <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                {stats.bestTimes[selectedTab] > 0 ? formatTime(stats.bestTimes[selectedTab]) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Fewest Moves</span>
              <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                {stats.fewestMoves[selectedTab] > 0 ? stats.fewestMoves[selectedTab] : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Reset Action */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 font-semibold">Reset all stats?</span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
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
              Reset Statistics
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
