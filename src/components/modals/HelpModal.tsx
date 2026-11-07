import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';

const STEPS = [
  { icon: '👆', title: 'Turn over two cards', body: 'If they show the same picture, they stay face up. If not, they flip back.' },
  { icon: '🧠', title: 'Remember what you saw', body: 'Every card you’ve seen is a clue. Use it to find its partner later.' },
  { icon: '🔥', title: 'Chain pairs for combos', body: 'Pairs in a row multiply your points, up to ×5. A miss resets the combo.' },
  { icon: '⭐', title: 'Clear the board', body: 'Fewer moves means more stars. Three stars is close to perfect memory.' },
];

export const HelpModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="How to play" subtitle="Match every pair. That’s the whole game.">
    <ol className="space-y-4">
      {STEPS.map((s) => (
        <li key={s.title} className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stage-2 text-2xl" aria-hidden="true">
            {s.icon}
          </span>
          <span>
            <span className="block font-bold">{s.title}</span>
            <span className="block text-sm leading-6 text-ink-2">{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
    <p className="mt-5 rounded-2xl bg-stage-2/70 p-3 text-sm leading-6 text-ink-2">
      <strong className="text-ink">Slips:</strong> picking a card you’ve already seen, when it’s the wrong one, is a slip. Slips cost hearts in Survival. Turning over a card you haven’t seen yet is never a slip.
    </p>
    <p className="mt-4 text-sm text-ink-2">
      More detail in the{' '}
      <Link to="/how-to-play" onClick={onClose} className="font-bold text-cyan underline underline-offset-2">
        full guide
      </Link>{' '}
      and some{' '}
      <Link to="/memory-tips" onClick={onClose} className="font-bold text-cyan underline underline-offset-2">
        memory tips
      </Link>
      .
    </p>
    <button type="button" className="btn btn-glow mt-5 w-full" onClick={onClose}>
      Let’s play
    </button>
  </Modal>
);
