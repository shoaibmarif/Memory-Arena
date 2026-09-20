import React from 'react';
import type { GameSettings } from '../types/game';
import { X, Volume2, VolumeX, Moon, Sun, Monitor, Activity } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <h2 id="settings-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            aria-label="Close Settings"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                  Sound Effects
                </span>
                <span className="text-xs text-slate-400">
                  Audio chimes for flips & matches
                </span>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                soundEngine.setEnabled(nextVal);
                if (nextVal) soundEngine.playButtonClick();
                onUpdateSettings({ soundEnabled: nextVal });
              }}
              className={`
                w-12 h-7 rounded-full transition-colors relative p-1
                ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-full bg-white shadow-sm transition-transform
                  ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Appearance (Theme Mode: Light, Dark, System) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const isSelected = settings.themeMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      soundEngine.playButtonClick();
                      onUpdateSettings({ themeMode: id });
                    }}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all
                      ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                  Reduced Motion
                </span>
                <span className="text-xs text-slate-400">
                  Minimize card flip 3D rotation
                </span>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => {
                soundEngine.playButtonClick();
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`
                w-12 h-7 rounded-full transition-colors relative p-1
                ${settings.reducedMotion ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-full bg-white shadow-sm transition-transform
                  ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end mt-5">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
