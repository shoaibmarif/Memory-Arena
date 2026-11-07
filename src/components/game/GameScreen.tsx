import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, Play } from 'lucide-react';
import { MODES, SIZES, type ArenaState, type FinalScore, type ModeId, type SizeId } from '../../game/engine';
import { DECK_LIST, type DeckId } from '../../data/decks';
import { makeRecord, rankFor, type RecordOutcome } from '../../game/progress';
import { useArena } from '../../hooks/useArena';
import { useApp } from '../../context/AppContext';
import { trackEvent } from '../../lib/consent';
import { soundEngine } from '../../utils/sound';
import { Board } from './Board';
import { Hud } from './Hud';
import { ResultPanel } from './ResultPanel';

const MODE_STYLE: Record<ModeId, { name: string; color: string; blurb: string }> = {
  classic: { name: 'Classic', color: 'var(--color-pink-glow)', blurb: 'Find every pair. Combos multiply your points.' },
  daily: { name: 'Daily Arena', color: 'var(--color-amber-glow)', blurb: 'Same board for everyone today. One scored run.' },
  'time-attack': { name: 'Time Attack', color: 'var(--color-cyan-glow)', blurb: 'Beat the clock. Every pair adds 4 seconds.' },
  survival: { name: 'Survival', color: 'var(--color-pink-glow)', blurb: 'Memorise the board. Forget a seen card, lose a heart.' },
  zen: { name: 'Zen', color: 'var(--color-lime-glow)', blurb: 'No clock, no score. Peek as often as you like.' },
};

interface GameScreenProps {
  mode: ModeId;
  title: string;
  fixedDeck?: DeckId;
  fixedSize?: SizeId;
  /** Sizes offered in the picker. */
  sizes?: SizeId[];
  seed?: number;
  dailyKey?: string;
  dailyNumber?: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({ mode, title, fixedDeck, fixedSize, sizes = ['easy', 'medium', 'hard'], seed, dailyKey, dailyNumber }) => {
  const { settings, updateSettings, record, pushToast } = useApp();
  const deck: DeckId = fixedDeck ?? settings.deck;
  const size: SizeId = fixedSize ?? (sizes.includes(settings.size) ? settings.size : sizes[0]);
  const [result, setResult] = useState<{ score: FinalScore; outcome: RecordOutcome | null } | null>(null);
  const [round, setRound] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const onFinish = useCallback(
    (s: ArenaState, score: FinalScore) => {
      const r = makeRecord(s, score, dailyKey);
      const outcome = record(r, score.pairs);
      setResult({ score, outcome });
      trackEvent('game_complete', { mode: s.mode, size: s.size, deck: s.deck, won: r.won, moves: r.moves, stars: r.stars, score: r.score });
      if (outcome.unlocked.length) soundEngine.playAchievement();
      outcome.unlocked.forEach((a, i) => window.setTimeout(() => pushToast({ icon: a.icon, title: 'Achievement unlocked', body: a.title }), 600 + i * 500));
      if (outcome.rankUp) {
        const { rank } = rankFor(outcome.profile.xp);
        window.setTimeout(() => pushToast({ icon: rank.emblem, title: 'Rank up', body: `You’re now ${rank.name}` }), 400);
      }
    },
    [dailyKey, record, pushToast]
  );

  const { state, flip, peek, pause, resume, restart } = useArena({ mode, size, deck, seed, onFinish });

  const playAgain = useCallback(() => {
    setResult(null);
    setRound((r) => r + 1);
    restart();
  }, [restart]);

  useEffect(() => {
    if (result) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [result]);

  const style = MODE_STYLE[mode];
  const rules = MODES[mode];
  const over = state.status === 'won' || state.status === 'lost';
  const midGame = state.moves > 0 && !over;
  const canPickDeck = !fixedDeck;
  const canPickSize = !fixedSize && sizes.length > 1;

  // Floating "+300 ×3" or "Slip!" text after each turn.
  const ev = state.event;
  const float =
    ev && !over
      ? ev.kind === 'match'
        ? rules.scored
          ? { text: `+${ev.points}${ev.combo > 1 ? ` ×${ev.combo}` : ''}`, cls: 'neon-text' }
          : { text: 'Pair!', cls: 'text-lime' }
        : ev.kind === 'slip'
          ? { text: state.lives !== null ? 'Slip! −1 ❤' : 'Slip!', cls: 'text-red' }
          : null
      : null;

  return (
    <section aria-label="Game" className="mx-auto w-full max-w-4xl">
      <div ref={panelRef} className="panel relative overflow-hidden p-4 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${style.color}, transparent)` }} aria-hidden="true" />

        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: style.color, boxShadow: `0 0 10px ${style.color}` }} aria-hidden="true" />
              {style.name}
              {dailyNumber ? ` #${dailyNumber}` : ''}
            </p>
            <h1 className="mt-1 text-xl font-extrabold leading-tight sm:text-2xl">{title}</h1>
            <p className="mt-1 hidden text-sm text-ink-2 sm:block">{style.blurb}</p>
          </div>

          {(canPickDeck || canPickSize) && (
            <div className="flex flex-col items-start gap-2 sm:items-end">
              {canPickSize && (
                <div className="flex rounded-full border border-rim bg-stage-2/60 p-1" role="radiogroup" aria-label="Board size">
                  {sizes.map((id) => {
                    const b = SIZES[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={size === id}
                        onClick={() => updateSettings({ size: id })}
                        title={midGame ? 'Starts a new board' : `${b.cols} × ${b.rows}, ${b.pairs} pairs`}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${size === id ? 'bg-panel text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
                      >
                        {b.label} <span className="font-mono font-normal opacity-70">{b.cols}×{b.rows}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {canPickDeck && (
                <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Card deck">
                  {DECK_LIST.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      role="radio"
                      aria-checked={deck === d.id}
                      aria-label={`${d.name} deck`}
                      title={`${d.name}: ${d.tagline}`}
                      onClick={() => updateSettings({ deck: d.id })}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-transform hover:-translate-y-0.5 ${deck === d.id ? 'ring-2 ring-offset-2 ring-offset-panel' : 'opacity-60 hover:opacity-100'}`}
                      style={{ background: `linear-gradient(140deg, ${d.back[0]}, ${d.back[1]})`, ['--tw-ring-color' as string]: d.back[0] }}
                    >
                      <span aria-hidden="true">{d.icon}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!over && <Hud state={state} onPeek={peek} onPause={pause} onResume={resume} onRestart={playAgain} />}

        <div className="relative">
          {over && result ? (
            <ResultPanel state={state} score={result.score} outcome={result.outcome} dailyNumber={dailyNumber} onPlayAgain={mode === 'daily' ? undefined : playAgain} />
          ) : (
            <>
              <Board state={state} onFlip={flip} hidden={state.status === 'paused'} dealKey={`${deck}-${size}-${round}`} />

              {float && (
                <div key={ev!.seq} className={`animate-float-up pointer-events-none absolute left-1/2 top-1/3 z-20 font-display text-3xl font-extrabold drop-shadow-lg sm:text-4xl ${float.cls}`} aria-hidden="true">
                  {float.text}
                </div>
              )}

              {state.status === 'preview' && (
                <div className="pointer-events-none absolute inset-x-0 -top-1 z-10 flex justify-center">
                  <span className="chip animate-pulse-ring !border-pink-glow !bg-panel !text-ink">
                    <Eye className="h-4 w-4 text-pink" aria-hidden="true" /> Memorise the board…
                  </span>
                </div>
              )}

              {state.status === 'ready' && state.moves === 0 && (
                <p className="mt-4 text-center text-sm text-muted">
                  Tap any card to start{rules.countdown ? '. The clock starts with your first card' : ''}.{' '}
                  <span className="hidden sm:inline">Or use the arrow keys and Enter.</span>
                </p>
              )}

              {state.status === 'paused' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center">
                  <p className="font-display text-2xl font-extrabold">Paused</p>
                  <p className="text-sm text-ink-2">The cards are hidden while you’re away.</p>
                  <button type="button" className="btn btn-glow" onClick={resume} autoFocus>
                    <Play className="h-4 w-4" aria-hidden="true" /> Carry on
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {ev?.kind === 'match' ? 'Pair found.' : ev?.kind === 'slip' ? 'Slip. You had seen that card.' : ev?.kind === 'miss' ? 'No match.' : ''}
      </p>
    </section>
  );
};

