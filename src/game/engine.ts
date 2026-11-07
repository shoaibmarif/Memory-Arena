/**
 * The whole game as a pure state machine. The React hook (useArena) only adds
 * timers on top, which keeps the rules easy to read and easy to test.
 */
import { createMulberry32, seededShuffle, shuffle } from '../utils/random';
import { DECKS, type DeckId } from '../data/decks';

export type ModeId = 'classic' | 'daily' | 'zen' | 'time-attack' | 'survival';
export type SizeId = 'mini' | 'easy' | 'medium' | 'hard';

export interface BoardSize {
  id: SizeId;
  label: string;
  cols: number;
  rows: number;
  pairs: number;
  /** Seconds that earn a time bonus, and the starting clock in Time Attack. */
  par: number;
}

export const SIZES: Record<SizeId, BoardSize> = {
  mini: { id: 'mini', label: 'Mini', cols: 4, rows: 3, pairs: 6, par: 30 },
  easy: { id: 'easy', label: 'Small', cols: 4, rows: 4, pairs: 8, par: 45 },
  medium: { id: 'medium', label: 'Medium', cols: 5, rows: 4, pairs: 10, par: 70 },
  hard: { id: 'hard', label: 'Large', cols: 6, rows: 6, pairs: 18, par: 150 },
};

export const PLAYABLE_SIZES: SizeId[] = ['easy', 'medium', 'hard'];

export interface ModeRules {
  id: ModeId;
  /** Show and keep score. */
  scored: boolean;
  /** Countdown clock (seconds at start = board par). */
  countdown: boolean;
  /** Seconds added to the clock for each pair found in Time Attack. */
  bonusSeconds: number;
  /** Lives in Survival, null elsewhere. */
  lives: number | null;
  /** Peek power-ups at the start of a game (Infinity for Zen). */
  peeks: number;
  /** Cards shown face up for this long before play starts (ms). */
  preview: number;
}

export const MODES: Record<ModeId, ModeRules> = {
  classic: { id: 'classic', scored: true, countdown: false, bonusSeconds: 0, lives: null, peeks: 1, preview: 0 },
  daily: { id: 'daily', scored: true, countdown: false, bonusSeconds: 0, lives: null, peeks: 1, preview: 0 },
  zen: { id: 'zen', scored: false, countdown: false, bonusSeconds: 0, lives: null, peeks: Infinity, preview: 0 },
  'time-attack': { id: 'time-attack', scored: true, countdown: true, bonusSeconds: 4, lives: null, peeks: 0, preview: 0 },
  survival: { id: 'survival', scored: true, countdown: false, bonusSeconds: 0, lives: 3, peeks: 0, preview: 2500 },
};

export const POINTS_PER_PAIR = 100;
export const MAX_COMBO = 5;
export const PEEK_COST = 150;
export const PEEK_MS = 1200;
export const MISMATCH_MS = 850;

export interface Card {
  id: string;
  pairId: number;
  symbol: string;
  faceUp: boolean;
  matched: boolean;
  /** How many times this card was turned over. Feeds the results heatmap. */
  flips: number;
  /** The player has seen this card's face before. */
  seen: boolean;
}

export type Status = 'ready' | 'preview' | 'playing' | 'paused' | 'won' | 'lost';

export interface ArenaEvent {
  kind: 'match' | 'miss' | 'slip';
  points: number;
  combo: number;
  /** Increments every event so the UI can animate repeat events. */
  seq: number;
}

export interface ArenaState {
  mode: ModeId;
  size: SizeId;
  deck: DeckId;
  cards: Card[];
  /** Indices of face-up, unmatched cards (0, 1 or 2). */
  open: number[];
  moves: number;
  misses: number;
  /** Mismatches involving a card the player had already seen. */
  slips: number;
  combo: number;
  bestCombo: number;
  points: number;
  peeksLeft: number;
  peeksUsed: number;
  peeking: boolean;
  lives: number | null;
  /** Seconds left in Time Attack, otherwise null. */
  timeLeft: number | null;
  elapsed: number;
  status: Status;
  event: ArenaEvent | null;
}

export interface NewGameOptions {
  mode: ModeId;
  size: SizeId;
  deck: DeckId;
  seed?: number;
}

/** Builds a shuffled board where every symbol appears exactly twice. */
export function buildCards(pairs: number, deck: DeckId, seed?: number): Card[] {
  const pool = [...new Set(DECKS[deck].symbols)];
  if (pool.length < pairs) throw new Error(`Deck ${deck} has only ${pool.length} symbols, needs ${pairs}`);
  const rand = seed === undefined ? undefined : createMulberry32(seed);
  const pick = rand ? seededShuffle(pool, rand) : shuffle(pool);
  const cards: Card[] = pick.slice(0, pairs).flatMap((symbol, pairId) =>
    (['a', 'b'] as const).map((side) => ({
      id: `${pairId}${side}`,
      pairId,
      symbol,
      faceUp: false,
      matched: false,
      flips: 0,
      seen: false,
    }))
  );
  return rand ? seededShuffle(cards, rand) : shuffle(cards);
}

export function newGame({ mode, size, deck, seed }: NewGameOptions): ArenaState {
  const rules = MODES[mode];
  const board = SIZES[size];
  return {
    mode,
    size,
    deck,
    cards: buildCards(board.pairs, deck, seed),
    open: [],
    moves: 0,
    misses: 0,
    slips: 0,
    combo: 0,
    bestCombo: 0,
    points: 0,
    peeksLeft: rules.peeks,
    peeksUsed: 0,
    peeking: false,
    lives: rules.lives,
    timeLeft: rules.countdown ? board.par : null,
    elapsed: 0,
    status: rules.preview > 0 ? 'preview' : 'ready',
    event: null,
  };
}

const canPlay = (s: ArenaState) => (s.status === 'ready' || s.status === 'playing') && !s.peeking;

/** Turn a card over. Returns the same state object when the click is ignored. */
export function flip(state: ArenaState, index: number): ArenaState {
  if (!canPlay(state)) return state;
  const target = state.cards[index];
  if (!target || target.faceUp || target.matched) return state;
  // Tapping a third card closes a mismatched pair straight away, so fast players never wait.
  const s = state.open.length === 2 ? hideMismatch(state) : state;
  const card = s.cards[index];

  const cards = s.cards.slice();
  cards[index] = { ...card, faceUp: true, flips: card.flips + 1 };
  const open = [...s.open, index];
  const base: ArenaState = { ...s, cards, open, status: 'playing' };
  if (open.length < 2) return base;

  // Second card of the turn.
  const [a, b] = open;
  const first = cards[a];
  const second = cards[b];
  const moves = s.moves + 1;
  const seq = (s.event?.seq ?? 0) + 1;

  if (first.pairId === second.pairId) {
    const combo = Math.min(MAX_COMBO, s.combo + 1);
    const gained = MODES[s.mode].scored ? POINTS_PER_PAIR * combo : 0;
    cards[a] = { ...first, matched: true, seen: true };
    cards[b] = { ...second, matched: true, seen: true };
    const done = cards.every((c) => c.matched);
    const rules = MODES[s.mode];
    return {
      ...base,
      cards,
      open: [],
      moves,
      combo,
      bestCombo: Math.max(s.bestCombo, combo),
      points: s.points + gained,
      timeLeft: s.timeLeft === null ? null : s.timeLeft + rules.bonusSeconds,
      status: done ? 'won' : 'playing',
      event: { kind: 'match', points: gained, combo, seq },
    };
  }

  // A mismatch is a "slip" when the player had the information and didn't use it:
  // the second card was one they'd already seen, or they had already seen where
  // the first card's partner was. Turning over unknown cards is never a slip.
  const partnerKnown = s.cards.some((c, i) => i !== a && c.pairId === first.pairId && c.seen && !c.matched);
  const slip = second.seen || partnerKnown;
  const lives = s.lives === null ? null : slip ? s.lives - 1 : s.lives;
  return {
    ...base,
    cards,
    moves,
    misses: s.misses + 1,
    slips: s.slips + (slip ? 1 : 0),
    combo: 0,
    lives,
    status: lives !== null && lives <= 0 ? 'lost' : 'playing',
    event: { kind: slip ? 'slip' : 'miss', points: 0, combo: 0, seq },
  };
}

/** Turns an unmatched pair face down again after the player has had a look. */
export function hideMismatch(s: ArenaState): ArenaState {
  if (s.open.length < 2) return s;
  const cards = s.cards.slice();
  for (const i of s.open) cards[i] = { ...cards[i], faceUp: false, seen: true };
  return { ...s, cards, open: [] };
}

/** One second passes. Ends Time Attack when the clock runs out. */
export function tick(s: ArenaState): ArenaState {
  if (s.status !== 'playing' || s.peeking) return s;
  const elapsed = s.elapsed + 1;
  if (s.timeLeft === null) return { ...s, elapsed };
  const timeLeft = Math.max(0, s.timeLeft - 1);
  return { ...s, elapsed, timeLeft, status: timeLeft === 0 ? 'lost' : s.status };
}

export function startPeek(s: ArenaState): ArenaState {
  if (!canPlay(s) || s.peeksLeft <= 0 || s.open.length === 2) return s;
  const cost = MODES[s.mode].scored ? PEEK_COST : 0;
  return {
    ...s,
    peeking: true,
    peeksLeft: s.peeksLeft - 1,
    peeksUsed: s.peeksUsed + 1,
    points: Math.max(0, s.points - cost),
    // Everything face down gets "seen" during a peek.
    cards: s.cards.map((c) => ({ ...c, seen: true })),
  };
}

export function endPeek(s: ArenaState): ArenaState {
  return s.peeking ? { ...s, peeking: false } : s;
}

/** Survival shows the whole board once at the start. */
export function endPreview(s: ArenaState): ArenaState {
  return s.status === 'preview' ? { ...s, status: 'ready', cards: s.cards.map((c) => ({ ...c, seen: true })) } : s;
}

export function pause(s: ArenaState): ArenaState {
  return s.status === 'playing' ? { ...s, status: 'paused' } : s;
}

export function resume(s: ArenaState): ArenaState {
  return s.status === 'paused' ? { ...s, status: 'playing' } : s;
}

/** Is this card showing its face right now? */
export const isShowing = (s: ArenaState, c: Card) => c.faceUp || c.matched || s.peeking || s.status === 'preview';

export interface FinalScore {
  pairs: number;
  matchPoints: number;
  timeBonus: number;
  /** Bonus for a clean game with no slips. */
  cleanBonus: number;
  total: number;
  /** 1 to 3, from moves compared with what a perfect memory would need. */
  stars: 1 | 2 | 3;
  accuracy: number;
}

/**
 * Someone with a perfect memory, flipping unknown cards at random, needs about
 * 1.61 moves per pair on average (Velleman and Warrington, 2013). Stars compare
 * your moves with that.
 */
export const PERFECT_MOVES_PER_PAIR = 1.61;

export function starsFor(moves: number, pairs: number): 1 | 2 | 3 {
  const ratio = moves / pairs;
  if (ratio <= 1.75) return 3;
  if (ratio <= 2.4) return 2;
  return 1;
}

export function finalScore(s: ArenaState): FinalScore {
  const board = SIZES[s.size];
  const rules = MODES[s.mode];
  const pairs = s.cards.filter((c) => c.matched).length / 2;
  const won = s.status === 'won';
  const timeBonus = rules.scored && won ? (rules.countdown ? (s.timeLeft ?? 0) * 10 : Math.max(0, board.par - s.elapsed) * 5) : 0;
  const cleanBonus = rules.scored && won && s.slips === 0 ? 50 * board.pairs : 0;
  return {
    pairs,
    matchPoints: s.points,
    timeBonus,
    cleanBonus,
    total: rules.scored ? s.points + timeBonus + cleanBonus : 0,
    stars: won ? starsFor(s.moves, board.pairs) : 1,
    accuracy: s.moves === 0 ? 0 : Math.round((pairs / s.moves) * 100),
  };
}
