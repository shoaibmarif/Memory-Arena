import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { Logo } from './Logo';
import { DECK_LINKS, INFO_LINKS, LEARN_LINKS, MODE_LINKS } from './nav';
import { SITE } from '../../seo/site';
import { openConsentSettings } from '../../lib/consent';

const Column: React.FC<{ title: string; color: string; links: { to: string; label: string }[] }> = ({ title, color, links }) => (
  <div>
    <h2 className="eyebrow mb-3 flex items-center gap-2">
      <span className="h-1.5 w-4 rounded-full" style={{ background: color }} aria-hidden="true" />
      {title}
    </h2>
    <ul className="space-y-2 text-[15px]">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="text-ink-2 transition-colors hover:text-pink">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: React.FC = () => (
  <footer className="relative mt-24 border-t border-rim bg-stage-2/60">
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink-glow to-transparent" aria-hidden="true" />
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(4,1fr)]">
      <div className="max-w-xs">
        <Logo />
        <p className="mt-4 text-[15px] leading-7 text-ink-2">
          A memory card game with a daily board, five ways to play and ranks to climb. Free, no account, and your progress stays on your device.
        </p>
        <div className="mt-4 flex gap-2">
          {[
            { href: SITE.repo, label: 'Source code on GitHub', icon: <Github className="h-4 w-4" /> },
            { href: SITE.author.linkedin, label: 'Shoaib Arif on LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
            { href: `mailto:${SITE.author.email}`, label: 'Send an email', icon: <Mail className="h-4 w-4" /> },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rim bg-panel text-ink transition-[transform,color] hover:-translate-y-0.5 hover:text-pink"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <Column title="Play" color="var(--color-pink-glow)" links={MODE_LINKS} />
      <Column title="Decks" color="var(--color-cyan-glow)" links={DECK_LINKS} />
      <Column title="Learn" color="var(--color-lime-glow)" links={LEARN_LINKS} />
      <Column title="Arena" color="var(--color-amber-glow)" links={INFO_LINKS} />
    </div>
    <div className="border-t border-rim">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} Memory Arena. Made by{' '}
          <a href={SITE.author.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-2 hover:text-pink">
            {SITE.author.name}
          </a>
          .
        </p>
        <button type="button" onClick={openConsentSettings} className="self-start text-left hover:text-ink sm:self-auto">
          Cookie settings
        </button>
      </div>
    </div>
  </footer>
);
