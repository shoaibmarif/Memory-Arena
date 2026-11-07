import { SIZES, type ArenaState, type FinalScore, type ModeId } from './engine';
import { DECKS } from '../data/decks';
import { SITE } from '../seo/site';
import { formatClock } from './daily';

const MODE_NAMES: Record<ModeId, string> = { classic: 'Classic', daily: 'Daily Arena', zen: 'Zen', 'time-attack': 'Time Attack', survival: 'Survival' };
const PATHS: Record<ModeId, string> = { classic: '', daily: '/daily', zen: '/zen', 'time-attack': '/time-attack', survival: '/survival' };

/** A short summary to share, e.g. "Memory Arena · Daily Arena #12" with stars, moves and time. */
export function shareText(s: ArenaState, score: FinalScore, dailyNumber?: number): string {
  const board = SIZES[s.size];
  const title = s.mode === 'daily' && dailyNumber ? `${SITE.name} · Daily Arena #${dailyNumber}` : `${SITE.name} · ${MODE_NAMES[s.mode]}`;
  const won = s.status === 'won';
  const stars = won ? '⭐'.repeat(score.stars) + '☆'.repeat(3 - score.stars) : '💔';
  const details = [
    `${board.cols}×${board.rows} ${DECKS[s.deck].icon}`,
    `${s.moves} moves`,
    formatClock(s.elapsed),
    ...(s.mode === 'zen' ? [] : [`${score.total.toLocaleString('en-US')} pts`]),
  ].join(' · ');
  const extra = s.mode === 'survival' && won ? `\n${'❤️'.repeat(s.lives ?? 0)}${'🖤'.repeat(3 - (s.lives ?? 0))}` : '';
  return `${title}\n${stars} ${details}${extra}\n${SITE.url}${PATHS[s.mode]}`;
}

export async function shareResult(s: ArenaState, score: FinalScore, dailyNumber?: number): Promise<{ ok: boolean; method: string; message: string }> {
  const text = shareText(s, score, dailyNumber);
  if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
    try {
      await navigator.share({ text });
      return { ok: true, method: 'share_sheet', message: 'Shared' };
    } catch (err) {
      if ((err as Error).name === 'AbortError') return { ok: false, method: '', message: '' };
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, method: 'clipboard', message: 'Copied to clipboard' };
  } catch {
    return { ok: false, method: '', message: 'Couldn’t copy, sorry' };
  }
}
