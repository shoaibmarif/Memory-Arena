import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { SIZES } from '../game/engine';
import { ACHIEVEMENTS } from '../game/progress';

export const HowToPlay: React.FC = () => (
  <ContentPage path="/how-to-play" eyebrow="The rules" intro="You can learn Memory Arena in about thirty seconds. Here’s everything else: the modes, how scores work, and a few things the game doesn’t tell you.">
    <div className="prose-arena">
      <h2>The basics</h2>
      <p>
        The board is a grid of face-down cards, and every picture appears on exactly two of them. Turn over two cards per move. If they
        match, they stay face up. If they don’t, they flip back after a moment, or straight away if you tap another card. Find every
        pair to clear the board.
      </p>

      <h2>Board sizes</h2>
      <ul>
        {(['easy', 'medium', 'hard'] as const).map((id) => (
          <li key={id}>
            <strong>{SIZES[id].label}</strong>: {SIZES[id].cols} × {SIZES[id].rows}, {SIZES[id].pairs} pairs.
          </li>
        ))}
      </ul>
      <p>The kids page also has a Mini board: 4 × 3 with 6 pairs.</p>

      <h2>The five modes</h2>
      <ul>
        <li>
          <Link to="/">Classic</Link>: the standard game, with a score and one Peek.
        </li>
        <li>
          <Link to="/daily">Daily Arena</Link>: the same 5 × 4 board for everyone, once a day. One scored run, and a streak for every
          day in a row.
        </li>
        <li>
          <Link to="/time-attack">Time Attack</Link>: a countdown clock that gains four seconds for every pair.
        </li>
        <li>
          <Link to="/survival">Survival</Link>: a quick look at the whole board, then three hearts. Every slip costs one.
        </li>
        <li>
          <Link to="/zen">Zen</Link>: no clock, no score, unlimited free peeks.
        </li>
      </ul>

      <h2>Scoring</h2>
      <ul>
        <li>
          <strong>Pairs and combos.</strong> A pair is worth 100 points times your combo. Find pairs in a row and the combo climbs to
          ×2, ×3 and up to ×5. Any miss resets it.
        </li>
        <li>
          <strong>Speed bonus.</strong> In Classic and the Daily Arena, finishing under the target time earns 5 points per second saved.
          In Time Attack, every second left on the clock is worth 10.
        </li>
        <li>
          <strong>No slips bonus.</strong> Clear a board without a single slip for 50 points per pair.
        </li>
        <li>
          <strong>Peek.</strong> Shows every card for just over a second. It costs 150 points, except in Zen where it’s free.
        </li>
      </ul>

      <h2>Slips</h2>
      <p>
        Not every miss is a mistake. When you turn over a card you’ve never seen, you can’t know where its partner is, so a miss is just
        bad luck. A <strong>slip</strong> is different: you picked a card you’d already seen and it was wrong, or you already knew where
        the partner was and went somewhere else. Slips are what Survival punishes, and avoiding them is what earns the bonus.
      </p>

      <h2>Stars</h2>
      <p>
        Stars compare your moves with the board size. Someone with a perfect memory needs about 1.61 moves per pair on average, because
        they still have to turn over unknown cards. Stay at or under 1.75 moves per pair for three stars, and under 2.4 for two.
      </p>

      <h2>Ranks, XP and achievements</h2>
      <p>
        Every game earns XP, even ones you lose: your score in scored modes, and 20 XP per pair in Zen. XP moves you up the ranks, from
        Rookie to Legend. There are also {ACHIEVEMENTS.length} achievements to collect, from your first pair to winning Survival without losing a heart.
        You’ll find them on your <Link to="/profile">profile</Link>.
      </p>

      <h2>Keyboard controls</h2>
      <p>
        The game works fully without a mouse. Press <kbd>Tab</kbd> to reach the board, use the <kbd>arrow keys</kbd> to move between
        cards and <kbd>Enter</kbd> or <kbd>Space</kbd> to turn one over. Screen readers announce each card and every match.
      </p>
      <p>
        Ready? <Link to="/">Start a game</Link>, or read some <Link to="/memory-tips">memory tips</Link> first.
      </p>
    </div>
  </ContentPage>
);
