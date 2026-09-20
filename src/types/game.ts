export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  rows: number;
  cols: number;
  pairs: number;
  gridColsClass: string;
  previewClass: string;
  timeTargetSeconds: number; // For score bonus calculation
  multiplier: number;
}

export type ThemeId = 'emoji' | 'food' | 'animals' | 'space' | 'random';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  symbols: string[];
}

export type GameMode = 'standard' | 'daily';

export interface Card {
  id: string; // Unique ID for each card on the board
  pairId: number; // Common ID shared by matching pair (e.g., 0 to pairs-1)
  symbol: string; // Emoji / icon displayed on card
  theme: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalMoves: number;
  totalPairsMatched: number;
  bestScores: Record<DifficultyLevel, number>;
  bestTimes: Record<DifficultyLevel, number>; // in seconds
  fewestMoves: Record<DifficultyLevel, number>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate?: string;
  dailyChallengeCompletions: Record<string, {
    score: number;
    time: number;
    moves: number;
    completedAt: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  themeMode: 'light' | 'dark' | 'system';
  cardTheme: ThemeId;
  reducedMotion: boolean;
}

export interface ScoreBreakdown {
  totalScore: number;
  baseScore: number;
  difficultyBonus: number;
  timeBonus: number;
  moveEfficiencyBonus: number;
  accuracy: number; // percentage (0 - 100)
  isNewBestScore: boolean;
  isNewBestTime: boolean;
}
