import React, { useCallback, useRef, useState } from 'react';
import { SIZES, isShowing, type ArenaState } from '../../game/engine';
import { DECKS } from '../../data/decks';
import { GameCard } from './GameCard';

interface BoardProps {
  state: ArenaState;
  onFlip: (index: number) => void;
  /** Hide the cards (paused). */
  hidden?: boolean;
  /** Changes when a new game starts, so cards get dealt again. */
  dealKey: number | string;
}

/**
 * The card grid. Arrow keys move between cards and Enter or Space turns one
 * over, so the whole game works without a mouse.
 */
export const Board: React.FC<BoardProps> = ({ state, onFlip, hidden = false, dealKey }) => {
  const { cols, rows } = SIZES[state.size];
  const [focusIndex, setFocusIndex] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const setRef = useCallback((i: number, el: HTMLButtonElement | null) => {
    refs.current[i] = el;
  }, []);
  const deck = DECKS[state.deck];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    const step = moves[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = Math.min(state.cards.length - 1, Math.max(0, focusIndex + step));
    setFocusIndex(next);
    refs.current[next]?.focus();
  };

  const missKind = state.event && state.event.kind !== 'match' ? (state.event.kind === 'slip' ? 'slip' : 'miss') : false;
  // Cards are 3:4, so this keeps the whole board on screen on short displays too.
  const maxWidth = `max(16rem, min(100%, calc((100dvh - 21rem) * ${((cols * 3) / (rows * 4)).toFixed(3)})))`;

  return (
    <div
      role="group"
      aria-label={`Game board, ${cols} by ${rows}. Use the arrow keys to move and Enter to turn a card.`}
      onKeyDown={onKeyDown}
      className={`mx-auto grid w-full gap-2 transition-[filter,opacity] duration-300 sm:gap-3 ${hidden ? 'pointer-events-none opacity-40 blur-lg' : ''}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth, ['--back-a' as string]: deck.back[0], ['--back-b' as string]: deck.back[1] }}
    >
      {state.cards.map((card, i) => (
        <GameCard
          key={`${dealKey}-${card.id}`}
          card={card}
          index={i}
          showing={isShowing(state, card)}
          miss={state.open.length === 2 && state.open.includes(i) ? missKind : false}
          focusable={i === focusIndex}
          dealDelay={Math.min(i * 22, 500)}
          onFlip={onFlip}
          onFocusCard={setFocusIndex}
          setRef={setRef}
        />
      ))}
    </div>
  );
};
