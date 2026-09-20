import React, { useEffect } from 'react';
import { 
  Map, 
  ArrowLeft, 
  Layers, 
  Sparkles, 
  Shield, 
  Trophy, 
  Clock, 
  BarChart2, 
  Volume2, 
  SunMoon, 
  ExternalLink, 
  Globe, 
  FileCode, 
  Calendar, 
  Compass, 
  Gamepad2,
  Lock
} from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Sitemap – Memory Arena';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://memoryarena.netlify.app/sitemap');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onNavigate('/');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-lg sm:text-xl tracking-tight leading-none block">
                MEMORY ARENA
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block">
                Website Sitemap
              </span>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onNavigate('/privacy');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onNavigate('/');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Play Game</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Sitemap Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" />
            Website Index &amp; Structure
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Memory Arena Sitemap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Comprehensive overview of all pages, game difficulty modes, symbol themes, gameplay features, and search crawler resources.
          </p>
        </div>

        {/* Section 1: Main Pages */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Primary Web Pages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Main Game Page */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Main Game Arena
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold">
                    /
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Memory Arena Puzzle
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  The primary matching card puzzle application. Features interactive flip mechanics, precision stopwatch, streak multipliers, sound synthesis, and local stats.
                </p>
              </div>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onNavigate('/');
                }}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Game Arena</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            {/* Privacy Policy Page */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Legal &amp; Transparency
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                    /privacy
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy Policy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Complete documentation of our zero-tracking, client-side only architecture, COPPA child safety compliance, and local storage data management.
                </p>
              </div>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onNavigate('/privacy');
                }}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Read Privacy Policy</span>
              </button>
            </div>

            {/* XML Machine Sitemap */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Search Engines
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-mono font-bold">
                    /sitemap.xml
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Machine XML Sitemap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Official XML format sitemap conforming to sitemaps.org standards for Google Search Console, Bing Webmaster, and automated web indexing crawlers.
                </p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>View Raw XML</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Game Modes & Difficulties */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Game Modes &amp; Difficulty Tiers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Easy */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase mb-2">
                ⚡ Starter Tier
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Easy Mode
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>• <strong>Grid Dimensions:</strong> 4 × 4 Layout</li>
                <li>• <strong>Pairs:</strong> 8 Pairs (16 Cards total)</li>
                <li>• <strong>Target Time:</strong> 45 Seconds</li>
                <li>• <strong>Score Multiplier:</strong> 1.0×</li>
                <li>• <strong>Recommended For:</strong> Beginners, casual players, and speed practice.</li>
              </ul>
            </div>

            {/* Medium */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase mb-2">
                🎯 Balanced Tier
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Medium Mode
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>• <strong>Grid Dimensions:</strong> 4 × 5 Layout</li>
                <li>• <strong>Pairs:</strong> 10 Pairs (20 Cards total)</li>
                <li>• <strong>Target Time:</strong> 70 Seconds</li>
                <li>• <strong>Score Multiplier:</strong> 1.5×</li>
                <li>• <strong>Recommended For:</strong> Daily brain workout and balanced recall challenge.</li>
              </ul>
            </div>

            {/* Hard */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold uppercase mb-2">
                🧠 Expert Cognition
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hard Mode
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>• <strong>Grid Dimensions:</strong> 6 × 6 Layout</li>
                <li>• <strong>Pairs:</strong> 18 Pairs (36 Cards total)</li>
                <li>• <strong>Target Time:</strong> 150 Seconds</li>
                <li>• <strong>Score Multiplier:</strong> 2.2×</li>
                <li>• <strong>Recommended For:</strong> Master puzzlers seeking maximum streak rewards.</li>
              </ul>
            </div>
          </div>

          {/* Daily Challenge Highlight */}
          <div className="mt-4 p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Daily Challenge Puzzle
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  A unique, globally synchronized daily puzzle generated with a deterministic date seed. Players worldwide match the identical layout each day.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onNavigate('/');
              }}
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
            >
              Play Today's Challenge
            </button>
          </div>
        </section>

        {/* Section 3: Card Symbol Decks */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Symbol Decks &amp; Themes
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
              <span className="text-3xl block mb-2">😎</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Smilies &amp; Fun</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">40 Expressive Emojis</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
              <span className="text-3xl block mb-2">🍕</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Food &amp; Treats</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">40 Snacks &amp; Meals</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
              <span className="text-3xl block mb-2">🐼</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Cute Animals</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">40 Wildlife &amp; Pets</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
              <span className="text-3xl block mb-2">🚀</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Cosmic Space</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">40 Galaxies &amp; Planets</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm col-span-2 sm:col-span-1">
              <span className="text-3xl block mb-2">🎲</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Surprise Mix</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Full Shuffled Pool</p>
            </div>
          </div>
        </section>

        {/* Section 4: Game Features & Technical Specs */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Features &amp; Engine Capabilities
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  12 Unlockable Badges &amp; Achievements
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Rewarding milestones for first matches, rapid clears, flawless precision, high streaks, and consistent play. Includes dismissible toast notifications with audio cues.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Decoupled Precision Stopwatch (Zero Lag)
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  High-performance game timer isolated into an independent DOM subscriber so ticking seconds never trigger unnecessary re-renders of cards or layout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BarChart2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Lifetime Local Statistics
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete tracking of games played, win rate, fewest moves, best scores, and fastest times across every difficulty tier without any external tracking cookies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Web Audio Synthesizer
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Zero-latency programmatic tone synthesis for card flips, successful matches, streak fanfares, and win jingles using standard HTML5 Web Audio API.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SunMoon className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Dynamic Theme Engine
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Full support for Light Mode, Dark Mode, and System Preference detection with high contrast accessible card borders and smooth transitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Creator & Portfolio */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Creator &amp; Verification
            </h2>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-black text-slate-900 dark:text-white text-base block">
                Shoaib Arif
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Full-Stack Web Developer &amp; Creator of Memory Arena
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Built with React, TypeScript, TailwindCSS, and the Web Audio API. Hosted on Netlify with global CDN delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-500 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
              <a
                href="https://github.com/shoaibmarif"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-center shadow-xl">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Ready to challenge your memory?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md mx-auto">
            Choose your difficulty, flip the cards, and set your new personal best score!
          </p>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onNavigate('/');
            }}
            className="mt-4 px-6 py-3 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs sm:text-sm shadow-lg active:scale-95 transition"
          >
            Play Memory Arena Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 px-4 text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Memory Arena. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Play Game
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              XML Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
