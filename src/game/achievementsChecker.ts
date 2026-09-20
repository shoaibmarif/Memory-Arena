import type { Achievement, DifficultyLevel, GameMode, GameStats } from '../types/game';

interface CheckAchievementsParams {
  currentAchievements: Achievement[];
  event: 'card_match' | 'game_complete';
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  moves: number;
  timeSeconds: number;
  pairsCount: number;
  consecutiveStreakMax: number;
  stats: GameStats;
}

/**
 * Checks all achievement conditions against the latest game state and statistics.
 * Returns an array of newly unlocked achievements (if any).
 */
export function checkAchievements({
  currentAchievements,
  event,
  gameMode,
  difficulty,
  moves,
  timeSeconds,
  pairsCount,
  consecutiveStreakMax,
  stats,
}: CheckAchievementsParams): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const nowStr = new Date().toISOString();

  // Helper to mark unlocked
  const unlock = (id: string) => {
    const existing = currentAchievements.find(a => a.id === id);
    if (existing && !existing.unlockedAt) {
      existing.unlockedAt = nowStr;
      newlyUnlocked.push(existing);
    }
  };

  if (event === 'card_match') {
    // 1. First Match
    unlock('first_match');

    // 2. Combo King (4 in a row)
    if (consecutiveStreakMax >= 4) {
      unlock('streak_master');
    }
  }

  if (event === 'game_complete') {
    // Difficulty completions
    if (difficulty === 'easy') unlock('memory_master');
    if (difficulty === 'medium') unlock('medium_maestro');
    if (difficulty === 'hard') unlock('memory_prodigy');

    // Grand Champion: Complete games across all 3 difficulties (Easy, Medium, Hard)
    const wonEasy = difficulty === 'easy' || Boolean(stats.bestScores.easy && stats.bestScores.easy > 0);
    const wonMedium = difficulty === 'medium' || Boolean(stats.bestScores.medium && stats.bestScores.medium > 0);
    const wonHard = difficulty === 'hard' || Boolean(stats.bestScores.hard && stats.bestScores.hard > 0);
    if (wonEasy && wonMedium && wonHard) {
      unlock('expert_champion');
    }

    // Speed Runner (under 60s)
    if (timeSeconds < 60) {
      unlock('speed_runner');
    }

    // Lightning Fast (under 30s)
    if (timeSeconds < 30) {
      unlock('lightning_fast');
    }

    // Perfect Memory (moves === pairsCount, zero mismatches)
    if (moves === pairsCount) {
      unlock('perfect_memory');
    }

    // Daily Challenge completion
    if (gameMode === 'daily') {
      unlock('daily_victor');
    }

    // Games played thresholds
    if (stats.gamesCompleted >= 10 || stats.gamesPlayed >= 10) {
      unlock('dedicated_10');
    }
    if (stats.gamesCompleted >= 50 || stats.gamesPlayed >= 50) {
      unlock('dedicated_50');
    }
  }

  return newlyUnlocked;
}
