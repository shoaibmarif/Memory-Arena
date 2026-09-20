import React from 'react';
import type { Card, DifficultyConfig } from '../types/game';
import { MemoryCard } from './MemoryCard';

interface GameBoardProps {
  cards: Card[];
  difficulty: DifficultyConfig;
  mismatchedIndices: [number, number] | null;
  onCardClick: (index: number) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(({
  cards,
  difficulty,
  mismatchedIndices,
  onCardClick,
  disabled,
}) => {
  // Determine optimal grid columns and max-width based on difficulty
  const getGridConfig = () => {
    switch (difficulty.id) {
      case 'easy': // 4x4 (16 cards)
        return {
          gridClass: 'grid-cols-4 max-w-md sm:max-w-lg',
          gapClass: 'gap-2.5 sm:gap-3.5',
        };
      case 'medium': // 4x5 (20 cards)
        return {
          gridClass: 'grid-cols-4 sm:grid-cols-5 max-w-md sm:max-w-xl',
          gapClass: 'gap-2 sm:gap-3',
        };
      case 'hard': // 6x6 (36 cards)
        return {
          gridClass: 'grid-cols-6 max-w-lg sm:max-w-2xl',
          gapClass: 'gap-1.5 sm:gap-2.5',
        };
      default:
        return {
          gridClass: 'grid-cols-4 max-w-md',
          gapClass: 'gap-2',
        };
    }
  };

  const { gridClass, gapClass } = getGridConfig();

  return (
    <div className="w-full flex justify-center items-center py-2 sm:py-4 px-2 select-none">
      <div
        className={`
          w-full grid ${gridClass} ${gapClass}
          p-3 sm:p-5 rounded-3xl
          bg-white/40 dark:bg-slate-900/40 backdrop-blur-md
          border border-slate-200/70 dark:border-slate-800/80
          shadow-2xl shadow-indigo-500/5 transition-all duration-300
        `}
      >
        {cards.map((card, index) => {
          const isMismatched =
            mismatchedIndices !== null &&
            (mismatchedIndices[0] === index || mismatchedIndices[1] === index);

          return (
            <MemoryCard
              key={card.id}
              card={card}
              index={index}
              isMismatched={isMismatched}
              onCardClick={onCardClick}
              disabled={disabled}
              totalCards={cards.length}
            />
          );
        })}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
