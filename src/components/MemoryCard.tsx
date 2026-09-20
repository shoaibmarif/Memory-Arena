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

  // Responsive font sizing based on card count
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
        rounded-2xl transition-all duration-200 group
        ${!isFlipped && !disabled ? 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/15 active:scale-95' : ''}
        ${card.isMatched ? 'cursor-default' : ''}
      `}
    >
      <div
        className={`
          card-inner relative w-full h-full duration-500 preserve-3d rounded-2xl shadow-md transition-transform
          ${isFlipped ? 'rotate-y-180' : ''}
          ${isMismatched ? 'animate-mismatch' : ''}
          ${card.isMatched ? 'animate-matched ring-2 ring-emerald-400 shadow-emerald-500/25 shadow-lg' : ''}
        `}
      >
        {/* CARD BACK (Face Down) */}
        <div
          className="
            absolute inset-0 w-full h-full backface-hidden rounded-2xl
            bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900
            border border-white/20 flex flex-col items-center justify-center p-2
            shadow-inner overflow-hidden transition-all duration-300
          "
        >
          {/* Subtle geometric starburst pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />

          {/* Central Glassmorphic Diamond Emblem */}
          <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner group-hover:scale-110 group-hover:bg-white/25 transition-all duration-200">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-100 drop-shadow" />
          </div>

          {/* Subtle Edge Shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* CARD FRONT (Face Up) */}
        <div
          className={`
            absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl
            flex items-center justify-center p-1 sm:p-2 border
            transition-colors duration-300
            ${
              card.isMatched
                ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-600/10 dark:from-emerald-950/70 dark:to-teal-950/60 border-emerald-400/80 text-emerald-900 dark:text-emerald-100 shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 shadow-xl'
            }
          `}
        >
          <span
            className={`
              transform transition-transform duration-300 select-none
              ${getSymbolSizeClass()}
              ${card.isMatched ? 'scale-110 drop-shadow-sm' : 'scale-100'}
            `}
            role="img"
            aria-hidden="true"
          >
            {card.symbol}
          </span>

          {/* Matched Top-Right Checkmark Pill */}
          {card.isMatched && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30 animate-fade-in">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  // Strict equality check: only re-render if THIS card's state changed
  return (
    prev.card.isFlipped === next.card.isFlipped &&
    prev.card.isMatched === next.card.isMatched &&
    prev.card.symbol === next.card.symbol &&
    prev.isMismatched === next.isMismatched &&
    prev.disabled === next.disabled &&
    prev.totalCards === next.totalCards &&
    prev.onCardClick === next.onCardClick
  );
});

MemoryCard.displayName = 'MemoryCard';
