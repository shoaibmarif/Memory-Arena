import type { Card, ThemeId } from '../types/game';
import { THEMES } from '../data/themes';
import { shuffle, seededShuffle, createMulberry32 } from '../utils/random';

interface GenerateCardsOptions {
  pairsCount: number;
  themeId: ThemeId;
  seed?: number; // If provided, uses deterministic seeded PRNG
}

/**
 * Generates an array of cards with guaranteed pair matching.
 * Each symbol appears exactly twice.
 */
export function generateCards({ pairsCount, themeId, seed }: GenerateCardsOptions): Card[] {
  const theme = THEMES[themeId] || THEMES.emoji;
  let availableSymbols = [...theme.symbols];

  // If theme has fewer symbols than needed (safety fallback), cycle or pad with random symbols
  if (availableSymbols.length < pairsCount) {
    const backupPool = THEMES.random.symbols;
    for (const sym of backupPool) {
      if (!availableSymbols.includes(sym)) {
        availableSymbols.push(sym);
      }
      if (availableSymbols.length >= pairsCount) break;
    }
  }

  // Shuffle available symbols before selecting so each game gets fresh symbols
  let chosenSymbols: string[];
  if (seed !== undefined) {
    const prng = createMulberry32(seed);
    const shuffledSymbols = seededShuffle(availableSymbols, prng);
    chosenSymbols = shuffledSymbols.slice(0, pairsCount);
  } else {
    const shuffledSymbols = shuffle(availableSymbols);
    chosenSymbols = shuffledSymbols.slice(0, pairsCount);
  }

  // Generate pair items
  const cards: Card[] = [];
  chosenSymbols.forEach((symbol, pairIndex) => {
    // First card of pair
    cards.push({
      id: `card-${pairIndex}-a`,
      pairId: pairIndex,
      symbol,
      theme: themeId,
      isFlipped: false,
      isMatched: false,
    });

    // Second card of pair
    cards.push({
      id: `card-${pairIndex}-b`,
      pairId: pairIndex,
      symbol,
      theme: themeId,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Shuffle the full card deck
  if (seed !== undefined) {
    const prngDeck = createMulberry32(seed + 1013904223);
    return seededShuffle(cards, prngDeck);
  } else {
    return shuffle(cards);
  }
}
