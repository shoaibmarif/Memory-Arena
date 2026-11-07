import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CircleHelp, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { RankChip } from './RankChip';
import { HEADER_LINKS, MODE_LINKS } from './nav';
import { useApp } from '../../context/AppContext';

const iconBtn = 'flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-panel hover:text-ink';

export const Header: React.FC = () => {
  const { openModal, isDark, toggleTheme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rim bg-stage/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {HEADER_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${isActive ? 'bg-panel text-ink shadow-sm' : 'text-ink-2 hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-0.5">
          <RankChip />
          <button type="button" className={`${iconBtn} hidden sm:flex`} onClick={() => openModal('help')} aria-label="How to play" title="How to play">
            <CircleHelp className="h-5 w-5" />
          </button>
          <button type="button" className={iconBtn} onClick={() => openModal('settings')} aria-label="Settings" title="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <button type="button" className={iconBtn} onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-fade-in border-t border-rim bg-stage lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 py-4 sm:px-6">
            {[...MODE_LINKS, { to: '/memory-tips', label: 'Memory tips' }, { to: '/how-to-play', label: 'How to play' }].map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) => `block rounded-2xl border px-4 py-3 font-bold ${isActive ? 'border-pink/50 bg-panel text-ink' : 'border-rim bg-panel/60 text-ink-2'}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
