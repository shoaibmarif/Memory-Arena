import { memo } from 'react';
import type { Card } from '../../game/engine';

interface GameCardProps {
  card: Card;
  index: number;
  showing: boolean;
  miss: false | 'miss' | 'slip';
  focusable: boolean;
  dealDelay: number;
  onFlip: (index: number) => void;
  onFocusCard: (index: number) => void;
  setRef: (index: number, el: HTMLButtonElement | null) => void;
}

/** One card: a button with a patterned back and an emoji face, flipped in 3D. */
export const GameCard = memo(function GameCard({ card, index, showing, miss, focusable, dealDelay, onFlip, onFocusCard, setRef }: GameCardProps) {
  const label = card.matched
    ? `Card ${index + 1}, ${card.symbol}, matched`
    : showing
      ? `Card ${index + 1}, ${card.symbol}`
      : `Card ${index + 1}, face down`;
  return (
    <button
      ref={(el) => setRef(index, el)}
      type="button"
      className="card animate-deal outline-none"
      style={{ animationDelay: `${dealDelay}ms` }}
      data-showing={showing}
      data-matched={card.matched}
      data-miss={miss || undefined}
      tabIndex={focusable ? 0 : -1}
      aria-label={label}
      aria-pressed={showing}
      onClick={() => onFlip(index)}
      onFocus={() => onFocusCard(index)}
    >
      <span className="card-inner">
        <span className="card-face card-back" aria-hidden="true" />
        <span className="card-face card-front" aria-hidden="true">
          <span className="text-[clamp(1.4rem,6.5vw,2.9rem)] sm:text-[clamp(1.6rem,4vw,3rem)]">{card.symbol}</span>
        </span>
      </span>
    </button>
  );
});
