import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MISMATCH_MS,
  MODES,
  PEEK_MS,
  endPeek,
  endPreview,
  finalScore,
  flip as flipCard,
  hideMismatch,
  newGame,
  pause as pauseGame,
  resume as resumeGame,
  startPeek,
  tick,
  type ArenaState,
  type FinalScore,
  type ModeId,
  type SizeId,
} from '../game/engine';
import type { DeckId } from '../data/decks';
import { soundEngine } from '../utils/sound';

interface UseArenaOptions {
  mode: ModeId;
  size: SizeId;
  deck: DeckId;
  seed?: number;
  /** Called once when a game is won or lost. */
  onFinish?: (state: ArenaState, score: FinalScore) => void;
}

export function useArena({ mode, size, deck, seed, onFinish }: UseArenaOptions) {
  const [state, setState] = useState<ArenaState>(() => newGame({ mode, size, deck, seed }));
  const [round, setRound] = useState(0);
  const hideTimer = useRef<number | undefined>(undefined);
  const peekTimer = useRef<number | undefined>(undefined);
  const finished = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const clearTimers = () => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(peekTimer.current);
  };

  // A new board whenever the setup changes or the player restarts.
  useEffect(() => {
    clearTimers();
    finished.current = false;
    setState(newGame({ mode, size, deck, seed }));
  }, [mode, size, deck, seed, round]);

  useEffect(() => () => clearTimers(), []);

  // The clock.
  const running = state.status === 'playing' && !state.peeking;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setState((s) => tick(s)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Survival shows the board first.
  useEffect(() => {
    if (state.status !== 'preview') return;
    const id = window.setTimeout(() => setState((s) => endPreview(s)), MODES[state.mode].preview);
    return () => window.clearTimeout(id);
  }, [state.status, state.mode]);

  // Pause when the tab is hidden, so the clock never runs while you're away.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) setState((s) => pauseGame(s));
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  // Sounds for matches and misses.
  const lastSeq = useRef(0);
  useEffect(() => {
    const e = state.event;
    if (!e || e.seq === lastSeq.current) return;
    lastSeq.current = e.seq;
    if (e.kind === 'match') soundEngine.playMatch();
    else soundEngine.playMismatch();
  }, [state.event]);

  // Finish once.
  useEffect(() => {
    if ((state.status === 'won' || state.status === 'lost') && !finished.current) {
      finished.current = true;
      clearTimers();
      if (state.status === 'won') soundEngine.playVictory();
      onFinishRef.current?.(state, finalScore(state));
    }
  }, [state]);

  // The latest state, so event handlers can decide what to do without side
  // effects inside a state updater.
  const live = useRef(state);
  live.current = state;
  const commit = (next: ArenaState) => {
    live.current = next;
    setState(next);
  };

  const flip = useCallback((index: number) => {
    const s = live.current;
    const next = flipCard(s, index);
    if (next === s) return;
    soundEngine.playCardFlip();
    window.clearTimeout(hideTimer.current);
    if (next.open.length === 2) {
      hideTimer.current = window.setTimeout(() => setState((x) => hideMismatch(x)), MISMATCH_MS);
    }
    commit(next);
  }, []);

  const peek = useCallback(() => {
    const s = live.current;
    const next = startPeek(s);
    if (next === s) return;
    window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => setState((x) => endPeek(x)), PEEK_MS);
    commit(next);
  }, []);

  const pause = useCallback(() => setState((s) => pauseGame(s)), []);
  const resume = useCallback(() => setState((s) => resumeGame(s)), []);
  const restart = useCallback(() => setRound((r) => r + 1), []);

  return { state, flip, peek, pause, resume, restart };
}
