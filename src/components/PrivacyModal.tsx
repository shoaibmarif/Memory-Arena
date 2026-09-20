import React, { useEffect } from 'react';
import { X, Shield, Lock, EyeOff, Database, ExternalLink } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h2>
              <span className="text-xs text-slate-400">Last updated: September 2026</span>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            aria-label="Close Privacy Policy"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed pr-1">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
              <strong>Your privacy is 100% respected.</strong> Memory Arena operates entirely in your browser with no tracking, no cookies, and zero external server communication.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-500" />
              1. Information We Do Not Collect
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              We do not collect, store, sell, or transmit any personal identifiable information (PII). There are no sign-up forms, accounts, analytics trackers, or third-party advertising scripts.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              2. LocalStorage Usage
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
              The application uses your browser's local storage solely to enhance your gameplay experience. The stored items include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <li><strong>Game Statistics:</strong> Total games played, win rate, best score, and best completion time per difficulty.</li>
              <li><strong>Achievements:</strong> Unlocked achievement badges and timestamp of unlock.</li>
              <li><strong>User Preferences:</strong> Sound toggle (muted/unmuted) and appearance theme (light/dark/system).</li>
              <li><strong>Daily Challenge:</strong> Completion status of the daily puzzle.</li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              This data stays entirely on your local device and you can clear it anytime from the Statistics modal or your browser settings.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              3. Web Audio API
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              All sound effects (card flips, chime chords, victory fanfares) are generated procedurally using the native Web Audio API in real time. No microphone or audio input permissions are requested or used.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-500" />
              4. External Links
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              This website contains links to external profiles (GitHub, LinkedIn, and the creator's portfolio). When navigating to external websites, their respective privacy policies apply.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              5. Contact & Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              If you have any questions or feedback regarding this game or privacy policy, feel free to connect via{' '}
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-500"
              >
                shoaibarif.vercel.app
              </a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
