import type { Achievement } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_match',
    title: 'First Match',
    description: 'Match your very first pair of cards.',
    icon: '🎯',
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Complete an Easy difficulty game.',
    icon: '🧠',
  },
  {
    id: 'medium_maestro',
    title: 'Medium Maestro',
    description: 'Complete a Medium difficulty game.',
    icon: '🥈',
  },
  {
    id: 'memory_prodigy',
    title: 'Memory Prodigy',
    description: 'Complete a Hard difficulty game.',
    icon: '🥇',
  },
  {
    id: 'expert_champion',
    title: 'Grand Champion',
    description: 'Master all difficulties: Win a game on Easy, Medium, and Hard.',
    icon: '🏆',
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Finish any game in under 60 seconds.',
    icon: '⚡',
  },
  {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Finish any game in under 30 seconds.',
    icon: '⏱️',
  },
  {
    id: 'perfect_memory',
    title: 'Perfect Memory',
    description: 'Complete a game with zero mismatches!',
    icon: '🔥',
  },
  {
    id: 'streak_master',
    title: 'Combo King',
    description: 'Achieve a streak of 4 consecutive matches without a mismatch.',
    icon: '💫',
  },
  {
    id: 'daily_victor',
    title: 'Daily Victor',
    description: 'Complete today’s Daily Challenge.',
    icon: '📅',
  },
  {
    id: 'dedicated_10',
    title: 'Dedicated Player',
    description: 'Play 10 memory games.',
    icon: '🎮',
  },
  {
    id: 'dedicated_50',
    title: 'Centurion in Training',
    description: 'Play 50 memory games.',
    icon: '💯',
  },
];
