import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';

const TIPS = [
  {
    n: '01',
    color: 'var(--color-pink-glow)',
    title: 'Say it, don’t just see it',
    body: 'When a card turns over, name it in your head: “fox, top left”. Turning a picture into words gives your memory two ways to hold on to it instead of one. It’s the single biggest improvement most players can make.',
  },
  {
    n: '02',
    color: 'var(--color-cyan-glow)',
    title: 'Sweep the board in order',
    body: 'Random tapping scatters what you know across the grid. Work through unknown cards row by row instead, so the cards you’ve seen form a neat region you can picture as a block.',
  },
  {
    n: '03',
    color: 'var(--color-lime-glow)',
    title: 'Turn the unknown card first',
    body: 'When you know one card but not its partner, turn over a new card first. If it matches something you remember, you get a free pair. If you’d turned the known card first, you’d have wasted that chance.',
  },
  {
    n: '04',
    color: 'var(--color-amber-glow)',
    title: 'Chunk the board',
    body: 'Most people can hold only a handful of separate items in mind at once. Split the grid into corners or rows and remember “the top row has two animals and a ghost” rather than every position separately.',
  },
  {
    n: '05',
    color: 'var(--color-violet-glow)',
    title: 'Build a memory palace',
    body: 'The method of loci is an old trick: link each position to a familiar place, like rooms in your home. The top left corner is your front door, so the octopus there is “an octopus answering the door”. Silly pictures stick.',
  },
  {
    n: '06',
    color: 'var(--color-pink-glow)',
    title: 'Clear the pairs you know first',
    body: 'The moment you know where both halves of a pair are, take them. Every pair you clear is one less thing to remember, and it keeps your combo alive.',
  },
];

export const MemoryTips: React.FC = () => (
  <ContentPage
    path="/memory-tips"
    eyebrow="Get better"
    intro="Being good at memory games is less about having a great memory and more about using the one you have well. These six habits make a real difference, and they work in everyday life too."
    wide
  >
    <ol className="grid gap-4 sm:grid-cols-2">
      {TIPS.map((t) => (
        <li key={t.n} className="panel relative overflow-hidden !rounded-2xl p-6">
          <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ background: t.color }} aria-hidden="true" />
          <span className="font-mono text-sm font-bold" style={{ color: t.color }}>
            {t.n}
          </span>
          <h2 className="mt-2 text-lg font-bold">{t.title}</h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-2">{t.body}</p>
        </li>
      ))}
    </ol>

    <div className="prose-arena mx-auto mt-14 max-w-3xl">
      <h2>Why tip three works</h2>
      <p>
        Imagine you know where one fox is, but not the other. If you turn the fox first, your second card is a blind guess, and a miss
        tells you only one new card. Turn an unknown card first instead: if it happens to match a card you remember, you take that pair.
        If not, you’ve learned a new card and can still go for the fox next turn. It’s the same reasoning behind the mathematically best
        strategy, which needs about 1.61 moves per pair on average.
      </p>

      <h2>Practise without pressure</h2>
      <p>
        Try one tip at a time in <Link to="/zen">Zen mode</Link>, where there’s no clock or score. When it starts to feel natural, take it
        into <Link to="/survival">Survival</Link>, where every slip costs a heart, and see how far you get.
      </p>

      <h2>A word on “brain training”</h2>
      <p>
        Memory games are a fun way to practise focus, and you’ll definitely get better at memory games by playing them. Research is much
        less clear on whether that carries over to other tasks, so we won’t promise you a better brain. We will promise a good few minutes.
      </p>
    </div>
  </ContentPage>
);
