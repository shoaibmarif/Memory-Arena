import React from 'react';
import { Link } from 'react-router-dom';
import { GameScreen } from '../components/game/GameScreen';
import { GamePage } from '../components/game/GamePage';
import type { ModeId } from '../game/engine';

type PageMode = Extract<ModeId, 'time-attack' | 'survival' | 'zen'>;

const COPY: Record<PageMode, { title: string; content: React.ReactNode }> = {
  'time-attack': {
    title: 'Beat the clock',
    content: (
      <>
        <h2>The clock is the opponent</h2>
        <p>
          You start with 45 seconds on a Small board, 70 on Medium and 150 on Large, and every pair you find adds four more. The clock
          only starts when you turn your first card, so take a breath first.
        </p>
        <p>
          Run out of time and the game ends, but you still earn XP for the pairs you found. Finish with time to spare and every second
          left is worth 10 points. Finish with 30 seconds or more and you unlock the <em>Time to spare</em> achievement.
        </p>
        <h2>How to get faster</h2>
        <ul>
          <li>Don’t stop to think after a miss. Tapping a third card closes the last pair straight away.</li>
          <li>Sweep the board in rows. Random tapping makes positions much harder to remember.</li>
          <li>
            Small combos add up. Two pairs in a row is worth 300 points, five in a row is worth 1,500. More ideas in{' '}
            <Link to="/memory-tips">memory tips</Link>.
          </li>
        </ul>
      </>
    ),
  },
  survival: {
    title: 'Three hearts, no excuses',
    content: (
      <>
        <h2>See it, then remember it</h2>
        <p>
          Survival starts by showing you the whole board for two and a half seconds. After that, every card counts as one you’ve seen.
          You have three hearts, and every slip costs one.
        </p>
        <p>
          A slip is a mistake you had the information to avoid: picking a card you’ve already seen that isn’t the match, or missing a
          partner whose spot you already knew. Lose all three hearts and the run is over.
        </p>
        <h2>Surviving longer</h2>
        <ul>
          <li>During the preview, don’t try to memorise everything. Lock in three or four pairs and go for them first.</li>
          <li>Say the pictures in your head as they flash past. Words stick better than images alone.</li>
          <li>
            Win without losing a heart and you earn the <em>Untouchable</em> achievement. More tricks in{' '}
            <Link to="/memory-tips">memory tips</Link>.
          </li>
        </ul>
      </>
    ),
  },
  zen: {
    title: 'No clock, no score',
    content: (
      <>
        <h2>Just the cards</h2>
        <p>
          Zen mode takes away everything that makes the other modes stressful. There’s no timer, no score and no penalty for a miss. Use
          Peek as often as you like to see every card for a moment.
        </p>
        <p>
          It’s a good way to unwind, to learn a new deck, or to play with someone who’s new to memory games. You still earn 20 XP for
          every pair, so your rank keeps climbing.
        </p>
        <p>
          Playing with children? The <Link to="/memory-game-for-kids">memory game for kids</Link> uses the same calm rules with a smaller
          board.
        </p>
      </>
    ),
  },
};

const PATHS: Record<PageMode, string> = { 'time-attack': '/time-attack', survival: '/survival', zen: '/zen' };

export const ModePage: React.FC<{ mode: PageMode }> = ({ mode }) => (
  <GamePage path={PATHS[mode]} game={<GameScreen key={mode} mode={mode} title={COPY[mode].title} />}>
    <section className="prose-arena">{COPY[mode].content}</section>
  </GamePage>
);
