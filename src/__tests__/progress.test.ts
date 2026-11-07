import { describe, it, expect } from 'vitest';
import { EMPTY_PROFILE, RANKS, liveDailyStreak, rankFor, recordGame, type GameRecord } from '../game/progress';
import { dailyArena, formatClock, msUntilTomorrow } from '../game/daily';
import { buildCards } from '../game/engine';

const game = (over: Partial<GameRecord> = {}): GameRecord => ({
  at: new Date().toISOString(),
  mode: 'classic',
  size: 'easy',
  deck: 'animals',
  won: true,
  score: 2000,
  moves: 14,
  time: 40,
  stars: 3,
  slips: 0,
  bestCombo: 3,
  peeks: 0,
  livesLeft: null,
  timeLeft: null,
  ...over,
});

describe('profile', () => {
  it('adds XP, bests and achievements', () => {
    const { profile, xpGained, unlocked, newBest } = recordGame(EMPTY_PROFILE, game(), 8);
    expect(xpGained).toBe(2000);
    expect(profile).toMatchObject({ xp: 2000, games: 1, wins: 1, pairs: 8 });
    expect(profile.best['classic:easy']).toEqual({ score: 2000, time: 40, moves: 14 });
    expect(newBest).toEqual({ score: true, time: true, moves: true });
    expect(unlocked.map((a) => a.id)).toEqual(expect.arrayContaining(['first_match', 'first_win', 'memory_master', 'speed_runner', 'perfect_memory']));
  });

  it('never unlocks the same achievement twice', () => {
    const first = recordGame(EMPTY_PROFILE, game(), 8).profile;
    const second = recordGame(first, game(), 8);
    expect(second.unlocked.map((a) => a.id)).not.toContain('first_win');
  });

  it('gives half XP for a lost game and flat XP in Zen', () => {
    expect(recordGame(EMPTY_PROFILE, game({ won: false, score: 800 }), 3).xpGained).toBe(400);
    expect(recordGame(EMPTY_PROFILE, game({ mode: 'zen', score: 0 }), 8).xpGained).toBe(160);
  });

  it('keeps only the best of each record', () => {
    let p = recordGame(EMPTY_PROFILE, game({ score: 3000, time: 50, moves: 20 }), 8).profile;
    const r = recordGame(p, game({ score: 2500, time: 30, moves: 22 }), 8);
    p = r.profile;
    expect(p.best['classic:easy']).toEqual({ score: 3000, time: 30, moves: 20 });
    expect(r.newBest).toEqual({ score: false, time: true, moves: false });
  });
});

describe('ranks', () => {
  it('climb with XP and report progress to the next one', () => {
    expect(rankFor(0).rank.name).toBe('Rookie');
    expect(rankFor(RANKS[1].min).rank.name).toBe('Bronze');
    const halfway = rankFor((RANKS[1].min + RANKS[2].min) / 2);
    expect(halfway.progress).toBeCloseTo(0.5);
    expect(rankFor(10_000_000).next).toBeNull();
  });

  it('a single great game does not skip a rank', () => {
    const { profile, rankUp } = recordGame(EMPTY_PROFILE, game({ score: 4000 }), 8);
    expect(rankUp).toBe(false);
    expect(rankFor(profile.xp).rank.name).toBe('Rookie');
  });
});

describe('daily arena', () => {
  it('is the same board for everyone on a date, and different the next day', () => {
    const a = dailyArena(new Date(2026, 10, 20, 9));
    const b = dailyArena(new Date(2026, 10, 20, 23));
    const c = dailyArena(new Date(2026, 10, 21, 1));
    expect(a).toEqual(b);
    expect(c.number).toBe(a.number + 1);
    expect(buildCards(10, a.deck, a.seed).map((x) => x.symbol)).toEqual(buildCards(10, b.deck, b.seed).map((x) => x.symbol));
    expect(c.seed).not.toBe(a.seed);
  });

  it('starts at #1 on launch day', () => {
    expect(dailyArena(new Date(2026, 10, 7, 12)).number).toBe(1);
  });

  it('builds a streak on consecutive days and counts only the first run', () => {
    let p = recordGame(EMPTY_PROFILE, game({ mode: 'daily', day: '2026-11-08' }), 10).profile;
    p = recordGame(p, game({ mode: 'daily', day: '2026-11-09' }), 10).profile;
    expect(p.daily.streak).toBe(2);
    const again = recordGame(p, game({ mode: 'daily', day: '2026-11-09', score: 9999 }), 10).profile;
    expect(again.daily.results['2026-11-09'].score).toBe(2000);
    expect(liveDailyStreak(p, '2026-11-10')).toBe(2);
    expect(liveDailyStreak(p, '2026-11-11')).toBe(0);
  });

  it('formats clocks', () => {
    expect(formatClock(75)).toBe('1:15');
    expect(msUntilTomorrow(new Date(2026, 10, 7, 23, 0))).toBe(3_600_000);
  });
});
