import type { DeckId } from './decks';

/** Landing pages that lock the deck. Content lives in pages/DeckPage.tsx. */
export const DECK_PAGES: Record<string, DeckId> = {
  '/animal-memory-game': 'animals',
  '/emoji-memory-game': 'smileys',
  '/food-memory-game': 'food',
  '/space-memory-game': 'space',
};
