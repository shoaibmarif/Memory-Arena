import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, Flame, Heart, Leaf, Timer, Trophy } from 'lucide-react';
import { GameScreen } from '../components/game/GameScreen';
import { GamePage } from '../components/game/GamePage';
import { Accordion } from '../components/ui/Accordion';
import { FAQ_ITEMS } from '../data/faq';
import { DECK_LIST, DECKS } from '../data/decks';
import { dailyArena, formatCountdown, msUntilTomorrow } from '../game/daily';
import { RANKS, liveDailyStreak, rankFor } from '../game/progress';
import { PERFECT_MOVES_PER_PAIR } from '../game/engine';
import { useApp } from '../context/AppContext';

const MODES = [
  { to: '/', icon: Trophy, name: 'Classic', color: 'var(--color-pink-glow)', body: 'The full game with a score. Chain pairs into combos for up to ×5 points.' },
  { to: '/daily', icon: CalendarDays, name: 'Daily Arena', color: 'var(--color-amber-glow)', body: 'One board for the whole world, every day. One run, a streak and bragging rights.' },
  { to: '/time-attack', icon: Timer, name: 'Time Attack', color: 'var(--color-cyan-glow)', body: 'Race the clock. Each pair puts four seconds back, so speed buys you time.' },
  { to: '/survival', icon: Heart, name: 'Survival', color: 'var(--color-pink-glow)', body: 'See the whole board for a moment. Then three hearts, and slips cost one each.' },
  { to: '/zen', icon: Leaf, name: 'Zen', color: 'var(--color-lime-glow)', body: 'No clock, no score, free peeks. Just you and the cards.' },
];

const DailyStrip: React.FC = () => {
  const { profile } = useApp();
  const today = dailyArena();
  const done = Boolean(profile.daily.results[today.key]);
  const streak = liveDailyStreak(profile, today.key);
  const [ms, setMs] = useState(() => msUntilTomorrow());
  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilTomorrow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-label="Today’s Daily Arena" className="panel relative mx-auto max-w-4xl overflow-hidden p-5 sm:p-6">
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-glow/25 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
        <div className="flex items-center gap-4">
          <span
            className="flex h-14 w-11 shrink-0 -rotate-6 items-center justify-center rounded-xl text-2xl shadow-lg"
            style={{ background: `linear-gradient(140deg, ${DECKS[today.deck].back[0]}, ${DECKS[today.deck].back[1]})` }}
            aria-hidden="true"
          >
            {DECKS[today.deck].icon}
          </span>
          <div>
            <p className="eyebrow">Daily Arena #{today.number} · {DECKS[today.deck].name} deck</p>
            <p className="font-display text-lg font-bold">{done ? 'You’ve played today. Nice one.' : 'Today’s board is waiting'}</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-muted">Streak</p>
            <p className="flex items-center gap-1 font-display text-xl font-bold">
              <Flame className="h-5 w-5 text-amber" aria-hidden="true" />
              {streak}
            </p>
          </div>
          <div>
            <p className="text-muted">Next board</p>
            <p className="font-mono text-xl font-bold tabular-nums">{formatCountdown(ms)}</p>
          </div>
        </div>
        <Link to="/daily" className={`btn ${done ? 'btn-ghost' : 'btn-glow'}`}>
          {done ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> See result
            </>
          ) : (
            <>
              Play today <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Link>
      </div>
    </section>
  );
};

const DeckFan: React.FC = () => {
  const { settings, updateSettings } = useApp();
  return (
    <section aria-labelledby="decks-heading" className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Seven decks</p>
          <h2 id="decks-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Pick the cards you play with
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink-2">Tap a deck to use it in Classic, Time Attack, Survival and Zen. Your choice is remembered.</p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4" role="radiogroup" aria-label="Card deck">
        {DECK_LIST.map((d, i) => {
          const active = settings.deck === d.id;
          const tilt = (i - (DECK_LIST.length - 1) / 2) * 3;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                updateSettings({ deck: d.id });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex w-[5.5rem] flex-col items-center gap-2 transition-transform duration-300 sm:w-28 ${active ? '-translate-y-2' : 'hover:-translate-y-2'}`}
              style={{ transform: active ? undefined : `rotate(${tilt}deg)` }}
            >
              <span
                className={`relative flex aspect-[3/4] w-full items-center justify-center rounded-2xl text-4xl shadow-lg transition-shadow sm:text-5xl ${active ? 'ring-4 ring-offset-4 ring-offset-stage' : ''}`}
                style={{
                  background: `radial-gradient(circle, rgb(255 255 255 / 0.3) 0 22%, transparent 23%), repeating-linear-gradient(45deg, rgb(255 255 255 / 0.12) 0 2px, transparent 2px 12px), linear-gradient(140deg, ${d.back[0]}, ${d.back[1]})`,
                  ['--tw-ring-color' as string]: d.back[0],
                  boxShadow: active ? `0 0 34px -6px ${d.back[0]}` : undefined,
                }}
              >
                <span aria-hidden="true" className="transition-transform group-hover:scale-110">
                  {d.icon}
                </span>
              </span>
              <span className="text-sm font-bold">{d.name}</span>
              <span className="-mt-2 text-center text-[0.7rem] leading-4 text-muted">{d.tagline}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const RankLadder: React.FC = () => {
  const { profile } = useApp();
  const { index } = rankFor(profile.xp);
  return (
    <section aria-labelledby="ranks-heading" className="mt-20">
      <p className="eyebrow">Progress</p>
      <h2 id="ranks-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
        Climb from Rookie to Legend
      </h2>
      <p className="mt-2 max-w-2xl text-ink-2">
        Every game earns XP, win or lose. Bigger boards, longer combos and clean games without slips earn the most.
      </p>
      <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {RANKS.map((r, i) => {
          const reached = i <= index;
          return (
            <li
              key={r.name}
              className={`panel relative flex flex-col items-center !rounded-2xl px-3 py-4 text-center transition-opacity ${reached ? '' : 'opacity-55'}`}
              style={i === index ? { borderColor: r.color, boxShadow: `0 0 30px -10px ${r.color}` } : undefined}
            >
              {i === index && <span className="absolute -top-2.5 rounded-full bg-ink px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-wider text-stage">You</span>}
              <span className="text-3xl" style={{ color: r.color }} aria-hidden="true">
                {r.emblem}
              </span>
              <span className="mt-1 font-display text-sm font-bold">{r.name}</span>
              <span className="font-mono text-[0.68rem] text-muted">{r.min.toLocaleString('en-US')} XP</span>
            </li>
          );
        })}
      </ol>
      <Link to="/profile" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cyan underline underline-offset-4">
        See your profile and achievements <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
};

export const Home: React.FC = () => (
  <GamePage path="/" wide game={<GameScreen mode="classic" title="Flip, match, remember" />}>
    <DailyStrip />

    <section aria-labelledby="modes-heading" className="mt-20">
      <p className="eyebrow">Five ways to play</p>
      <h2 id="modes-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
        Choose your arena
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MODES.map((m) => (
          <Link key={m.name} to={m.to} className="panel group relative overflow-hidden !rounded-2xl p-5 transition-transform hover:-translate-y-1">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" style={{ background: m.color }} aria-hidden="true" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${m.color} 22%, transparent)`, color: m.color }}>
              <m.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="relative mt-4 flex items-center gap-1.5 font-display font-bold">
              {m.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="relative mt-1.5 block text-sm leading-6 text-ink-2">{m.body}</span>
          </Link>
        ))}
      </div>
    </section>

    <DeckFan />
    <RankLadder />

    <section aria-labelledby="maths-heading" className="mt-20 grid items-center gap-8 lg:grid-cols-[auto_1fr]">
      <div className="panel flex flex-col items-center justify-center !rounded-[28px] px-10 py-8 text-center">
        <span className="font-display text-6xl font-extrabold neon-text sm:text-7xl">{PERFECT_MOVES_PER_PAIR}</span>
        <span className="mt-2 text-sm font-bold text-ink-2">moves per pair</span>
        <span className="text-xs text-muted">with a perfect memory</span>
      </div>
      <div className="prose-arena">
        <h2 id="maths-heading" className="!mt-0">
          What does a perfect game look like?
        </h2>
        <p>
          Even with a flawless memory you can’t clear a board in one move per pair, because you have to turn over cards you’ve never
          seen. Mathematicians Daniel Velleman and Gregory Warrington worked out the best possible strategy, and found it takes about{' '}
          <strong>1.61 moves per pair</strong> on average.
        </p>
        <p>
          That’s what our stars are measured against. A Small 4 × 4 board with 8 pairs takes a perfect memory about 13 moves, so
          finishing in 14 earns three stars. If you’re over 19, the board got the better of you. Want to close the gap? Our{' '}
          <Link to="/memory-tips">memory tips</Link> help more than you’d think.
        </p>
      </div>
    </section>

    <section aria-labelledby="faq-heading" className="mt-20">
      <p className="eyebrow">Questions</p>
      <h2 id="faq-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
        Before you step in
      </h2>
      <div className="mt-6">
        <Accordion items={FAQ_ITEMS.slice(0, 5)} />
      </div>
      <Link to="/faq" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cyan underline underline-offset-4">
        All questions <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  </GamePage>
);
