import React from 'react';
import type { DifficultyConfig, ThemeId } from '../types/game';
import { DIFFICULTY_LIST } from '../game/difficulty';
import { THEMES } from '../data/themes';
import { getDailyChallengeInfo } from '../game/dailyChallenge';
import { Play, Calendar, Trophy, BarChart2, Settings as SettingsIcon, Brain } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface StartScreenProps {
  selectedDifficulty: DifficultyConfig;
  selectedTheme: ThemeId;
  bestScore: number;
  bestTime: number;
  onSelectDifficulty: (diff: DifficultyConfig) => void;
  onSelectTheme: (theme: ThemeId) => void;
  onStartGame: (mode: 'standard' | 'daily') => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  isDailyCompletedToday: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedDifficulty,
  selectedTheme,
  bestScore,
  bestTime,
  onSelectDifficulty,
  onSelectTheme,
  onStartGame,
  onOpenStats,
  onOpenAchievements,
  onOpenSettings,
  isDailyCompletedToday,
}) => {
  const daily = getDailyChallengeInfo();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center select-none">
      {/* Top utility nav */}
      <div className="w-full flex justify-end items-center gap-2 mb-4">
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenStats();
          }}
          aria-label="View Statistics"
          title="Statistics"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm flex items-center gap-1.5 text-xs font-semibold transition"
        >
          <BarChart2 className="w-4 h-4 text-indigo-500" />
          <span className="hidden sm:inline">Stats</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenAchievements();
          }}
          aria-label="View Achievements"
          title="Achievements"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm flex items-center gap-1.5 text-xs font-semibold transition"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Badges</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenSettings();
          }}
          aria-label="Open Settings"
          title="Settings"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm flex items-center gap-1.5 text-xs font-semibold transition"
        >
          <SettingsIcon className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Hero Badge & Title */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/20 mb-3 animate-pulse">
          <Brain className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          MEMORY MATCH
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Sharpen your focus & test your recall
        </p>
      </div>

      {/* Daily Challenge Card Promo */}
      <div className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-pink-950/30 border border-amber-300/40 dark:border-amber-600/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Daily Challenge
              </span>
              {isDailyCompletedToday && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Completed ✓
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {daily.formattedDate} • Medium Mode
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onStartGame('daily');
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          {isDailyCompletedToday ? 'Replay Daily' : 'Play Today’s Challenge'}
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="w-full bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none mb-6">
        {/* Difficulty Selection */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Select Difficulty
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIFFICULTY_LIST.map((diff) => {
              const isSelected = selectedDifficulty.id === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onSelectDifficulty(diff);
                  }}
                  className={`
                    flex flex-col items-center justify-center py-3 px-2 rounded-xl border font-semibold text-xs transition-all
                    ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }
                  `}
                >
                  <span className="text-sm font-bold">{diff.name}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {diff.rows}×{diff.cols} ({diff.pairs}p)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Card Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
              const theme = THEMES[themeKey];
              const isSelected = selectedTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onSelectTheme(themeKey);
                  }}
                  className={`
                    flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all
                    ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    }
                  `}
                >
                  <span className="text-base">{theme.icon}</span>
                  <span className="truncate">{theme.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Score & Time Stats for this difficulty */}
        <div className="flex items-center justify-around py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-6">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Score</span>
            <span className="font-mono font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
              {bestScore > 0 ? bestScore.toLocaleString() : '—'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Time</span>
            <span className="font-mono font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
              {bestTime > 0 ? `${Math.floor(bestTime / 60)}m ${bestTime % 60}s` : '—'}
            </span>
          </div>
        </div>

        {/* Big PLAY Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onStartGame('standard');
          }}
          className="
            w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
            hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500
            text-white font-extrabold text-lg sm:text-xl tracking-wide shadow-lg shadow-indigo-500/25
            flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all
          "
        >
          <Play className="w-5 h-5 fill-current" />
          PLAY NOW
        </button>
      </div>
    </div>
  );
};
