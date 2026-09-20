import type { DifficultyLevel, ThemeId } from '../types/game';
import { hashStringToSeed } from '../utils/random';

export interface DailyChallengeInfo {
  dateString: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "September 19, 2026"
  difficulty: DifficultyLevel;
  themeId: ThemeId;
  seed: number;
}

const THEME_ROTATION: ThemeId[] = ['emoji', 'food', 'animals', 'space'];

/**
 * Returns formatted date and deterministic parameters for today's daily challenge.
 */
export function getDailyChallengeInfo(customDate?: Date): DailyChallengeInfo {
  const d = customDate || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const formattedDate = d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const seed = hashStringToSeed(`memory-daily-${dateString}`);

  // Deterministically pick a theme based on the date
  const dayOfYear = Math.floor((d.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const themeId = THEME_ROTATION[dayOfYear % THEME_ROTATION.length];

  return {
    dateString,
    formattedDate,
    difficulty: 'medium', // Medium provides the sweet spot for a daily challenge
    themeId,
    seed,
  };
}
