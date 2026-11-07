import { describe, it, expect } from 'vitest';
import {
  MODES,
  SIZES,
  buildCards,
  endPeek,
  endPreview,
  finalScore,
  flip,
  hideMismatch,
  newGame,
  startPeek,
  starsFor,
  tick,
  type ArenaState,
} from '../game/engine';
import { DECK_LIST, DECKS } from '../data/decks';

/** Indices of both cards of a pair, and of one card that doesn't match it. */
const pairOf = (s: ArenaState, pairId: number) => s.cards.flatMap((c, i) => (c.pairId === pairId ? [i] : []));
const other = (s: ArenaState, pairId: number) => s.cards.findIndex((c) => c.pairId !== pairId);

function solve(s: ArenaState): ArenaState {
  const pairs = SIZES[s.size].pairs;
  for (let p = 0; p < pairs; p++) {
    const [a, b] = pairOf(s, p);
    s = flip(flip(s, a), b);
  }
  return s;
}

describe('decks', () => {
  it('have enough different symbols for the biggest board', () => {
    for (const d of DECK_LIST) {
      expect(new Set(d.symbols).size, d.id).toBe(d.symbols.length);
      expect(d.symbols.length, d.id).toBeGreaterThanOrEqual(SIZES.hard.pairs);
    }
  });

  it('never use joined emoji that can split into two pictures', () => {
    for (const d of DECK_LIST) for (const s of d.symbols) expect(s.includes('‍'), `${d.id} ${s}`).toBe(false);
  });

  it('builds every symbol exactly twice', () => {
    const cards = buildCards(18, 'mixed');
    const counts = new Map<string, number>();
    for (const c of cards) counts.set(c.symbol, (counts.get(c.symbol) ?? 0) + 1);
    expect(counts.size).toBe(18);
    for (const n of counts.values()) expect(n).toBe(2);
  });

  it('builds the same board from the same seed', () => {
    const a = buildCards(10, 'animals', 42).map((c) => c.symbol);
    expect(buildCards(10, 'animals', 42).map((c) => c.symbol)).toEqual(a);
    expect(buildCards(10, 'animals', 43).map((c) => c.symbol)).not.toEqual(a);
    expect(DECKS.animals.symbols).toContain(a[0]);
  });
});

describe('matching', () => {
  it('scores a match and builds a combo', () => {
    let s = newGame({ mode: 'classic', size: 'easy', deck: 'animals', seed: 1 });
    const [a, b] = pairOf(s, 0);
    s = flip(flip(s, a), b);
    expect(s.cards[a].matched && s.cards[b].matched).toBe(true);
    expect(s.points).toBe(100);
    const [c, d] = pairOf(s, 1);
    s = flip(flip(s, c), d);
    expect(s.combo).toBe(2);
    expect(s.points).toBe(300);
  });

  it('ignores taps on matched or already open cards', () => {
    let s = newGame({ mode: 'classic', size: 'easy', deck: 'animals', seed: 1 });
    const [a] = pairOf(s, 0);
    s = flip(s, a);
    expect(flip(s, a)).toBe(s);
  });

  it('a third tap closes a mismatched pair straight away', () => {
    let s = newGame({ mode: 'classic', size: 'easy', deck: 'animals', seed: 1 });
    const [a] = pairOf(s, 0);
    const x = other(s, 0);
    s = flip(flip(s, a), x);
    expect(s.open).toHaveLength(2);
    const y = s.cards.findIndex((_c, i) => i !== a && i !== x);
    s = flip(s, y);
    expect(s.open).toEqual([y]);
    expect(s.cards[a].faceUp).toBe(false);
  });

  it('wins when every pair is found', () => {
    const s = solve(newGame({ mode: 'classic', size: 'easy', deck: 'food', seed: 3 }));
    expect(s.status).toBe('won');
    expect(s.moves).toBe(8);
    const score = finalScore(s);
    expect(score.stars).toBe(3);
    expect(score.cleanBonus).toBeGreaterThan(0);
  });

  it('caps the combo at ×5', () => {
    const s = solve(newGame({ mode: 'classic', size: 'hard', deck: 'mixed', seed: 3 }));
    expect(s.bestCombo).toBe(5);
    expect(s.points).toBe(100 + 200 + 300 + 400 + 500 * 14);
  });
});

describe('slips', () => {
  it('turning over unknown cards is never a slip', () => {
    let s = newGame({ mode: 'survival', size: 'easy', deck: 'animals', seed: 5 });
    s = { ...s, status: 'ready', cards: s.cards.map((c) => ({ ...c, seen: false })) };
    const [a] = pairOf(s, 0);
    s = flip(flip(s, a), other(s, 0));
    expect(s.event?.kind).toBe('miss');
    expect(s.lives).toBe(3);
  });

  it('picking a card you have already seen, wrongly, costs a heart in Survival', () => {
    let s = endPreview(newGame({ mode: 'survival', size: 'easy', deck: 'animals', seed: 5 }));
    const [a] = pairOf(s, 0);
    s = flip(flip(s, a), other(s, 0));
    expect(s.event?.kind).toBe('slip');
    expect(s.lives).toBe(2);
  });

  it('runs out of hearts', () => {
    let s = endPreview(newGame({ mode: 'survival', size: 'easy', deck: 'animals', seed: 5 }));
    for (let i = 0; i < 3; i++) {
      const [a] = pairOf(s, 0);
      s = hideMismatch(flip(flip(s, a), other(s, 0)));
    }
    expect(s.status).toBe('lost');
    expect(flip(s, 0)).toBe(s);
  });
});

describe('clock and power-ups', () => {
  it('Time Attack counts down, adds time per pair and ends at zero', () => {
    let s = newGame({ mode: 'time-attack', size: 'easy', deck: 'animals', seed: 2 });
    expect(s.timeLeft).toBe(SIZES.easy.par);
    const [a, b] = pairOf(s, 0);
    s = flip(flip(s, a), b);
    expect(s.timeLeft).toBe(SIZES.easy.par + MODES['time-attack'].bonusSeconds);
    for (let i = 0; i < 200; i++) s = tick(s);
    expect(s.status).toBe('lost');
    expect(s.timeLeft).toBe(0);
  });

  it('the clock does not start until the first card is turned', () => {
    const s = newGame({ mode: 'classic', size: 'easy', deck: 'animals' });
    expect(tick(s)).toBe(s);
  });

  it('peeking costs points, is limited and freezes play', () => {
    let s = newGame({ mode: 'classic', size: 'easy', deck: 'animals', seed: 2 });
    const [a, b] = pairOf(s, 0);
    s = flip(flip(s, a), b);
    s = startPeek(s);
    expect(s.peeking).toBe(true);
    expect(s.points).toBe(0);
    expect(flip(s, other(s, 0))).toBe(s);
    s = endPeek(s);
    expect(startPeek(s)).toBe(s);
  });

  it('Zen has unlimited free peeks and no score', () => {
    let s = newGame({ mode: 'zen', size: 'easy', deck: 'animals', seed: 2 });
    for (let i = 0; i < 5; i++) s = endPeek(startPeek(s));
    expect(s.peeksUsed).toBe(5);
    expect(finalScore(solve(s)).total).toBe(0);
  });
});

describe('stars', () => {
  it('compare moves with what a perfect memory needs', () => {
    expect(starsFor(14, 8)).toBe(3);
    expect(starsFor(18, 8)).toBe(2);
    expect(starsFor(30, 8)).toBe(1);
  });
});
