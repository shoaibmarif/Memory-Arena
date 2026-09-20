import React, { useEffect } from 'react';
import { X, Map, Layers, Sparkles, BookOpen, User, Shield, ExternalLink, FileCode } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy: () => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose, onOpenPrivacy }) => {
  // Support Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sitemap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sitemap-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Website Sitemap
              </h2>
              <span className="text-xs text-slate-400">Directory of pages, features & resources</span>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            aria-label="Close Sitemap"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pr-1">
          {/* Section 1: Core Game Modes */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2.5 text-sm">
              <Layers className="w-4 h-4 text-indigo-500" />
              <h3>Game Modes & Difficulties</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold text-slate-900 dark:text-white block">Easy Mode</span>
                <span className="text-[11px] text-slate-400">4 × 4 Grid • 8 Pairs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold text-slate-900 dark:text-white block">Medium Mode</span>
                <span className="text-[11px] text-slate-400">4 × 5 Grid • 10 Pairs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold text-slate-900 dark:text-white block">Hard Mode</span>
                <span className="text-[11px] text-slate-400">6 × 6 Grid • 18 Pairs</span>
              </div>
            </div>
          </div>

          {/* Section 2: Card Themes */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2.5 text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3>Card Symbol Themes</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">😎</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Smilies & Fun</span>
                  <span className="text-[10px] text-slate-400">40 Expressive Emojis</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">🍕</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Food & Treats</span>
                  <span className="text-[10px] text-slate-400">40 Delicious Foods</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">🐼</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Cute Animals</span>
                  <span className="text-[10px] text-slate-400">40 Wildlife & Pets</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Cosmic Space</span>
                  <span className="text-[10px] text-slate-400">40 Cosmic Items</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">🎲</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Surprise Mix</span>
                  <span className="text-[10px] text-slate-400">Full Pooled Shuffle</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <span className="text-lg">📅</span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Daily Challenge</span>
                  <span className="text-[10px] text-slate-400">Deterministic Seed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Educational Guide */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2 text-sm">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h3>Gameplay Guides & Resources</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>• <strong>How to Play:</strong> Step-by-step matching rules and keyboard navigation.</li>
              <li>• <strong>Scoring Breakdown:</strong> Base points, difficulty multipliers, time bonuses, and streak perks.</li>
              <li>• <strong>Brain Training Tips:</strong> Chunking techniques, verbal association, and recall strategies.</li>
              <li>• <strong>Frequently Asked Questions (FAQ):</strong> Offline capability, browser compatibility, and scoring.</li>
            </ul>
          </div>

          {/* Section 4: Author & Profiles */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2.5 text-sm">
              <User className="w-4 h-4 text-amber-500" />
              <h3>Creator & Developer Links</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between hover:border-indigo-400 transition group"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Portfolio Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>

              <a
                href="https://github.com/shoaibmarif"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between hover:border-indigo-400 transition group"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>

              <a
                href="https://www.linkedin.com/in/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between hover:border-indigo-400 transition group"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>
            </div>
          </div>

          {/* Section 5: Legal & Technical */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Privacy Policy
              </button>
            </div>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              XML Sitemap
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
