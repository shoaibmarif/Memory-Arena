import React from 'react';
import { Link } from 'react-router-dom';
import { GameScreen } from '../components/game/GameScreen';
import { GamePage } from '../components/game/GamePage';
import { DECK_PAGES } from '../data/deckPages';
import { DECKS, type DeckId } from '../data/decks';

const COPY: Record<string, { title: string; body: string[] }> = {
  animals: {
    title: 'Match the animals',
    body: [
      'Foxes, pandas, owls, octopuses and two dozen more. The animal deck is our most popular for a reason: the pictures are bright, different from each other and easy to name, which makes them easier to remember.',
      'Try saying each animal as it turns over. It sounds silly, but turning a picture into a word gives your memory a second way to hold on to it.',
    ],
  },
  smileys: {
    title: 'Match the smileys',
    body: [
      'Faces are surprisingly tricky. Grinning, laughing and starstruck smileys look alike at a glance, so you have to pay attention to the details. Ghosts, robots and aliens keep things lively.',
      'Group similar faces in your head: all the happy ones, all the spooky ones. Knowing which family a card belongs to narrows down where its partner can be.',
    ],
  },
  food: {
    title: 'Match the snacks',
    body: [
      'Pizza, doughnuts, sushi, strawberries and a chilli pepper for good measure. The food deck is colourful and easy to tell apart, which makes it a good one for longer boards.',
      'Sort the cards as you go: sweet things, fruit, fast food. It’s a simple version of chunking, one of the most useful memory tricks there is.',
    ],
  },
  space: {
    title: 'Match the planets',
    body: [
      'Rockets, ringed planets, moons in different phases, comets and satellites. The space deck is the hardest of the four: several of the moons look very similar.',
      'Watch the moon phases closely. A full moon and a new moon are easy to tell apart, but the crescent and the half moon are closer than they look.',
    ],
  },
};

export const DeckPage: React.FC<{ path: string }> = ({ path }) => {
  const deck: DeckId = DECK_PAGES[path];
  const copy = COPY[deck];
  const d = DECKS[deck];
  return (
    <GamePage path={path} game={<GameScreen key={path} mode="classic" title={copy.title} fixedDeck={deck} />}>
      <section className="prose-arena">
        <h2>
          The {d.name.toLowerCase()} deck {d.icon}
        </h2>
        {copy.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="my-6 flex flex-wrap gap-2" aria-label={`Every card in the ${d.name} deck`}>
          {d.symbols.map((s) => (
            <span key={s} className="flex h-12 w-10 items-center justify-center rounded-xl border border-rim bg-panel text-2xl" aria-hidden="true">
              {s}
            </span>
          ))}
        </div>
        <p>
          Each board uses a random selection of these {d.symbols.length} pictures, each one twice, so no two games are the same. Want a
          different challenge? Try the same deck in <Link to="/survival">Survival</Link> or <Link to="/time-attack">Time Attack</Link>.
        </p>
      </section>
    </GamePage>
  );
};
