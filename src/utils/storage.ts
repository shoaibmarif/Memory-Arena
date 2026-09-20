import type { GameSettings, GameStats, Achievement } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const STATS_KEY = 'memory_game_statistics_v1';
const SETTINGS_KEY = 'memory_game_settings_v1';
const ACHIEVEMENTS_KEY = 'memory_game_achievements_v1';

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  totalMoves: 0,
  totalPairsMatched: 0,
  bestScores: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  bestTimes: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  fewestMoves: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  currentStreak: 0,
  longestStreak: 0,
  dailyChallengeCompletions: {},
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  themeMode: 'system',
  cardTheme: 'emoji',
  reducedMotion: false,
};

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...fallback, ...parsed };
    }
    return fallback;
  } catch (error) {
    console.warn(`[Storage] Failed to read ${key} from localStorage, resetting to default.`, error);
    return fallback;
  }
}

/**
 * Safely save JSON to localStorage
 */
function safeSetItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`[Storage] Failed to write ${key} to localStorage:`, error);
  }
}

// Statistics helpers
export function getStatistics(): GameStats {
  const stats = safeGetItem<GameStats>(STATS_KEY, DEFAULT_STATS);
  // Ensure bestScores, bestTimes, fewestMoves have all required difficulty keys
  return {
    ...stats,
    bestScores: {
      easy: stats.bestScores?.easy || 0,
      medium: stats.bestScores?.medium || 0,
      hard: stats.bestScores?.hard || 0,
    },
    bestTimes: {
      easy: stats.bestTimes?.easy || 0,
      medium: stats.bestTimes?.medium || 0,
      hard: stats.bestTimes?.hard || 0,
    },
    fewestMoves: {
      easy: stats.fewestMoves?.easy || 0,
      medium: stats.fewestMoves?.medium || 0,
      hard: stats.fewestMoves?.hard || 0,
    },
    dailyChallengeCompletions: stats.dailyChallengeCompletions || {},
  };
}

export function saveStatistics(stats: GameStats): void {
  safeSetItem(STATS_KEY, stats);
}

export function resetStatistics(): void {
  safeSetItem(STATS_KEY, DEFAULT_STATS);
}

// Settings helpers
export function getSettings(): GameSettings {
  return safeGetItem<GameSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: GameSettings): void {
  safeSetItem(SETTINGS_KEY, settings);
}

// Achievements helpers
export function getAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    const parsed: Achievement[] = raw ? JSON.parse(raw) : [];
    const validParsed = Array.isArray(parsed) ? parsed : [];

    // Return fresh copies to prevent accidental in-memory object mutation
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const existing = validParsed.find(a => a.id === initial.id);
      return {
        id: initial.id,
        title: initial.title,
        description: initial.description,
        icon: initial.icon,
        unlockedAt: existing?.unlockedAt || undefined,
      };
    });
  } catch (e) {
    console.warn('[Storage] Failed to read achievements, resetting.', e);
    return INITIAL_ACHIEVEMENTS.map(initial => ({ ...initial }));
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  safeSetItem(ACHIEVEMENTS_KEY, achievements);
}

export function resetAchievements(): void {
  try {
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch (e) {
    console.warn('[Storage] Failed to reset achievements:', e);
  }
}

/**
 * Synchronizes and backfills any earned achievements based on accumulated statistics.
 * Ensures badges states are always strictly accurate even if earned previously.
 */
export function syncAchievementsWithStats(achievements: Achievement[], stats: GameStats): {
  updatedAchievements: Achievement[];
  newlyUnlocked: Achievement[];
} {
  const newlyUnlocked: Achievement[] = [];
  const nowStr = new Date().toISOString();

  const updatedAchievements = achievements.map(ach => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let shouldUnlock = false;

    // Check individual criteria against persistent stats
    switch (ach.id) {
      case 'first_match':
        shouldUnlock = stats.totalPairsMatched > 0;
        break;
      case 'memory_master':
        shouldUnlock = Boolean(stats.bestScores.easy && stats.bestScores.easy > 0);
        break;
      case 'medium_maestro':
        shouldUnlock = Boolean(stats.bestScores.medium && stats.bestScores.medium > 0);
        break;
      case 'memory_prodigy':
        shouldUnlock = Boolean(stats.bestScores.hard && stats.bestScores.hard > 0);
        break;
      case 'expert_champion':
        shouldUnlock =
          Boolean(stats.bestScores.easy && stats.bestScores.easy > 0) &&
          Boolean(stats.bestScores.medium && stats.bestScores.medium > 0) &&
          Boolean(stats.bestScores.hard && stats.bestScores.hard > 0);
        break;
      case 'speed_runner':
        shouldUnlock =
          (stats.bestTimes.easy > 0 && stats.bestTimes.easy < 60) ||
          (stats.bestTimes.medium > 0 && stats.bestTimes.medium < 60) ||
          (stats.bestTimes.hard > 0 && stats.bestTimes.hard < 60);
        break;
      case 'lightning_fast':
        shouldUnlock =
          (stats.bestTimes.easy > 0 && stats.bestTimes.easy < 30) ||
          (stats.bestTimes.medium > 0 && stats.bestTimes.medium < 30) ||
          (stats.bestTimes.hard > 0 && stats.bestTimes.hard < 30);
        break;
      case 'daily_victor':
        shouldUnlock = Object.keys(stats.dailyChallengeCompletions || {}).length > 0;
        break;
      case 'dedicated_10':
        shouldUnlock = stats.gamesCompleted >= 10 || stats.gamesPlayed >= 10;
        break;
      case 'dedicated_50':
        shouldUnlock = stats.gamesCompleted >= 50 || stats.gamesPlayed >= 50;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlockedItem = { ...ach, unlockedAt: nowStr };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return ach;
  });

  if (newlyUnlocked.length > 0) {
    saveAchievements(updatedAchievements);
  }

  return { updatedAchievements, newlyUnlocked };
}
