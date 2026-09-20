import React, { memo } from 'react';
import type { Card } from '../types/game';
import { Sparkles, Check } from 'lucide-react';

interface MemoryCardProps {
  card: Card;
  index: number;
  isMismatched: boolean;
  onCardClick: (index: number) => void;
  disabled: boolean;
  totalCards: number;
}

export const MemoryCard: React.FC<MemoryCardProps> = memo(({
  card,
  index,
  isMismatched,
  onCardClick,
  disabled,
  totalCards,
}) => {
  const isFlipped = card.isFlipped || card.isMatched;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !isFlipped) {
        onCardClick(index);
      }
    }
  };

  // Adjust font size based on difficulty/totalCards for optimal responsiveness
  const getSymbolSizeClass = () => {
    if (totalCards > 20) return 'text-2xl sm:text-3xl md:text-4xl'; // Hard (36 cards)
    return 'text-3xl sm:text-4xl md:text-5xl'; // Easy & Medium
  };

  return (
    <div
      role="button"
      tabIndex={card.isMatched ? -1 : 0}
      aria-label={
        card.isMatched
          ? `Matched card, ${card.symbol}`
          : card.isFlipped
          ? `Flipped card, ${card.symbol}`
          : `Hidden card ${index + 1}`
      }
      aria-pressed={isFlipped}
      aria-disabled={disabled || card.isMatched}
      onClick={() => {
        if (!disabled && !isFlipped) {
          onCardClick(index);
        }
      }}
      onKeyDown={handleKeyDown}
      className={`
        relative w-full aspect-square cursor-pointer select-none perspective-1000
        focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
        rounded-xl sm:rounded-2xl transition-transform duration-200
        ${!isFlipped && !disabled ? 'hover:-translate-y-1 active:scale-95' : ''}
        ${card.isMatched ? 'cursor-default opacity-85' : ''}
      `}
    >
      <div
        className={`
          card-inner relative w-full h-full duration-400 preserve-3d rounded-xl sm:rounded-2xl shadow-md
          ${isFlipped ? 'rotate-y-180' : ''}
          ${isMismatched ? 'animate-mismatch' : ''}
          ${card.isMatched ? 'animate-matched ring-2 ring-emerald-400/80 shadow-emerald-500/20 shadow-lg' : ''}
        `}
        style={{
          transitionProperty: 'transform',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* CARD BACK (Face Down) */}
        <div
          className="
            absolute inset-0 w-full h-full backface-hidden rounded-xl sm:rounded-2xl
            bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800
            border border-indigo-400/30 flex flex-col items-center justify-center p-2
            shadow-inner group overflow-hidden
          "
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

          <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-indigo-100 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
          </div>
        </div>

        {/* CARD FRONT (Face Up) */}
        <div
          className={`
            absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl sm:rounded-2xl
            flex items-center justify-center p-1 sm:p-2 border
            transition-colors duration-300
            ${
              card.isMatched
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-950/60 dark:to-teal-900/60 border-emerald-400/60 text-emerald-900 dark:text-emerald-100'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg'
            }
          `}
        >
          <span
            className={`
              transform transition-transform duration-200 select-none
              ${getSymbolSizeClass()}
              ${card.isMatched ? 'scale-105' : 'scale-100'}
            `}
            role="img"
            aria-hidden="true"
          >
            {card.symbol}
          </span>

          {/* Subtle matched checkmark badge in top corner */}
          {card.isMatched && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MemoryCard.displayName = 'MemoryCard';
