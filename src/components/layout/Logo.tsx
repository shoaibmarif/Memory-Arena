import React from 'react';
import { Link } from 'react-router-dom';

/** Two cards leaning on each other, one face up, one face down. */
export const LogoMark: React.FC<{ className?: string }> = ({ className = 'h-9 w-9' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="lm-back" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff4fa3" />
        <stop offset="1" stopColor="#7b5cff" />
      </linearGradient>
      <linearGradient id="lm-face" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2bd2ff" />
        <stop offset="1" stopColor="#b8f35a" />
      </linearGradient>
    </defs>
    <rect x="6" y="9" width="22" height="30" rx="5" transform="rotate(-12 17 24)" fill="url(#lm-back)" />
    <rect x="20" y="9" width="22" height="30" rx="5" transform="rotate(10 31 24)" fill="url(#lm-face)" />
    <path d="M31 18.5l2 4.2 4.6.6-3.4 3.2.9 4.5-4.1-2.3-4.1 2.3.9-4.5-3.4-3.2 4.6-.6z" transform="rotate(10 31 24)" fill="#0d0b1f" />
  </svg>
);

export const Logo: React.FC = () => (
  <Link to="/" className="group flex items-center gap-2.5" aria-label="Memory Arena home">
    <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
    <span className="font-display text-[0.95rem] font-extrabold leading-[1.05] tracking-tight sm:text-base">
      MEMORY
      <br />
      <span className="neon-text">ARENA</span>
    </span>
  </Link>
);
