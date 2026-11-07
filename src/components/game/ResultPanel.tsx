import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Share2, Star } from 'lucide-react';
import { SIZES, type ArenaState, type FinalScore } from '../../game/engine';
import { rankFor, type RecordOutcome } from '../../game/progress';
import { formatClock, formatCountdown, msUntilTomorrow } from '../../game/daily';
import { shareResult } from '../../game/share';
import { trackEvent } from '../../lib/consent';

interface ResultPanelProps {
  state: ArenaState;
  score: FinalScore;
  outcome: RecordOutcome | null;
  dailyNumber?: number;
  onPlayAgain?: () => void;
}

const HEAT = ['bg-cyan/25', 'bg-cyan/45', 'bg-amber/50', 'bg-pink/60', 'bg-red/75'];

const Countdown: React.FC = () => {
  const [ms, setMs] = useState(() => msUntilTomorrow());
  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilTomorrow()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="font-mono text-lg font-bold tabular-nums">{formatCountdown(ms)}</span>;
};

/** Shown over the board at the end of a game. */
export const ResultPanel: React.FC<ResultPanelProps> = ({ state, score, outcome, dailyNumber, onPlayAgain }) => {
  const [note, setNote] = useState('');
  const won = state.status === 'won';
  const board = SIZES[state.size];
  const scored = state.mode !== 'zen';
  const maxFlips = Math.max(...state.cards.map((c) => c.flips), 1);
  const rank = outcome ? rankFor(outcome.profile.xp) : null;

  const heading = won
    ? ['', 'Board cleared', 'Nicely done!', 'Flawless memory!'][score.stars]
    : state.mode === 'survival'
      ? 'Out of hearts'
      : 'Out of time';

  const share = async () => {
    const res = await shareResult(state, score, dailyNumber);
    if (res.ok) trackEvent('share', { method: res.method, content_type: state.mode });
    setNote(res.message);
    if (res.message) window.setTimeout(() => setNote(''), 2500);
  };

  return (
    <div className="animate-rise-in mx-auto w-full max-w-lg text-center" role="status">
      <div className="flex justify-center gap-2" aria-label={won ? `${score.stars} of 3 stars` : undefined}>
        {won &&
          [1, 2, 3].map((n) => (
            <Star
              key={n}
              className={`h-10 w-10 animate-rise-in sm:h-12 sm:w-12 ${n <= score.stars ? 'fill-amber-glow text-amber-glow drop-shadow-[0_0_12px_var(--color-amber-glow)]' : 'text-rim'}`}
              style={{ animationDelay: `${n * 160}ms` }}
              aria-hidden="true"
            />
          ))}
      </div>
      <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{heading}</h2>
      <p className="mt-1 text-sm text-ink-2">
        {score.pairs} of {board.pairs} pairs · {state.moves} moves · {formatClock(state.elapsed)}
        {state.bestCombo > 1 && ` · best combo ×${state.bestCombo}`}
      </p>

      {scored && (
        <div className="mx-auto mt-5 max-w-sm rounded-2xl bg-stage-2/70 p-4 text-left text-sm">
          <dl className="space-y-1.5">
            <div className="flex justify-between">
              <dt className="text-ink-2">Pairs and combos</dt>
              <dd className="font-bold tabular-nums">{score.matchPoints.toLocaleString('en-US')}</dd>
            </div>
            {score.timeBonus > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-2">{state.timeLeft !== null ? 'Time left bonus' : 'Speed bonus'}</dt>
                <dd className="font-bold tabular-nums text-cyan">+{score.timeBonus.toLocaleString('en-US')}</dd>
              </div>
            )}
            {score.cleanBonus > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-2">No slips bonus</dt>
                <dd className="font-bold tabular-nums text-lime">+{score.cleanBonus.toLocaleString('en-US')}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-rim pt-2 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-display font-bold tabular-nums neon-text">{score.total.toLocaleString('en-US')}</dd>
            </div>
          </dl>
          {outcome && (outcome.newBest.score || outcome.newBest.time || outcome.newBest.moves) && (
            <p className="mt-3 flex flex-wrap gap-1.5">
              {outcome.newBest.score && <span className="chip !h-7 !border-amber/60 !text-amber">New best score</span>}
              {outcome.newBest.time && <span className="chip !h-7 !border-cyan/60 !text-cyan">Fastest yet</span>}
              {outcome.newBest.moves && <span className="chip !h-7 !border-lime/60 !text-lime">Fewest moves</span>}
            </p>
          )}
        </div>
      )}

      {outcome && rank && (
        <div className="mx-auto mt-4 max-w-sm text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold" style={{ color: rank.rank.color }}>
              {rank.rank.emblem} {rank.rank.name}
            </span>
            <span className="text-muted">+{outcome.xpGained.toLocaleString('en-US')} XP</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stage-2">
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.round(rank.progress * 100)}%`, background: rank.rank.color }} />
          </div>
          {rank.next && (
            <p className="mt-1 text-xs text-muted">
              {(rank.next.min - outcome.profile.xp).toLocaleString('en-US')} XP to {rank.next.name}
            </p>
          )}
        </div>
      )}

      <details className="mx-auto mt-4 max-w-sm text-left">
        <summary className="cursor-pointer text-sm font-bold text-ink-2 hover:text-ink">Where your memory slipped</summary>
        <p className="mt-2 text-xs text-muted">Each card, coloured by how many times you turned it over. Hot cards were the hardest to remember.</p>
        <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))` }}>
          {state.cards.map((c) => {
            const heat = Math.min(HEAT.length - 1, Math.round(((c.flips - 1) / Math.max(1, maxFlips - 1)) * (HEAT.length - 1)));
            return (
              <div key={c.id} className={`flex aspect-square flex-col items-center justify-center rounded-md text-sm ${HEAT[Math.max(0, heat)]}`} title={`${c.symbol} turned ${c.flips} times`}>
                <span aria-hidden="true">{c.symbol}</span>
                <span className="font-mono text-[0.6rem] text-ink-2">{c.flips}</span>
              </div>
            );
          })}
        </div>
      </details>

      {state.mode === 'daily' && (
        <div className="mx-auto mt-4 flex max-w-sm items-center justify-between rounded-2xl border border-rim px-4 py-3 text-sm">
          <span className="text-ink-2">Next board in</span>
          <Countdown />
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {onPlayAgain && (
          <button type="button" className="btn btn-glow" onClick={onPlayAgain} autoFocus>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Play again
          </button>
        )}
        <button type="button" className={`btn ${onPlayAgain ? 'btn-ghost' : 'btn-glow'}`} onClick={share}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
        {state.mode === 'daily' && (
          <Link to="/" className="btn btn-ghost">
            Play Classic
          </Link>
        )}
      </div>
      <p aria-live="polite" className="mt-2 h-5 text-sm font-bold text-lime">
        {note}
      </p>
    </div>
  );
};
