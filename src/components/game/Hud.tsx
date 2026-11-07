import React from 'react';
import { Eye, Heart, Pause, Play, RotateCcw } from 'lucide-react';
import { MAX_COMBO, MODES, SIZES, type ArenaState } from '../../game/engine';
import { formatClock } from '../../game/daily';

interface HudProps {
  state: ArenaState;
  onPeek: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const Stat: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <div className={`flex min-w-0 flex-col ${className}`}>
    <span className="eyebrow !text-[0.62rem]">{label}</span>
    <span className="font-display text-lg font-bold tabular-nums leading-tight sm:text-xl">{children}</span>
  </div>
);

/** Score, combo meter, clock or hearts, and the game controls. */
export const Hud: React.FC<HudProps> = ({ state, onPeek, onPause, onResume, onRestart }) => {
  const rules = MODES[state.mode];
  const board = SIZES[state.size];
  const found = state.cards.filter((c) => c.matched).length / 2;
  const lowTime = state.timeLeft !== null && state.timeLeft <= 10;
  const active = state.status === 'playing' || state.status === 'ready';

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        {rules.scored && <Stat label="Score">{state.points.toLocaleString('en-US')}</Stat>}
        {rules.scored && (
          <div className="flex flex-col" aria-label={`Combo ×${state.combo}`}>
            <span className="eyebrow !text-[0.62rem]">Combo</span>
            <span className="flex items-center gap-1.5">
              <span className={`font-display text-lg font-bold sm:text-xl ${state.combo >= 3 ? 'neon-text' : ''}`}>×{Math.max(1, state.combo)}</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: MAX_COMBO }, (_, i) => (
                  <span key={i} className={`h-3 w-1.5 rounded-full transition-colors ${i < state.combo ? 'bg-pink-glow' : 'bg-rim'}`} />
                ))}
              </span>
            </span>
          </div>
        )}
        <Stat label="Moves">{state.moves}</Stat>
        {state.timeLeft !== null ? (
          <Stat label="Time left" className={lowTime ? 'text-red' : ''}>
            {formatClock(state.timeLeft)}
          </Stat>
        ) : (
          <Stat label="Time">{formatClock(state.elapsed)}</Stat>
        )}
        {state.lives !== null && (
          <div className="flex flex-col" aria-label={`${state.lives} hearts left`}>
            <span className="eyebrow !text-[0.62rem]">Hearts</span>
            <span className="flex gap-1 pt-0.5">
              {Array.from({ length: rules.lives ?? 0 }, (_, i) => (
                <Heart
                  key={`${i}-${i < state.lives! ? 'on' : 'off'}`}
                  className={`h-5 w-5 ${i < state.lives! ? 'fill-pink-glow text-pink-glow' : 'animate-heart-loss text-rim'}`}
                  aria-hidden="true"
                />
              ))}
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {rules.peeks > 0 && (
            <button
              type="button"
              onClick={onPeek}
              disabled={!active || state.peeksLeft <= 0 || state.peeking}
              className="chip transition-colors hover:!border-cyan disabled:opacity-40"
              title={rules.scored ? 'Show every card for a moment. Costs 150 points.' : 'Show every card for a moment.'}
            >
              <Eye className="h-4 w-4 text-cyan" aria-hidden="true" />
              Peek
              {Number.isFinite(state.peeksLeft) && <span className="text-muted">{state.peeksLeft}</span>}
            </button>
          )}
          {state.status === 'paused' ? (
            <button type="button" onClick={onResume} className="chip hover:!border-muted" aria-label="Resume">
              <Play className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={onPause} disabled={state.status !== 'playing'} className="chip hover:!border-muted disabled:opacity-40" aria-label="Pause">
              <Pause className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {state.mode !== 'daily' && (
            <button type="button" onClick={onRestart} className="chip hover:!border-muted" aria-label="New board" title="New board">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3" aria-label={`${found} of ${board.pairs} pairs found`}>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stage-2">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-glow via-amber-glow to-lime-glow transition-[width] duration-500" style={{ width: `${(found / board.pairs) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-muted">
          {found}/{board.pairs}
        </span>
      </div>
    </div>
  );
};
