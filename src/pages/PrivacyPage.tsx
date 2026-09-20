import React, { useEffect } from 'react';
import { Shield, ArrowLeft, Lock, EyeOff, HardDrive, CheckCircle2, Globe } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Privacy Policy – Memory Arena';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://memoryarena.netlify.app/privacy');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navbar */}
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
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-lg sm:text-xl tracking-tight leading-none block">
                MEMORY ARENA
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block">
                Privacy Policy
              </span>
            </div>
          </button>

          {/* Action: Return to Game */}
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
      </header>

      {/* Main Privacy Document Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4" />
            100% Client-Side • Zero Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last updated: September 20, 2026 • Effective Date: September 20, 2026
          </p>
        </div>

        {/* Highlights Callout Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm mb-8">
          <div className="flex items-start gap-3.5">
            <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                Your Privacy is Completely Respected
              </h2>
              <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                Memory Arena operates 100% locally in your web browser. We do not require accounts, we do not use tracking cookies, and we never collect, store, or sell any personal data.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <EyeOff className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              No Data Collection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No forms, no sign-ups, no email addresses, and no personal identifiers of any kind.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <HardDrive className="w-5 h-5 text-purple-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Local Storage Only
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your high scores, unlocked badges, and settings are saved exclusively on your device.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <Shield className="w-5 h-5 text-pink-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Offline Capable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Runs as a standalone web application that needs no server connection to play.
            </p>
          </div>
        </div>

        {/* Structured Legal Sections */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Information We Do Not Collect
            </h2>
            <p className="mb-2">
              Memory Arena is deliberately built with a privacy-first, zero-knowledge architecture. When using this service:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li>We do not collect names, email addresses, phone numbers, or physical addresses.</li>
              <li>We do not record your IP address, geolocation, or device fingerprints.</li>
              <li>We do not employ cross-site tracking cookies, behavioral tracking, or fingerprinting scripts.</li>
              <li>We do not sell, rent, monetize, or disclose any user data to advertisers or third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. How Local Storage Is Used
            </h2>
            <p className="mb-2">
              Memory Arena uses browser <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-400">localStorage</code> solely to remember your progress on your own device:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>Game Statistics:</strong> Games played, games completed, fewest moves, best scores, and best times.</li>
              <li><strong>Achievements &amp; Badges:</strong> Unlocked badges and their local timestamp.</li>
              <li><strong>Preferences:</strong> Sound toggle (on/off), visual theme (light/dark/system), and card symbol theme.</li>
              <li><strong>Daily Challenges:</strong> Completion status for the current date's challenge.</li>
            </ul>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              You can wipe this data at any moment by clicking <em>"Reset Statistics"</em> or <em>"Reset Badges"</em> within the game, or by clearing your browser cache.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Analytics &amp; Third-Party Services
            </h2>
            <p>
              We use lightweight Google Analytics solely to measure aggregate page visits, browser compatibility, and general site performance. Google Analytics does not collect personally identifiable information (PII) and complies with industry standard data protection regulations. You can opt out using any standard content blocker or the Google Analytics Opt-out Browser Add-on.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Children's Online Privacy Protection (COPPA Compliance)
            </h2>
            <p>
              Memory Arena is a family-friendly educational puzzle game suitable for all ages. We do not knowingly collect or solicit any personal information from children under the age of 13 in full compliance with the Children’s Online Privacy Protection Act (COPPA).
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Contact &amp; Developer Details
            </h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, feel free to reach out directly to the creator:
            </p>
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Shoaib Arif</span>
                <span className="text-xs text-slate-400">Full-Stack Web Developer</span>
              </div>
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-500 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Portfolio</span>
              </a>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-center shadow-xl">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Ready to train your memory?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md mx-auto">
            Enjoy a fast, offline-capable memory card puzzle completely free.
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
              onClick={() => onNavigate('/sitemap')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Sitemap
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
