import React, { useState } from 'react';
import type { ScoreBreakdown, DifficultyConfig } from '../types/game';
import { RotateCcw, Share2, BarChart2, Check, ArrowRight, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { shareScore } from '../utils/share';
import { formatTime } from '../hooks/useTimer';
import { ConfettiCanvas } from './ConfettiCanvas';

interface ResultsScreenProps {
  scoreBreakdown: ScoreBreakdown;
  moves: number;
  timeSeconds: number;
  difficulty: DifficultyConfig;
  bestScore: number;
  bestTime: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onOpenStats: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  scoreBreakdown,
  moves,
  timeSeconds,
  difficulty,
  bestScore,
  bestTime,
  onPlayAgain,
  onChangeDifficulty,
  onOpenStats,
}) => {
  const [shareToast, setShareToast] = useState<string | null>(null);

  const formattedTime = formatTime(timeSeconds);
  const formattedBestTime = bestTime > 0 ? formatTime(bestTime) : '—';

  const handleShare = async () => {
    soundEngine.playButtonClick();
    const result = await shareScore({
      score: scoreBreakdown.totalScore,
      timeFormatted: formattedTime,
      moves,
      difficultyName: difficulty.name,
    });

    if (result.shared) {
      setShareToast(
        result.method === 'web-share' ? 'Shared successfully!' : 'Copied score to clipboard!'
      );
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  return (
    <>
      <ConfettiCanvas />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-heading"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none overflow-y-auto animate-fade-in"
      >
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative my-auto">
          {/* New Record Banner if record broken */}
          {(scoreBreakdown.isNewBestScore || scoreBreakdown.isNewBestTime) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider mb-4 shadow-md animate-bounce">
              <Trophy className="w-3.5 h-3.5" />
              {scoreBreakdown.isNewBestScore ? '🏆 NEW BEST SCORE!' : '⚡ NEW BEST TIME!'}
            </div>
          )}

          <h2 id="results-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            GREAT JOB!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">
            You matched all {difficulty.pairs} pairs on {difficulty.name} mode!
          </p>

          {/* Big Score Display */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 rounded-2xl p-4 sm:p-5 border border-indigo-100 dark:border-indigo-900/60 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Total Score
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-indigo-600 dark:text-indigo-300 mt-0.5 tracking-tight">
              {scoreBreakdown.totalScore.toLocaleString()}
            </div>
            {/* Score Factors Breakdown */}
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Base: {scoreBreakdown.baseScore}</span>
              <span>•</span>
              <span>Time: +{scoreBreakdown.timeBonus}</span>
              <span>•</span>
              <span>Efficiency: +{scoreBreakdown.moveEfficiencyBonus}</span>
            </div>
          </div>

          {/* Key Game Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
              <span className="font-mono font-bold text-base text-slate-800 dark:text-slate-200">
                {formattedTime}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Moves</span>
              <span className="font-mono font-bold text-base text-slate-800 dark:text-slate-200">
                {moves}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                {scoreBreakdown.accuracy}%
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Time</span>
              <span className="font-mono font-bold text-base text-slate-800 dark:text-slate-200">
                {formattedBestTime}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 mb-5">
            Previous Best Score: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{bestScore > 0 ? bestScore.toLocaleString() : 'None'}</span>
          </div>

          {/* Share Notification Toast */}
          {shareToast && (
            <div className="mb-4 py-2 px-3 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 animate-fade-in shadow-md">
              <Check className="w-4 h-4 stroke-[3]" />
              {shareToast}
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onPlayAgain();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <RotateCcw className="w-4 h-4" />
              PLAY AGAIN
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                SHARE SCORE
              </button>

              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onOpenStats();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                STATISTICS
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onChangeDifficulty();
              }}
              className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1 transition"
            >
              Change Difficulty
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
