import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, liveDailyStreak, rankFor } from '../game/progress';
import { SIZES, type ModeId, type SizeId } from '../game/engine';
import { DECKS } from '../data/decks';
import { formatClock } from '../game/daily';

const MODE_NAMES: Record<ModeId, string> = { classic: 'Classic', daily: 'Daily', 'time-attack': 'Time Attack', survival: 'Survival', zen: 'Zen' };
const BEST_MODES: ModeId[] = ['classic', 'time-attack', 'survival', 'zen'];
const BEST_SIZES: SizeId[] = ['easy', 'medium', 'hard'];

export const Profile: React.FC = () => {
  const { profile } = useApp();
  const { rank, next, progress } = rankFor(profile.xp);
  const unlocked = ACHIEVEMENTS.filter((a) => profile.achievements[a.id]).length;
  const winRate = profile.games ? Math.round((profile.wins / profile.games) * 100) : 0;
  const stats: [string, string][] = [
    ['Games', profile.games.toLocaleString('en-US')],
    ['Boards cleared', profile.wins.toLocaleString('en-US')],
    ['Win rate', `${winRate}%`],
    ['Pairs found', profile.pairs.toLocaleString('en-US')],
    ['Daily streak', String(liveDailyStreak(profile))],
    ['Best streak', String(profile.daily.bestStreak)],
  ];

  return (
    <ContentPage path="/profile" eyebrow="Saved on this device" wide>
      <section className="panel relative overflow-hidden p-6 sm:p-8" aria-label="Your rank">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: rank.color }} aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="flex h-24 w-24 items-center justify-center rounded-[28px] text-5xl" style={{ background: `${rank.color}26`, color: rank.color, boxShadow: `0 0 40px -10px ${rank.color}` }} aria-hidden="true">
            {rank.emblem}
          </span>
          <div className="min-w-[14rem] flex-1">
            <p className="eyebrow">Arena rank</p>
            <p className="font-display text-3xl font-extrabold" style={{ color: rank.color }}>
              {rank.name}
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stage-2">
              <div className="h-full rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: rank.color }} />
            </div>
            <p className="mt-2 text-sm text-ink-2">
              {profile.xp.toLocaleString('en-US')} XP
              {next ? ` · ${(next.min - profile.xp).toLocaleString('en-US')} more to ${next.name}` : ' · top of the arena'}
            </p>
          </div>
        </div>
      </section>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(([k, v]) => (
          <div key={k} className="panel !rounded-2xl p-4">
            <dt className="eyebrow !text-[0.62rem]">{k}</dt>
            <dd className="mt-1 font-display text-2xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="bests-heading">
        <h2 id="bests-heading" className="text-2xl font-extrabold">
          Personal bests
        </h2>
        <div className="panel mt-4 overflow-x-auto !rounded-2xl">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th scope="col" className="px-4 py-3 font-bold">Mode</th>
                {BEST_SIZES.map((s) => (
                  <th key={s} scope="col" className="px-4 py-3 font-bold">
                    {SIZES[s].label} <span className="font-mono font-normal">{SIZES[s].cols}×{SIZES[s].rows}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BEST_MODES.map((m) => (
                <tr key={m} className="border-t border-rim">
                  <th scope="row" className="px-4 py-3 font-bold">
                    {MODE_NAMES[m]}
                  </th>
                  {BEST_SIZES.map((s) => {
                    const b = profile.best[`${m}:${s}`];
                    return (
                      <td key={s} className="px-4 py-3 tabular-nums text-ink-2">
                        {b ? (
                          <>
                            {m !== 'zen' && <span className="block font-bold text-ink">{b.score.toLocaleString('en-US')} pts</span>}
                            <span className="text-xs">
                              {formatClock(b.time)} · {b.moves} moves
                            </span>
                          </>
                        ) : (
                          <span className="text-muted">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="ach-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="ach-heading" className="text-2xl font-extrabold">
            Achievements
          </h2>
          <span className="font-mono text-sm text-muted">
            {unlocked}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const at = profile.achievements[a.id];
            return (
              <li key={a.id} className={`panel flex items-center gap-3 !rounded-2xl p-3 ${at ? '' : 'opacity-50 grayscale'}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${at ? 'bg-gradient-to-br from-pink-glow/40 to-violet-glow/40' : 'bg-stage-2'}`} aria-hidden="true">
                  {a.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{a.title}</span>
                  <span className="block text-xs leading-5 text-ink-2">{a.description}</span>
                  {at && <span className="block text-[0.68rem] text-muted">Unlocked {new Date(at).toLocaleDateString()}</span>}
                </span>
                <span className="sr-only">{at ? 'Unlocked' : 'Locked'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-2xl font-extrabold">
          Recent games
        </h2>
        {profile.history.length === 0 ? (
          <p className="mt-4 text-ink-2">
            Nothing yet. <Link to="/" className="font-bold text-cyan underline underline-offset-2">Play your first game</Link> and it’ll show up here.
          </p>
        ) : (
          <ul className="panel mt-4 divide-y divide-rim !rounded-2xl">
            {profile.history.slice(0, 15).map((g) => (
              <li key={g.at} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                <span className="text-xl" aria-hidden="true">
                  {DECKS[g.deck]?.icon}
                </span>
                <span className="font-bold">{MODE_NAMES[g.mode]}</span>
                <span className="text-muted">
                  {SIZES[g.size].cols}×{SIZES[g.size].rows}
                </span>
                <span className="text-ink-2">
                  {g.moves} moves · {formatClock(g.time)}
                </span>
                <span className="ml-auto font-bold">
                  {g.won ? '⭐'.repeat(g.stars) : <span className="text-red">Lost</span>}
                  {g.mode !== 'zen' && <span className="ml-2 tabular-nums text-ink-2">{g.score.toLocaleString('en-US')}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ContentPage>
  );
};
