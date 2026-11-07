import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { SITE } from '../seo/site';

export const About: React.FC = () => (
  <ContentPage path="/about" eyebrow="The story" intro="Memory Arena takes the card game everyone played as a kid and gives it a bit of a stage: modes, ranks, a daily board and a lot of neon.">
    <div className="prose-arena">
      <h2>Why it exists</h2>
      <p>
        Most online memory games are the same grid of cards with a timer. That’s fine for five minutes. We wanted something you’d come back
        to: a reason to try one more board, a way to see yourself improving, and a daily puzzle to share with friends.
      </p>

      <h2>What’s different</h2>
      <ul>
        <li>Five modes, including Survival, where only real memory mistakes cost you.</li>
        <li>A Daily Arena with the same board for everyone.</li>
        <li>Combos, stars based on the maths of a perfect game, and a heatmap of where your memory slipped.</li>
        <li>Seven decks, ranks from Rookie to Legend, and achievements to collect.</li>
        <li>No account, no ads, no paywall. Your progress stays in your browser.</li>
        <li>Fully playable with a keyboard or screen reader, in light or dark.</li>
      </ul>

      <h2>Who makes it</h2>
      <p>
        Memory Arena is built by{' '}
        <a href={SITE.author.url} target="_blank" rel="noopener noreferrer">
          {SITE.author.name}
        </a>
        , a web developer who enjoys making small things feel polished. It’s built with React and TypeScript, and the code is open on{' '}
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
      <ul>
        <li>
          Portfolio:{' '}
          <a href={SITE.author.url} target="_blank" rel="noopener noreferrer">
            shoaibarif.vercel.app
          </a>
        </li>
        <li>
          LinkedIn:{' '}
          <a href={SITE.author.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin.com/in/shoaibmarif
          </a>
        </li>
        <li>
          GitHub:{' '}
          <a href={SITE.author.github} target="_blank" rel="noopener noreferrer">
            github.com/shoaibmarif
          </a>
        </li>
      </ul>

      <h2>Credits</h2>
      <p>
        Card pictures are standard emoji, so they look slightly different on each device. Fonts are Unbounded, Manrope and Space Mono
        from Google Fonts. The “1.61 moves per pair” figure comes from Daniel Velleman and Gregory Warrington’s 2013 paper <em>What to
        Expect in a Game of Memory</em>.
      </p>
      <p>
        Found a bug or have an idea for a deck? <Link to="/contact">Get in touch</Link>.
      </p>
    </div>
  </ContentPage>
);
