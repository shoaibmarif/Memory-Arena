import { useState, useCallback, useRef, useEffect } from 'react';
import type { Card, DifficultyConfig, GameMode, GameStatus, ScoreBreakdown, ThemeId } from '../types/game';
import { DIFFICULTIES } from '../game/difficulty';
import { generateCards } from '../game/cardGenerator';
import { getDailyChallengeInfo } from '../game/dailyChallenge';
import { calculateScore } from '../utils/score';
import { soundEngine } from '../utils/sound';
import { useStopwatch } from './useTimer';
import {
  getStatistics,
  saveStatistics,
  getAchievements,
  saveAchievements,
} from '../utils/storage';
import { checkAchievements } from '../game/achievementsChecker';

interface UseGameProps {
  onAchievementUnlocked?: (achievement: any) => void;
  onAnnounce?: (message: string) => void;
}

export function useGame({ onAchievementUnlocked, onAnnounce }: UseGameProps = {}) {
  // Game setup
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  const [difficulty, setDifficulty] = useState<DifficultyConfig>(DIFFICULTIES.easy);
  const [themeId, setThemeId] = useState<ThemeId>('emoji');

  // Board state
  const [cards, setCards] = useState<Card[]>(() => {
    return generateCards({
      pairsCount: DIFFICULTIES.easy.pairs,
      themeId: 'emoji',
    });
  });
  const [firstFlippedIndex, setFirstFlippedIndex] = useState<number | null>(null);
  const [mismatchedIndices, setMismatchedIndices] = useState<[number, number] | null>(null);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Status & gameplay metrics
  const [status, setStatus] = useState<GameStatus>('playing');
  const [moves, setMoves] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);

  // Decoupled stopwatch - eliminates timer-driven re-renders across the app
  const stopwatch = useStopwatch();

  // Keep track of timeouts for clean unmounting / restarts
  const lockTimeoutRef = useRef<number | null>(null);

  // Mutable state reference to give handleCardClick a stable identity across renders
  const stateRef = useRef({
    status,
    isLocked,
    firstFlippedIndex,
    cards,
    moves,
    matchedIndices,
    currentStreak,
    maxStreak,
    difficulty,
    gameMode,
    themeId,
    onAchievementUnlocked,
    onAnnounce,
  });

  useEffect(() => {
    stateRef.current = {
      status,
      isLocked,
      firstFlippedIndex,
      cards,
      moves,
      matchedIndices,
      currentStreak,
      maxStreak,
      difficulty,
      gameMode,
      themeId,
      onAchievementUnlocked,
      onAnnounce,
    };
  });

  /**
   * Initializes or restarts the game
   */
  const startNewGame = useCallback((
    mode?: GameMode,
    diff?: DifficultyConfig,
    theme?: ThemeId
  ) => {
    const nextMode = mode ?? stateRef.current.gameMode;
    const nextDiff = diff ?? stateRef.current.difficulty;
    const nextTheme = theme ?? stateRef.current.themeId;

    // Clear any active timeouts
    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }

    setGameMode(nextMode);
    setDifficulty(nextDiff);
    setThemeId(nextTheme);

    let generated: Card[];
    if (nextMode === 'daily') {
      const daily = getDailyChallengeInfo();
      generated = generateCards({
        pairsCount: nextDiff.pairs,
        themeId: daily.themeId,
        seed: daily.seed,
      });
      setThemeId(daily.themeId);
    } else {
      generated = generateCards({
        pairsCount: nextDiff.pairs,
        themeId: nextTheme,
      });
    }

    setCards(generated);
    setFirstFlippedIndex(null);
    setMismatchedIndices(null);
    setMatchedIndices([]);
    setIsLocked(false);
    setMoves(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setScoreBreakdown(null);
    stopwatch.reset();
    setStatus('playing');

    stateRef.current.onAnnounce?.(`Game started. ${nextDiff.name} difficulty, ${nextDiff.pairs} pairs.`);
  }, [stopwatch]);

  /**
   * Card click handler with 100% stable function reference.
   * Eliminates unnecessary re-renders of cards that didn't change!
   */
  const handleCardClick = useCallback((index: number) => {
    const s = stateRef.current;

    // Guards:
    if (s.status !== 'playing') return;
    if (s.isLocked) return;
    if (index === s.firstFlippedIndex) return; // Cannot click same card twice
    const card = s.cards[index];
    if (!card || card.isMatched || card.isFlipped) return; // Cannot click already matched or flipped card

    // Start stopwatch & record game played on the first card flip of the game
    if (!stopwatch.isActive && s.moves === 0 && s.firstFlippedIndex === null) {
      stopwatch.start();
      const stats = getStatistics();
      stats.gamesPlayed += 1;
      saveStatistics(stats);
    }

    // Play card flip sound
    soundEngine.playCardFlip();

    // First card of a turn
    if (s.firstFlippedIndex === null) {
      setFirstFlippedIndex(index);
      setCards(prev => {
        const next = [...prev];
        next[index] = { ...next[index], isFlipped: true };
        return next;
      });
      return;
    }

    // Second card of a turn
    const firstIdx = s.firstFlippedIndex;
    const firstCard = s.cards[firstIdx];
    const isMatch = firstCard.pairId === card.pairId;
    const newMoves = s.moves + 1;

    setCards(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isFlipped: true };
      return next;
    });

    setMoves(newMoves);
    setIsLocked(true);

    if (isMatch) {
      // Successful match
      soundEngine.playMatch();
      const newMatched = [...s.matchedIndices, firstIdx, index];
      setMatchedIndices(newMatched);

      const nextStreak = s.currentStreak + 1;
      setCurrentStreak(nextStreak);
      const newMaxStreak = Math.max(nextStreak, s.maxStreak);
      if (nextStreak > s.maxStreak) {
        setMaxStreak(newMaxStreak);
      }

      setCards(prev => {
        const next = [...prev];
        next[firstIdx] = { ...next[firstIdx], isMatched: true };
        next[index] = { ...next[index], isMatched: true };
        return next;
      });

      const pairsFound = newMatched.length / 2;
      const totalPairs = s.difficulty.pairs;
      s.onAnnounce?.(`Match found! Pair ${pairsFound} of ${totalPairs}.`);

      // Check achievement for match
      const currentAchievements = getAchievements();
      const stats = getStatistics();
      const unlocked = checkAchievements({
        currentAchievements,
        event: 'card_match',
        gameMode: s.gameMode,
        difficulty: s.difficulty.id,
        moves: newMoves,
        timeSeconds: stopwatch.getSeconds(),
        pairsCount: s.difficulty.pairs,
        consecutiveStreakMax: nextStreak,
        stats,
      });

      if (unlocked.length > 0) {
        saveAchievements(currentAchievements);
        soundEngine.playAchievement();
        unlocked.forEach(ach => s.onAchievementUnlocked?.(ach));
      }

      // Reset turn pointers
      setFirstFlippedIndex(null);
      setIsLocked(false);

      // Check for Game Completion!
      if (pairsFound === totalPairs) {
        const finalTime = stopwatch.stop();
        setStatus('completed');
        soundEngine.playVictory();

        // Calculate final score
        const currentStats = getStatistics();
        const bestScoreCurrent = currentStats.bestScores[s.difficulty.id] || 0;
        const bestTimeCurrent = currentStats.bestTimes[s.difficulty.id] || 0;

        const breakdown = calculateScore({
          difficulty: s.difficulty,
          moves: newMoves,
          timeSeconds: finalTime,
          consecutiveStreakMax: newMaxStreak,
          currentBestScore: bestScoreCurrent,
          currentBestTime: bestTimeCurrent,
        });

        setScoreBreakdown(breakdown);

        // Update persistent statistics
        currentStats.gamesCompleted += 1;
        currentStats.totalMoves += newMoves;
        currentStats.totalPairsMatched += totalPairs;
        currentStats.currentStreak += 1;
        if (currentStats.currentStreak > currentStats.longestStreak) {
          currentStats.longestStreak = currentStats.currentStreak;
        }

        if (breakdown.isNewBestScore) {
          currentStats.bestScores[s.difficulty.id] = breakdown.totalScore;
        }
        if (breakdown.isNewBestTime) {
          currentStats.bestTimes[s.difficulty.id] = finalTime;
        }
        const currentFewestMoves = currentStats.fewestMoves[s.difficulty.id] || 0;
        if (currentFewestMoves === 0 || newMoves < currentFewestMoves) {
          currentStats.fewestMoves[s.difficulty.id] = newMoves;
        }

        // Save daily challenge completion if in daily mode
        if (s.gameMode === 'daily') {
          const daily = getDailyChallengeInfo();
          currentStats.dailyChallengeCompletions[daily.dateString] = {
            score: breakdown.totalScore,
            time: finalTime,
            moves: newMoves,
            completedAt: new Date().toISOString(),
          };
        }

        saveStatistics(currentStats);

        // Check completion achievements
        const endAchievements = checkAchievements({
          currentAchievements,
          event: 'game_complete',
          gameMode: s.gameMode,
          difficulty: s.difficulty.id,
          moves: newMoves,
          timeSeconds: finalTime,
          pairsCount: s.difficulty.pairs,
          consecutiveStreakMax: newMaxStreak,
          stats: currentStats,
        });

        if (endAchievements.length > 0) {
          saveAchievements(currentAchievements);
          soundEngine.playAchievement();
          endAchievements.forEach(ach => s.onAchievementUnlocked?.(ach));
        }

        s.onAnnounce?.(`Game complete! Final Score: ${breakdown.totalScore}. Time: ${finalTime} seconds. Moves: ${newMoves}.`);
      }
    } else {
      // Mismatch
      soundEngine.playMismatch();
      setCurrentStreak(0);
      setMismatchedIndices([firstIdx, index]);

      // Keep cards revealed briefly so player can memorize them, then flip back
      lockTimeoutRef.current = window.setTimeout(() => {
        setCards(prev => {
          const next = [...prev];
          if (next[firstIdx]) next[firstIdx] = { ...next[firstIdx], isFlipped: false };
          if (next[index]) next[index] = { ...next[index], isFlipped: false };
          return next;
        });
        setMismatchedIndices(null);
        setFirstFlippedIndex(null);
        setIsLocked(false);
        lockTimeoutRef.current = null;
      }, 900);
    }
  }, [stopwatch]);

  /**
   * Pause the game
   */
  const pauseGame = useCallback(() => {
    if (stateRef.current.status === 'playing') {
      stopwatch.pause();
      setStatus('paused');
    }
  }, [stopwatch]);

  /**
   * Resume the game
   */
  const resumeGame = useCallback(() => {
    if (stateRef.current.status === 'paused') {
      stopwatch.resume();
      setStatus('playing');
    }
  }, [stopwatch]);

  /**
   * Reset current game board
   */
  const quitToMenu = useCallback(() => {
    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
    const s = stateRef.current;
    startNewGame(s.gameMode, s.difficulty, s.themeId);
  }, [startNewGame]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current !== null) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  return {
    gameMode,
    difficulty,
    themeId,
    cards,
    status,
    moves,
    matchedPairsCount: matchedIndices.length / 2,
    totalPairs: difficulty.pairs,
    currentStreak,
    maxStreak,
    stopwatch,
    scoreBreakdown,
    mismatchedIndices,
    startNewGame,
    handleCardClick,
    pauseGame,
    resumeGame,
    quitToMenu,
    setDifficulty,
    setThemeId,
  };
}
