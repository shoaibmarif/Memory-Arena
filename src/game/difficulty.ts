import type { DifficultyConfig, DifficultyLevel } from '../types/game';

export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    rows: 4,
    cols: 4,
    pairs: 8,
    gridColsClass: 'grid-cols-4',
    previewClass: '4 × 4 (8 pairs)',
    timeTargetSeconds: 45,
    multiplier: 1.0,
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    rows: 5,
    cols: 4,
    pairs: 10,
    gridColsClass: 'grid-cols-4 sm:grid-cols-5',
    previewClass: '4 × 5 (10 pairs)',
    timeTargetSeconds: 70,
    multiplier: 1.5,
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    rows: 6,
    cols: 6,
    pairs: 18,
    gridColsClass: 'grid-cols-6',
    previewClass: '6 × 6 (18 pairs)',
    timeTargetSeconds: 150,
    multiplier: 2.2,
  },
};

export const DIFFICULTY_LIST: DifficultyConfig[] = [
  DIFFICULTIES.easy,
  DIFFICULTIES.medium,
  DIFFICULTIES.hard,
];
