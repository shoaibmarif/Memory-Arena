import type { DifficultyConfig, ScoreBreakdown } from '../types/game';

interface CalculateScoreParams {
  difficulty: DifficultyConfig;
  moves: number;
  timeSeconds: number;
  consecutiveStreakMax: number;
  currentBestScore: number;
  currentBestTime: number;
}

/**
 * Calculates game score with predictable, rewarding logic:
 * - Base points for pairs matched * difficulty multiplier
 * - Move efficiency: compares actual moves to theoretical minimum (pairs count)
 * - Time bonus: rewards finishing faster than target time
 * - Streak bonus: reward for consecutive matches without mistakes
 */
export function calculateScore({
  difficulty,
  moves,
  timeSeconds,
  consecutiveStreakMax,
  currentBestScore,
  currentBestTime,
}: CalculateScoreParams): ScoreBreakdown {
  const minMoves = difficulty.pairs; // Theoretical minimum moves
  const actualMoves = Math.max(moves, minMoves);

  // Accuracy: minMoves / actualMoves * 100
  const accuracy = Math.min(100, Math.round((minMoves / actualMoves) * 100));

  // 1. Base score: 100 points per pair
  const baseScore = difficulty.pairs * 100;

  // 2. Difficulty multiplier bonus
  const difficultyBonus = Math.round(baseScore * (difficulty.multiplier - 1));

  // 3. Time bonus: max(0, TargetTime - ActualTime) * 15 * multiplier
  const targetTime = difficulty.timeTargetSeconds;
  const timeSaved = Math.max(0, targetTime - timeSeconds);
  const timeBonus = Math.round(timeSaved * 12 * difficulty.multiplier);

  // 4. Move efficiency bonus:
  // If player did theoretical minimum moves, max bonus!
  // Move penalty applies when moves exceed minimum
  const extraMoves = Math.max(0, actualMoves - minMoves);
  const maxEfficiencyBonus = Math.round(500 * difficulty.multiplier);
  const movePenalty = extraMoves * 15;
  const moveEfficiencyBonus = Math.max(0, maxEfficiencyBonus - movePenalty);

  // 5. Streak multiplier bonus
  const streakBonus = Math.round(consecutiveStreakMax * 35 * difficulty.multiplier);

  // Total score
  const totalScore = Math.max(50, baseScore + difficultyBonus + timeBonus + moveEfficiencyBonus + streakBonus);

  const isNewBestScore = currentBestScore === 0 || totalScore > currentBestScore;
  const isNewBestTime = currentBestTime === 0 || timeSeconds < currentBestTime;

  return {
    totalScore,
    baseScore,
    difficultyBonus,
    timeBonus,
    moveEfficiencyBonus: moveEfficiencyBonus + streakBonus,
    accuracy,
    isNewBestScore,
    isNewBestTime,
  };
}
