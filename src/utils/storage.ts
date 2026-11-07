import { EMPTY_PROFILE, type Profile } from '../game/progress';
import { LEGACY_DECKS, type DeckId } from '../data/decks';
import type { SizeId } from '../game/engine';

const PROFILE_KEY = 'memory_arena_profile_v2';
const SETTINGS_KEY = 'memory_arena_settings_v2';
// Saved by the first version of the site.
const OLD_SETTINGS = 'memory_game_settings_v1';
const OLD_ACHIEVEMENTS = 'memory_game_achievements_v1';
const OLD_STATS = 'memory_game_statistics_v1';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  sound: boolean;
  theme: ThemeMode;
  reducedMotion: boolean;
  deck: DeckId;
  size: SizeId;
}

export const DEFAULT_SETTINGS: Settings = { sound: true, theme: 'dark', reducedMotion: false, deck: 'animals', size: 'easy' };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: progress lasts for this visit only
  }
}

export function loadSettings(): Settings {
  const saved = read<Partial<Settings>>(SETTINGS_KEY);
  if (saved) return { ...DEFAULT_SETTINGS, ...saved };
  const old = read<{ soundEnabled?: boolean; themeMode?: ThemeMode; cardTheme?: string; reducedMotion?: boolean }>(OLD_SETTINGS);
  if (!old) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    sound: old.soundEnabled ?? true,
    theme: old.themeMode ?? DEFAULT_SETTINGS.theme,
    reducedMotion: old.reducedMotion ?? false,
    deck: (old.cardTheme && LEGACY_DECKS[old.cardTheme]) || DEFAULT_SETTINGS.deck,
  };
}

export const saveSettings = (s: Settings) => write(SETTINGS_KEY, s);

export function loadProfile(): Profile {
  const saved = read<Partial<Profile>>(PROFILE_KEY);
  if (saved) return { ...EMPTY_PROFILE, ...saved, daily: { ...EMPTY_PROFILE.daily, ...saved.daily } };

  // Bring over what still makes sense from the first version: unlocked
  // achievements and the number of games played.
  const profile: Profile = { ...EMPTY_PROFILE, achievements: {} };
  const oldAch = read<{ id: string; unlockedAt?: string }[]>(OLD_ACHIEVEMENTS);
  for (const a of oldAch ?? []) if (a.unlockedAt) profile.achievements[a.id] = a.unlockedAt;
  const oldStats = read<{ gamesPlayed?: number; gamesCompleted?: number; totalPairsMatched?: number }>(OLD_STATS);
  if (oldStats) {
    profile.games = oldStats.gamesPlayed ?? 0;
    profile.wins = oldStats.gamesCompleted ?? 0;
    profile.pairs = oldStats.totalPairsMatched ?? 0;
  }
  return profile;
}

export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);
export const resetProfile = () => write(PROFILE_KEY, EMPTY_PROFILE);
