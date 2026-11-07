import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { rankFor } from '../../game/progress';

/** Rank emblem and XP progress, linking to the profile. */
export const RankChip: React.FC = () => {
  const { profile } = useApp();
  const { rank, next, progress } = rankFor(profile.xp);
  return (
    <Link
      to="/profile"
      className="chip !h-10 gap-2 !pl-1.5 !pr-3 hover:!border-muted"
      title={next ? `${profile.xp.toLocaleString('en-US')} XP · ${(next.min - profile.xp).toLocaleString('en-US')} to ${next.name}` : `${profile.xp.toLocaleString('en-US')} XP`}
      aria-label={`Your rank: ${rank.name}. View profile`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ background: `${rank.color}33`, color: rank.color }} aria-hidden="true">
        {rank.emblem}
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="text-[0.78rem] font-extrabold text-ink">{rank.name}</span>
        <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-stage-2">
          <span className="block h-full rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: rank.color }} />
        </span>
      </span>
    </Link>
  );
};
