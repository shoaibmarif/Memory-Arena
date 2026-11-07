import React from 'react';
import { Link } from 'react-router-dom';
import { GameScreen } from '../components/game/GameScreen';
import { GamePage } from '../components/game/GamePage';

export const Kids: React.FC = () => (
  <GamePage path="/memory-game-for-kids" game={<GameScreen mode="zen" title="Find the matching animals" fixedDeck="animals" sizes={['mini', 'easy']} />}>
    <section className="prose-arena">
      <h2>A gentle first memory game</h2>
      <p>
        This page uses our calmest rules: no clock, no score and no losing. The board starts small, with just six pairs of animals, and
        the cards are big enough for little fingers. When that gets easy, switch to the 4 × 4 board.
      </p>
      <h2>Tips for playing together</h2>
      <ul>
        <li>Take turns. Whoever finds a pair goes again, just like the card game.</li>
        <li>Say the animal out loud when a card turns over: “fox!”, “owl!”. Naming things helps everyone remember.</li>
        <li>Use Peek if it’s getting frustrating. It shows every card for a moment and costs nothing here.</li>
        <li>Turn the sound off in Settings for quiet time, or turn on Reduce motion for a calmer screen.</li>
      </ul>
      <p>
        Memory Arena has no ads, no chat and no sign-up, and nothing is uploaded. There’s more about that in our{' '}
        <Link to="/privacy">privacy policy</Link>.
      </p>
    </section>
  </GamePage>
);
