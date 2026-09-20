import type { ThemeConfig, ThemeId } from '../types/game';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  emoji: {
    id: 'emoji',
    name: 'Smilies & Fun',
    description: 'Expressive faces and playful emoticons',
    icon: '😎',
    symbols: [
      '😀', '😂', '🥳', '😎', '🤩', '😍', '🤠', '😇',
      '🤖', '👻', '👾', '🎃', '👽', '🦄', '🧙‍♂️', '🦸‍♂️',
      '🧠', '💎', '🔥', '⚡', '🌈', '🎉', '🎸', '🕹️',
      '🔮', '🎭', '🎨', '🎪', '🧩', '🚀', '⭐', '🍀',
      '👑', '🏆', '🎯', '💡', '🔔', '🎈', '🪄', '💖'
    ],
  },
  food: {
    id: 'food',
    name: 'Food & Treats',
    description: 'Delicious snacks, fruits, and meals',
    icon: '🍕',
    symbols: [
      '🍕', '🍔', '🍟', '🌮', '🍩', '🍎', '🍉', '🍓',
      '🥑', '🍣', '🍦', '🍫', '🍿', '🍇', '🥞', '🥐',
      '🥨', '🍒', '🍍', '🥝', '🍌', '🍑', '🍋', '🥕',
      '🌭', '🥪', '🍜', '🍱', '🧁', '🍰', '🍪', '☕',
      '🥥', '🥭', '🍤', '🍙', '🥟', '🧇', '🍯', '🍭'
    ],
  },
  animals: {
    id: 'animals',
    name: 'Cute Animals',
    description: 'Adorable wildlife and friendly pets',
    icon: '🐼',
    symbols: [
      '🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸',
      '🐵', '🐰', '🐻', '🦉', '🐙', '🐬', '🦋', '🐧',
      '🐢', '🦒', '🐘', '🦔', '🦥', '🦩', '🦜', '🦭',
      '🦓', '🦍', '🦘', '🦚', '🦀', '🦈', '🐳', '🐝',
      '🐺', '🐗', '🦆', '🦇', '🦦', '🦨', '🐿️', '🦕'
    ],
  },
  space: {
    id: 'space',
    name: 'Cosmic Space',
    description: 'Galaxies, rockets, planets, and stars',
    icon: '🚀',
    symbols: [
      '🚀', '🌎', '🌙', '⭐', '🪐', '☄️', '👽', '🛰️',
      '🛸', '🌌', '☀️', ' telescope', '🌠', '✨', '🌑', '🌕',
      '🔭', '📡', '👨‍🚀', '👩‍🚀', '⚡', '💫', '🌞', '🌍',
      '🌏', '🪐', '🎇', '🎆', '☄️', '🔮', '🛰️', '🧭',
      '⚛️', '🧬', '🔬', '🛡️', '⚡', '⚓', '🛸', '🌌'
    ].map(s => s.trim()),
  },
  random: {
    id: 'random',
    name: 'Surprise Mix',
    description: 'A wild shuffle of all symbols across every category',
    icon: '🎲',
    symbols: [], // Dynamically populated by combining all themes
  },
};

// Fill the 'random' theme with unique pool from all other themes
const allSymbols = Array.from(
  new Set([
    ...THEMES.emoji.symbols,
    ...THEMES.food.symbols,
    ...THEMES.animals.symbols,
    ...THEMES.space.symbols,
  ])
);
THEMES.random.symbols = allSymbols;
