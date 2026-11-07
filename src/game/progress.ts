import type { DeckId } from '../data/decks';
import { DECK_LIST } from '../data/decks';
import type { ArenaState, FinalScore, ModeId, SizeId } from './engine';

export interface GameRecord {
  at: string;
  mode: ModeId;
  size: SizeId;
  deck: DeckId;
  won: boolean;
  score: number;
  moves: number;
  time: number;
  stars: number;
  slips: number;
  bestCombo: number;
  peeks: number;
  livesLeft: number | null;
  timeLeft: number | null;
  /** Daily puzzle key (YYYY-MM-DD) for daily games. */
  day?: string;
}

export interface Best {
  score: number;
  time: number;
  moves: number;
}

export interface DailyEntry {
  score: number;
  moves: number;
  time: number;
  stars: number;
}

export interface Profile {
  xp: number;
  games: number;
  wins: number;
  pairs: number;
  best: Record<string, Best>;
  history: GameRecord[];
  achievements: Record<string, string>;
  decksWon: DeckId[];
  zenGames: number;
  daily: {
    results: Record<string, DailyEntry>;
    streak: number;
    bestStreak: number;
    lastWon: string | null;
  };
}

export const EMPTY_PROFILE: Profile = {
  xp: 0,
  games: 0,
  wins: 0,
  pairs: 0,
  best: {},
  history: [],
  achievements: {},
  decksWon: [],
  zenGames: 0,
  daily: { results: {}, streak: 0, bestStreak: 0, lastWon: null },
};

// ── Ranks ───────────────────────────────────────────────────────────────

export interface Rank {
  name: string;
  min: number;
  color: string;
  emblem: string;
}

export const RANKS: Rank[] = [
  { name: 'Rookie', min: 0, color: '#9aa4bf', emblem: '◇' },
  { name: 'Bronze', min: 5000, color: '#d08a4f', emblem: '◆' },
  { name: 'Silver', min: 20000, color: '#c3cbe0', emblem: '✦' },
  { name: 'Gold', min: 60000, color: '#ffc93c', emblem: '★' },
  { name: 'Platinum', min: 150000, color: '#5df2c3', emblem: '✶' },
  { name: 'Diamond', min: 350000, color: '#4fc3ff', emblem: '❖' },
  { name: 'Legend', min: 750000, color: '#ff4fa3', emblem: '♛' },
];

export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].min) i++;
  const rank = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  const progress = next ? (xp - rank.min) / (next.min - rank.min) : 1;
  return { rank, next, progress, index: i };
}

/** XP for a game: the score, or a flat amount per pair in unscored Zen. */
export function xpFor(r: GameRecord, pairsFound: number): number {
  if (r.mode === 'zen') return pairsFound * 20;
  return r.won ? r.score : Math.round(r.score / 2);
}

// ── Daily streaks ───────────────────────────────────────────────────────

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

/** The daily streak as it stands today: a missed day breaks it. */
export function liveDailyStreak(p: Profile, today: string = dayKey()): number {
  const last = p.daily.lastWon;
  if (!last) return 0;
  return last === today || last === previousDay(today) ? p.daily.streak : 0;
}

// ── Achievements ────────────────────────────────────────────────────────

export interface AchievementContext {
  profile: Profile;
  record: GameRecord;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  test: (c: AchievementContext) => boolean;
}

const won = (c: AchievementContext) => c.record.won;

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_match', title: 'First pair', description: 'Find your first matching pair.', icon: '🎯', test: (c) => c.profile.pairs > 0 },
  { id: 'first_win', title: 'Into the arena', description: 'Clear a board for the first time.', icon: '🏟️', test: won },
  { id: 'memory_master', title: 'Warm-up done', description: 'Clear a Small board.', icon: '🧠', test: (c) => won(c) && c.record.size === 'easy' },
  { id: 'medium_maestro', title: 'Middle weight', description: 'Clear a Medium board.', icon: '🥈', test: (c) => won(c) && c.record.size === 'medium' },
  { id: 'memory_prodigy', title: 'Heavy weight', description: 'Clear a Large 6 × 6 board.', icon: '🥇', test: (c) => won(c) && c.record.size === 'hard' },
  {
    id: 'expert_champion',
    title: 'All three belts',
    description: 'Clear Small, Medium and Large boards.',
    icon: '🏆',
    test: (c) => ['easy', 'medium', 'hard'].every((s) => c.profile.history.some((h) => h.won && h.size === s)),
  },
  { id: 'speed_runner', title: 'Quick hands', description: 'Clear a Small or bigger board in under 60 seconds.', icon: '⚡', test: (c) => won(c) && c.record.size !== 'mini' && c.record.time < 60 },
  { id: 'lightning_fast', title: 'Lightning', description: 'Clear a Small or bigger board in under 30 seconds.', icon: '⏱️', test: (c) => won(c) && c.record.size !== 'mini' && c.record.time < 30 },
  { id: 'perfect_memory', title: 'Clean sweep', description: 'Clear a board without a single slip.', icon: '🧼', test: (c) => won(c) && c.record.slips === 0 && c.record.size !== 'mini' },
  { id: 'streak_master', title: 'Combo king', description: 'Hit a ×5 combo.', icon: '💫', test: (c) => c.record.bestCombo >= 5 },
  { id: 'three_stars_large', title: 'Star player', description: 'Earn three stars on a Large board.', icon: '🌟', test: (c) => won(c) && c.record.size === 'hard' && c.record.stars === 3 },
  { id: 'no_peek_large', title: 'Eyes closed', description: 'Clear a Large board without peeking.', icon: '🙈', test: (c) => won(c) && c.record.size === 'hard' && c.record.peeks === 0 && c.record.mode !== 'zen' },
  { id: 'daily_victor', title: 'Daily visitor', description: 'Finish a Daily Arena.', icon: '📅', test: (c) => won(c) && c.record.mode === 'daily' },
  { id: 'daily_week', title: 'Seven days strong', description: 'Win the Daily Arena seven days in a row.', icon: '🗓️', test: (c) => c.profile.daily.streak >= 7 },
  { id: 'survivor', title: 'Untouchable', description: 'Win Survival without losing a heart.', icon: '💖', test: (c) => won(c) && c.record.mode === 'survival' && c.record.livesLeft === 3 },
  { id: 'time_lord', title: 'Time to spare', description: 'Finish Time Attack with 30 seconds or more on the clock.', icon: '⌛', test: (c) => won(c) && c.record.mode === 'time-attack' && (c.record.timeLeft ?? 0) >= 30 },
  { id: 'zen_master', title: 'Deep breath', description: 'Finish five Zen games.', icon: '🍵', test: (c) => c.profile.zenGames >= 5 },
  { id: 'all_decks', title: 'Collector', description: 'Clear a board with every deck.', icon: '🃏', test: (c) => DECK_LIST.every((d) => c.profile.decksWon.includes(d.id)) },
  { id: 'dedicated_10', title: 'Regular', description: 'Play 10 games.', icon: '🎮', test: (c) => c.profile.games >= 10 },
  { id: 'dedicated_50', title: 'Arena veteran', description: 'Play 50 games.', icon: '💯', test: (c) => c.profile.games >= 50 },
  { id: 'rank_gold', title: 'Golden', description: 'Reach Gold rank.', icon: '👑', test: (c) => c.profile.xp >= (RANKS.find((r) => r.name === 'Gold')?.min ?? Infinity) },
];

// ── Recording a finished game ───────────────────────────────────────────

export function makeRecord(s: ArenaState, score: FinalScore, day?: string): GameRecord {
  return {
    at: new Date().toISOString(),
    mode: s.mode,
    size: s.size,
    deck: s.deck,
    won: s.status === 'won',
    score: score.total,
    moves: s.moves,
    time: s.elapsed,
    stars: score.stars,
    slips: s.slips,
    bestCombo: s.bestCombo,
    peeks: s.peeksUsed,
    livesLeft: s.lives,
    timeLeft: s.timeLeft,
    day,
  };
}

export interface RecordOutcome {
  profile: Profile;
  xpGained: number;
  newBest: { score: boolean; time: boolean; moves: boolean };
  unlocked: AchievementDef[];
  rankUp: boolean;
}

/** Adds a finished game to the profile. Pure: returns a new profile. */
export function recordGame(prev: Profile, r: GameRecord, pairsFound: number): RecordOutcome {
  const xpGained = xpFor(r, pairsFound);
  const key = `${r.mode}:${r.size}`;
  const old = prev.best[key];
  const newBest = {
    score: r.won && r.mode !== 'zen' && (!old || r.score > old.score),
    time: r.won && (!old || r.time < old.time),
    moves: r.won && (!old || r.moves < old.moves),
  };
  const best = r.won
    ? {
        ...prev.best,
        [key]: {
          score: Math.max(old?.score ?? 0, r.score),
          time: old ? Math.min(old.time, r.time) : r.time,
          moves: old ? Math.min(old.moves, r.moves) : r.moves,
        },
      }
    : prev.best;

  let daily = prev.daily;
  if (r.mode === 'daily' && r.day && !prev.daily.results[r.day]) {
    const results = { ...prev.daily.results, [r.day]: { score: r.score, moves: r.moves, time: r.time, stars: r.stars } };
    if (r.won) {
      const streak = prev.daily.lastWon === previousDay(r.day) ? prev.daily.streak + 1 : 1;
      daily = { results, streak, bestStreak: Math.max(prev.daily.bestStreak, streak), lastWon: r.day };
    } else {
      daily = { ...prev.daily, results, streak: 0 };
    }
  }

  const profile: Profile = {
    ...prev,
    xp: prev.xp + xpGained,
    games: prev.games + 1,
    wins: prev.wins + (r.won ? 1 : 0),
    pairs: prev.pairs + pairsFound,
    best,
    history: [r, ...prev.history].slice(0, 40),
    decksWon: r.won && !prev.decksWon.includes(r.deck) ? [...prev.decksWon, r.deck] : prev.decksWon,
    zenGames: prev.zenGames + (r.mode === 'zen' && r.won ? 1 : 0),
    daily,
  };

  const unlocked = ACHIEVEMENTS.filter((a) => !profile.achievements[a.id] && a.test({ profile, record: r }));
  if (unlocked.length) {
    profile.achievements = { ...profile.achievements };
    for (const a of unlocked) profile.achievements[a.id] = r.at;
  }

  return { profile, xpGained, newBest, unlocked, rankUp: rankFor(profile.xp).index > rankFor(prev.xp).index };
}
