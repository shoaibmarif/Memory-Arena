import { hashStringToSeed } from '../utils/random';
import type { DeckId } from '../data/decks';
import { dayKey } from './progress';

/** Arena #1 was the day the new site launched. */
const LAUNCH = Date.UTC(2026, 10, 7);
const ROTATION: DeckId[] = ['animals', 'food', 'space', 'smileys', 'sports', 'nature', 'mixed'];

export interface DailyArena {
  key: string;
  number: number;
  seed: number;
  deck: DeckId;
}

/** Today's puzzle: the same board, in the same order, for everyone on the same date. */
export function dailyArena(date: Date = new Date()): DailyArena {
  const key = dayKey(date);
  const number = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - LAUNCH) / 86_400_000) + 1;
  const deck = ROTATION[(((number - 1) % ROTATION.length) + ROTATION.length) % ROTATION.length];
  return { key, number, seed: hashStringToSeed(`memory-arena-${key}`), deck };
}

export function msUntilTomorrow(now: Date = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function formatCountdown(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60].map((n) => String(n).padStart(2, '0')).join(':');
}
