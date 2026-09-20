import { useState, useCallback, useRef, useEffect } from 'react';
import type { Card, DifficultyConfig, GameMode, GameStatus, ScoreBreakdown, ThemeId } from '../types/game';
import { DIFFICULTIES } from '../game/difficulty';
import { generateCards } from '../game/cardGenerator';
import { getDailyChallengeInfo } from '../game/dailyChallenge';
import { calculateScore } from '../utils/score';
import { soundEngine } from '../utils/sound';
import { useTimer } from './useTimer';
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

  // Board state - initialize directly so the game is ready on page load
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

  // Status & gameplay metrics - starts directly in playing state
  const [status, setStatus] = useState<GameStatus>('playing');
  const [moves, setMoves] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);

  // Timer
  const timer = useTimer();

  // Keep track of timeouts for clean unmounting / restarts
  const lockTimeoutRef = useRef<number | null>(null);

  /**
   * Initializes or restarts the game
   */
  const startNewGame = useCallback((
    mode: GameMode = gameMode,
    diff: DifficultyConfig = difficulty,
    theme: ThemeId = themeId
  ) => {
    // Clear any active timeouts
    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }

    setGameMode(mode);
    setDifficulty(diff);
    setThemeId(theme);

    let generated: Card[];
    if (mode === 'daily') {
      const daily = getDailyChallengeInfo();
      generated = generateCards({
        pairsCount: diff.pairs,
        themeId: daily.themeId,
        seed: daily.seed,
      });
      setThemeId(daily.themeId);
    } else {
      generated = generateCards({
        pairsCount: diff.pairs,
        themeId: theme,
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
    timer.reset();
    setStatus('playing');

    onAnnounce?.(`Game started. ${diff.name} difficulty, ${diff.pairs} pairs.`);
  }, [gameMode, difficulty, themeId, timer, onAnnounce]);

  /**
   * Card click handler with strict anti-cheating & integrity checks
   */
  const handleCardClick = useCallback((index: number) => {
    // Guards:
    if (status !== 'playing') return;
    if (isLocked) return;
    if (index === firstFlippedIndex) return; // Cannot click same card twice
    const card = cards[index];
    if (!card || card.isMatched || card.isFlipped) return; // Cannot click already matched or flipped card

    // Start timer & record game played on the first card flip of the game
    if (!timer.isActive && moves === 0 && firstFlippedIndex === null) {
      timer.start();
      const stats = getStatistics();
      stats.gamesPlayed += 1;
      saveStatistics(stats);
    }

    // Play card flip sound
    soundEngine.playCardFlip();

    // First card of a turn
    if (firstFlippedIndex === null) {
      setFirstFlippedIndex(index);
      setCards(prev => {
        const next = [...prev];
        next[index] = { ...next[index], isFlipped: true };
        return next;
      });
      return;
    }

    // Second card of a turn
    setCards(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isFlipped: true };
      return next;
    });

    const newMoves = moves + 1;
    setMoves(newMoves);
    setIsLocked(true);

    const firstCard = cards[firstFlippedIndex];
    const isMatch = firstCard.pairId === card.pairId;

    if (isMatch) {
      // Successful match
      soundEngine.playMatch();
      const newMatched = [...matchedIndices, firstFlippedIndex, index];
      setMatchedIndices(newMatched);

      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > maxStreak) {
        setMaxStreak(nextStreak);
      }

      setCards(prev => {
        const next = [...prev];
        next[firstFlippedIndex] = { ...next[firstFlippedIndex], isMatched: true };
        next[index] = { ...next[index], isMatched: true };
        return next;
      });

      const pairsFound = newMatched.length / 2;
      const totalPairs = difficulty.pairs;
      onAnnounce?.(`Match found! Pair ${pairsFound} of ${totalPairs}.`);

      // Check achievement for match
      const currentAchievements = getAchievements();
      const stats = getStatistics();
      const unlocked = checkAchievements({
        currentAchievements,
        event: 'card_match',
        gameMode,
        difficulty: difficulty.id,
        moves: newMoves,
        timeSeconds: timer.seconds,
        pairsCount: difficulty.pairs,
        consecutiveStreakMax: nextStreak,
        stats,
      });

      if (unlocked.length > 0) {
        saveAchievements(currentAchievements);
        soundEngine.playAchievement();
        unlocked.forEach(ach => onAchievementUnlocked?.(ach));
      }

      // Reset turn pointers
      setFirstFlippedIndex(null);
      setIsLocked(false);

      // Check for Game Completion!
      if (pairsFound === totalPairs) {
        const finalTime = timer.stop();
        setStatus('completed');
        soundEngine.playVictory();

        // Calculate final score
        const currentStats = getStatistics();
        const bestScoreCurrent = currentStats.bestScores[difficulty.id] || 0;
        const bestTimeCurrent = currentStats.bestTimes[difficulty.id] || 0;

        const breakdown = calculateScore({
          difficulty,
          moves: newMoves,
          timeSeconds: finalTime,
          consecutiveStreakMax: Math.max(nextStreak, maxStreak),
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
          currentStats.bestScores[difficulty.id] = breakdown.totalScore;
        }
        if (breakdown.isNewBestTime) {
          currentStats.bestTimes[difficulty.id] = finalTime;
        }
        const currentFewestMoves = currentStats.fewestMoves[difficulty.id] || 0;
        if (currentFewestMoves === 0 || newMoves < currentFewestMoves) {
          currentStats.fewestMoves[difficulty.id] = newMoves;
        }

        // Save daily challenge completion if in daily mode
        if (gameMode === 'daily') {
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
          gameMode,
          difficulty: difficulty.id,
          moves: newMoves,
          timeSeconds: finalTime,
          pairsCount: difficulty.pairs,
          consecutiveStreakMax: Math.max(nextStreak, maxStreak),
          stats: currentStats,
        });

        if (endAchievements.length > 0) {
          saveAchievements(currentAchievements);
          soundEngine.playAchievement();
          endAchievements.forEach(ach => onAchievementUnlocked?.(ach));
        }

        onAnnounce?.(`Game complete! Final Score: ${breakdown.totalScore}. Time: ${finalTime} seconds. Moves: ${newMoves}.`);
      }
    } else {
      // Mismatch
      soundEngine.playMismatch();
      setCurrentStreak(0);
      setMismatchedIndices([firstFlippedIndex, index]);

      // Keep cards revealed briefly so player can memorize them, then flip back
      lockTimeoutRef.current = window.setTimeout(() => {
        setCards(prev => {
          const next = [...prev];
          if (next[firstFlippedIndex]) next[firstFlippedIndex] = { ...next[firstFlippedIndex], isFlipped: false };
          if (next[index]) next[index] = { ...next[index], isFlipped: false };
          return next;
        });
        setMismatchedIndices(null);
        setFirstFlippedIndex(null);
        setIsLocked(false);
        lockTimeoutRef.current = null;
      }, 900);
    }
  }, [
    status,
    isLocked,
    firstFlippedIndex,
    cards,
    moves,
    matchedIndices,
    currentStreak,
    maxStreak,
    difficulty,
    timer,
    gameMode,
    onAchievementUnlocked,
    onAnnounce,
  ]);

  /**
   * Pause the game
   */
  const pauseGame = useCallback(() => {
    if (status === 'playing') {
      timer.pause();
      setStatus('paused');
    }
  }, [status, timer]);

  /**
   * Resume the game
   */
  const resumeGame = useCallback(() => {
    if (status === 'paused') {
      timer.resume();
      setStatus('playing');
    }
  }, [status, timer]);

  /**
   * Reset / restart current game board
   */
  const quitToMenu = useCallback(() => {
    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
    startNewGame(gameMode, difficulty, themeId);
  }, [gameMode, difficulty, themeId, startNewGame]);

  // Clean up timer/timeout on unmount
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
    timer,
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
