import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Flame } from 'lucide-react';
import { GameScreen } from '../components/game/GameScreen';
import { GamePage } from '../components/game/GamePage';
import { dailyArena, formatClock, formatCountdown, msUntilTomorrow } from '../game/daily';
import { liveDailyStreak } from '../game/progress';
import { DECKS } from '../data/decks';
import { SITE } from '../seo/site';
import { useApp } from '../context/AppContext';

/** Shown when today's board has already been played. */
const AlreadyPlayed: React.FC<{ number: number; dayKey: string }> = ({ number, dayKey }) => {
  const { profile } = useApp();
  const r = profile.daily.results[dayKey];
  const [ms, setMs] = useState(() => msUntilTomorrow());
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilTomorrow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const copy = async () => {
    const text = `${SITE.name} · Daily Arena #${number}\n${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)} ${r.moves} moves · ${formatClock(r.time)} · ${r.score.toLocaleString('en-US')} pts\n${SITE.url}/daily`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <section className="panel mx-auto max-w-xl p-6 text-center sm:p-8">
      <p className="eyebrow">Daily Arena #{number}</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">You’ve played today’s board</h1>
      <p className="mt-3 text-4xl tracking-widest" aria-label={`${r.stars} of 3 stars`}>
        {'⭐'.repeat(r.stars)}
        <span className="opacity-30">{'☆'.repeat(3 - r.stars)}</span>
      </p>
      <dl className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-2">
        {[
          ['Score', r.score.toLocaleString('en-US')],
          ['Moves', String(r.moves)],
          ['Time', formatClock(r.time)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-stage-2/70 py-3">
            <dt className="eyebrow !text-[0.62rem]">{k}</dt>
            <dd className="font-display text-lg font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-2">
        <Flame className="h-4 w-4 text-amber" aria-hidden="true" /> Streak: {liveDailyStreak(profile, dayKey)} · Next board in{' '}
        <span className="font-mono font-bold text-ink">{formatCountdown(ms)}</span>
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" className="btn btn-glow" onClick={copy}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <Link to="/" className="btn btn-ghost">
          Play Classic
        </Link>
        <Link to="/survival" className="btn btn-ghost">
          Try Survival
        </Link>
      </div>
    </section>
  );
};

export const Daily: React.FC = () => {
  const { profile } = useApp();
  const [today, setToday] = useState(() => dailyArena());
  // Roll over to the new board at midnight if the page is left open.
  useEffect(() => {
    const id = window.setTimeout(() => setToday(dailyArena()), msUntilTomorrow() + 1000);
    return () => window.clearTimeout(id);
  }, [today.key]);

  // Only the first run counts. If it finished while this page is open, keep showing the result panel.
  const [playedOnLoad] = useState(() => Boolean(profile.daily.results[today.key]));

  return (
    <GamePage
      path="/daily"
      game={
        playedOnLoad ? (
          <AlreadyPlayed number={today.number} dayKey={today.key} />
        ) : (
          <GameScreen
            key={today.key}
            mode="daily"
            title={`Today’s board: ${DECKS[today.deck].name}`}
            fixedDeck={today.deck}
            fixedSize="medium"
            seed={today.seed}
            dailyKey={today.key}
            dailyNumber={today.number}
          />
        )
      }
    >
      <section className="prose-arena">
        <h2>One board, everyone, every day</h2>
        <p>
          The Daily Arena is a 5 × 4 board with ten pairs. Everyone who plays today gets exactly the same cards in exactly the same
          places, so it’s the fairest way to compare with friends. The deck rotates daily and a new board arrives at midnight in your
          time zone.
        </p>
        <p>
          You get one scored run. Scoring is the same as <Link to="/">Classic</Link>: points for every pair, combos for pairs in a row,
          a speed bonus and a bonus for a game without slips. You have one Peek if you need it, but it costs 150 points.
        </p>
        <h2>Keep the streak going</h2>
        <p>
          Finish the board on back to back days to build a streak. Miss a day and it starts again. When you’re done, share your stars,
          moves and time. The board itself stays secret, so nobody gets spoiled.
        </p>
      </section>
    </GamePage>
  );
};
