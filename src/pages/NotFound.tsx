import React from 'react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/seo/SeoMeta';

export const NotFound: React.FC = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
    <SeoMeta canonicalPath="/404" title="Page not found" description="This page doesn’t exist." noindex />
    <div className="flex gap-3" aria-hidden="true">
      <span className="flex h-28 w-20 -rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-glow to-violet-glow text-5xl shadow-lg">4</span>
      <span className="flex h-28 w-20 items-center justify-center rounded-2xl border-2 border-rim bg-panel text-5xl">🤔</span>
      <span className="flex h-28 w-20 rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-glow to-lime-glow text-5xl shadow-lg">4</span>
    </div>
    <h1 className="mt-10 text-3xl font-extrabold">No match for this page</h1>
    <p className="mt-3 text-lg text-ink-2">It doesn’t exist, or it moved. The arena is still open, though.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/" className="btn btn-glow">
        Play a game
      </Link>
      <Link to="/daily" className="btn btn-ghost">
        Today’s board
      </Link>
    </div>
  </div>
);
