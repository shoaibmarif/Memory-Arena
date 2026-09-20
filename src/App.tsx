import { useState, useEffect, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { GameHeader } from './components/GameHeader';
import { PauseModal } from './components/PauseModal';
import { ResultsScreen } from './components/ResultsScreen';
import { StatisticsModal } from './components/StatisticsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { AchievementToast } from './components/AchievementToast';
import { SeoSection } from './components/SeoSection';
import { PrivacyModal } from './components/PrivacyModal';
import { SitemapModal } from './components/SitemapModal';
import { getSettings, saveSettings, getStatistics, getAchievements, syncAchievementsWithStats } from './utils/storage';
import type { GameSettings, Achievement, ThemeId, DifficultyConfig } from './types/game';
import { DIFFICULTY_LIST } from './game/difficulty';
import { THEMES } from './data/themes';
import { soundEngine } from './utils/sound';
import { getDailyChallengeInfo } from './game/dailyChallenge';
import { Brain, BarChart2, Trophy, Settings as SettingsIcon, Calendar, Sun, Moon, Globe, Shield, Map, Heart } from 'lucide-react';

export function App() {
  // Settings & Theme
  const [settings, setSettings] = useState<GameSettings>(() => getSettings());
  const [stats, setStats] = useState(() => getStatistics());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getAchievements());

  // Active Modals
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  // Screen reader accessible announcements
  const [announcement, setAnnouncement] = useState<string>('');

  const announce = useCallback((msg: string) => {
    setAnnouncement(msg);
  }, []);

  const handleAchievementUnlocked = useCallback((ach: Achievement) => {
    setAchievementQueue(prev => [...prev, ach]);
    setAchievements(getAchievements());
  }, []);

  // Process achievement queue one by one for toast notifications
  useEffect(() => {
    if (!latestAchievement && achievementQueue.length > 0) {
      setLatestAchievement(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [latestAchievement, achievementQueue]);

  // Initial sync: backfill any achievements based on accumulated stats
  useEffect(() => {
    const currentStats = getStatistics();
    const currentAchievements = getAchievements();
    const { updatedAchievements, newlyUnlocked } = syncAchievementsWithStats(currentAchievements, currentStats);
    setAchievements(updatedAchievements);
    if (newlyUnlocked.length > 0) {
      setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    }
  }, []);

  // Initialize Game Hook - starts directly on page load
  const {
    gameMode,
    difficulty,
    themeId,
    cards,
    status,
    moves,
    matchedPairsCount,
    totalPairs,
    timer,
    scoreBreakdown,
    mismatchedIndices,
    startNewGame,
    handleCardClick,
    pauseGame,
    resumeGame,
    quitToMenu,
  } = useGame({
    onAchievementUnlocked: handleAchievementUnlocked,
    onAnnounce: announce,
  });

  // Apply Appearance Theme (Light/Dark/System)
  useEffect(() => {
    soundEngine.setEnabled(settings.soundEnabled);

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        settings.themeMode === 'dark' ||
        (settings.themeMode === 'system' && mediaQuery.matches);

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (settings.themeMode === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.themeMode, settings.soundEnabled]);

  // Keep stats and achievements in sync when a game finishes
  useEffect(() => {
    if (status === 'completed') {
      setStats(getStatistics());
      setAchievements(getAchievements());
    }
  }, [status]);

  const isDarkMode =
    settings.themeMode === 'dark' ||
    (settings.themeMode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    soundEngine.playButtonClick();
    const nextMode = isDarkMode ? 'light' : 'dark';
    handleUpdateSettings({ themeMode: nextMode });
  };

  // Update Settings
  const handleUpdateSettings = (partial: Partial<GameSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  // Switch Difficulty directly
  const handleSelectDifficulty = (newDiff: DifficultyConfig) => {
    soundEngine.playButtonClick();
    startNewGame('standard', newDiff, themeId);
  };

  // Switch Theme directly
  const handleSelectTheme = (newTheme: ThemeId) => {
    soundEngine.playButtonClick();
    startNewGame(gameMode, difficulty, newTheme);
  };

  // Launch Daily Challenge directly
  const handleStartDailyChallenge = () => {
    soundEngine.playButtonClick();
    startNewGame('daily', difficulty, themeId);
  };

  // Keyboard shortcut: Escape to pause game or close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPrivacyOpen) setIsPrivacyOpen(false);
        else if (isSitemapOpen) setIsSitemapOpen(false);
        else if (isStatsOpen) setIsStatsOpen(false);
        else if (isAchievementsOpen) setIsAchievementsOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (status === 'playing') pauseGame();
        else if (status === 'paused') resumeGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrivacyOpen, isSitemapOpen, isStatsOpen, isAchievementsOpen, isSettingsOpen, status, pauseGame, resumeGame]);

  const dailyInfo = getDailyChallengeInfo();
  const isDailyCompletedToday = Boolean(stats.dailyChallengeCompletions[dailyInfo.dateString]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Screen Reader ARIA Live Region */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Floating Achievement Toast */}
      <AchievementToast
        achievement={latestAchievement}
        onDismiss={() => setLatestAchievement(null)}
      />

      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-lg sm:text-xl tracking-tight leading-none block">
                MEMORY MATCH
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block">
                Free Brain Game
              </span>
            </div>
          </div>

          {/* Quick Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setIsStatsOpen(true);
              }}
              aria-label="View Statistics"
              title="Statistics"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Stats</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setAchievements(getAchievements());
                setIsAchievementsOpen(true);
              }}
              aria-label="View Achievements"
              title="Achievements & Badges"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Badges</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                {achievements.filter(a => Boolean(a.unlockedAt)).length}/{achievements.length}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setIsSettingsOpen(true);
              }}
              aria-label="Open Settings"
              title="Settings"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Quick 1-Click Light/Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to Light theme' : 'Switch to Dark theme'}
              title={isDarkMode ? 'Switch to Light theme' : 'Switch to Dark theme'}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Page Area - Directly Showing the Game */}
      <main className="flex-1 flex flex-col items-center justify-start py-3 sm:py-5 px-2">
        {/* Game Mode Selector Bar: Difficulty Pills + Daily Challenge + Themes */}
        <section aria-label="Game Selectors" className="w-full max-w-4xl mx-auto px-2 mb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800">
            {/* Difficulty Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {DIFFICULTY_LIST.map((diff) => {
                const isSelected = gameMode === 'standard' && difficulty.id === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => handleSelectDifficulty(diff)}
                    className={`
                      px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0
                      ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <span>{diff.name}</span>
                    <span className={`text-[10px] ml-1 font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {diff.rows}×{diff.cols}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right side: Daily Challenge button & Theme Picker */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Daily Challenge Pill */}
              <button
                onClick={handleStartDailyChallenge}
                title="Play Today's Seeded Challenge"
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0
                  ${
                    gameMode === 'daily'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                  }
                `}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily</span>
                {isDailyCompletedToday && (
                  <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-extrabold">✓</span>
                )}
              </button>

              {/* Theme Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
                  const t = THEMES[tKey];
                  const isSelected = themeId === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => handleSelectTheme(tKey)}
                      title={`${t.name} Theme`}
                      className={`
                        w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all
                        ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-sm scale-110'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }
                      `}
                    >
                      {t.icon}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Live Game Header (Moves, Time, Pairs, Controls) */}
        <GameHeader
          moves={moves}
          formattedTime={timer.formattedTime}
          matchedPairs={matchedPairsCount}
          totalPairs={totalPairs}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          onPause={pauseGame}
          onRestart={() => startNewGame(gameMode, difficulty, themeId)}
          onQuit={quitToMenu}
        />

        {/* Interactive Game Board - Direct Display */}
        <GameBoard
          cards={cards}
          difficulty={difficulty}
          mismatchedIndices={mismatchedIndices}
          onCardClick={handleCardClick}
          disabled={status !== 'playing'}
        />

        {/* SEO Information & Guide Section */}
        <SeoSection />
      </main>

      {/* Comprehensive Footer with Developer Links, Privacy Policy & Sitemap */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-8 px-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Creator Profile Branding */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <span>Memory Match Game</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Developed with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> by
                <a
                  href="https://shoaibarif.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Shoaib Arif
                </a>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Free, responsive, open-source memory card matching puzzle running 100% offline.
            </p>
          </div>

          {/* Social & Portfolio Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Portfolio Website */}
            <a
              href="https://shoaibarif.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition group shadow-sm"
              title="Shoaib Arif Portfolio Website"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Portfolio</span>
            </a>

            {/* GitHub Profile */}
            <a
              href="https://github.com/shoaibmarif"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200/60 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition group shadow-sm"
              title="GitHub Profile @shoaibmarif"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/shoaibmarif/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition group shadow-sm"
              title="LinkedIn Profile @shoaibmarif"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#0a66c2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom Legal & Sitemap Navigation */}
        <div className="max-w-5xl mx-auto mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Memory Card Game. All rights reserved.</p>

          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setIsPrivacyOpen(true);
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <span>•</span>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setIsSitemapOpen(true);
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Sitemap</span>
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

      {/* Modals */}
      <PauseModal
        isOpen={status === 'paused'}
        onResume={resumeGame}
        onRestart={() => startNewGame(gameMode, difficulty, themeId)}
        onQuit={quitToMenu}
      />

      {status === 'completed' && scoreBreakdown && (
        <ResultsScreen
          scoreBreakdown={scoreBreakdown}
          moves={moves}
          timeSeconds={timer.seconds}
          difficulty={difficulty}
          bestScore={stats.bestScores[difficulty.id] || 0}
          bestTime={stats.bestTimes[difficulty.id] || 0}
          onPlayAgain={() => startNewGame(gameMode, difficulty, themeId)}
          onChangeDifficulty={() => {
            quitToMenu();
          }}
          onOpenStats={() => {
            setStats(getStatistics());
            setIsStatsOpen(true);
          }}
          onOpenAchievements={() => {
            setAchievements(getAchievements());
            setIsAchievementsOpen(true);
          }}
        />
      )}

      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onReset={() => {
          setStats(getStatistics());
          setAchievements(getAchievements());
        }}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        onResetAchievements={() => setAchievements(getAchievements())}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
    </div>
  );
}

export default App;
