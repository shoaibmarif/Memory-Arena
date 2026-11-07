export type DeckId = 'smileys' | 'animals' | 'food' | 'space' | 'sports' | 'nature' | 'mixed';

export interface Deck {
  id: DeckId;
  name: string;
  tagline: string;
  icon: string;
  /** Two colours for the card back gradient. */
  back: [string, string];
  symbols: string[];
}

/*
 * Every symbol is a single emoji (no skin tones or joined sequences), so it looks
 * the same on every device. Each deck has at least 18 different symbols, enough
 * for the largest 6 × 6 board.
 */
const smileys = ['😀', '😂', '🥳', '😎', '🤩', '😍', '🤠', '😇', '🤖', '👻', '👾', '🎃', '👽', '🤡', '😴', '🤓', '😱', '🥶', '🤯', '😈', '💀', '🙃'];
const animals = ['🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐰', '🐻', '🦉', '🐙', '🐬', '🦋', '🐧', '🐢', '🦒', '🐘', '🦔', '🦩', '🦜', '🦓', '🐳', '🐝', '🦀'];
const food = ['🍕', '🍔', '🍟', '🌮', '🍩', '🍎', '🍉', '🍓', '🥑', '🍣', '🍦', '🍫', '🍿', '🍇', '🥞', '🥐', '🥨', '🍒', '🍍', '🥝', '🍌', '🍋', '🥕', '🧁', '🍪', '🌶️'];
const space = ['🚀', '🌍', '🌙', '⭐', '🪐', '☄️', '👽', '🛰️', '🛸', '🌌', '☀️', '🔭', '🌠', '✨', '🌑', '🌕', '📡', '💫', '🌞', '🌗', '🪂', '🌋'];
const sports = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '⛳', '🏹', '🎳', '🛹', '⛸️', '🥌', '🏒', '🥏', '🎯', '🏆', '🥇'];
const nature = ['🌸', '🌻', '🌵', '🍁', '🍄', '🌲', '🌴', '🌷', '🌹', '🌿', '🍀', '🌾', '🌈', '❄️', '🔥', '🌊', '⛰️', '🌙', '☁️', '⚡', '🐚', '🪨'];

export const DECKS: Record<DeckId, Deck> = {
  smileys: { id: 'smileys', name: 'Smileys', tagline: 'Faces, ghosts and robots', icon: '😎', back: ['#ff4fa3', '#ffb84d'], symbols: smileys },
  animals: { id: 'animals', name: 'Animals', tagline: 'Pets, wildlife and sea life', icon: '🦊', back: ['#22c58b', '#3ec9f5'], symbols: animals },
  food: { id: 'food', name: 'Food', tagline: 'Snacks, fruit and treats', icon: '🍩', back: ['#ff7a45', '#ffd23f'], symbols: food },
  space: { id: 'space', name: 'Space', tagline: 'Rockets, planets and stars', icon: '🪐', back: ['#7b5cff', '#2bd2ff'], symbols: space },
  sports: { id: 'sports', name: 'Sports', tagline: 'Balls, bats and trophies', icon: '⚽', back: ['#2f80ff', '#5df2c3'], symbols: sports },
  nature: { id: 'nature', name: 'Nature', tagline: 'Flowers, trees and weather', icon: '🌸', back: ['#4cc26b', '#c6f05a'], symbols: nature },
  mixed: { id: 'mixed', name: 'Mixed', tagline: 'A bit of everything', icon: '🎲', back: ['#ff4fa3', '#7b5cff'], symbols: [] },
};

DECKS.mixed.symbols = [...new Set([...smileys, ...animals, ...food, ...space, ...sports, ...nature])];

export const DECK_LIST: Deck[] = Object.values(DECKS);

/** Old saved settings used different deck names. */
export const LEGACY_DECKS: Record<string, DeckId> = { emoji: 'smileys', food: 'food', animals: 'animals', space: 'space', random: 'mixed' };
