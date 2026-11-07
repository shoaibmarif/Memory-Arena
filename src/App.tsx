import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { DECK_PAGES } from './data/deckPages';

const page = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));

// The home page ships in the main bundle; everything else loads on demand.
const Daily = page(() => import('./pages/Daily'), 'Daily');
const ModePage = lazy(() => import('./pages/ModePage').then((m) => ({ default: m.ModePage })));
const DeckPage = lazy(() => import('./pages/DeckPage').then((m) => ({ default: m.DeckPage })));
const Kids = page(() => import('./pages/Kids'), 'Kids');
const Profile = page(() => import('./pages/Profile'), 'Profile');
const HowToPlay = page(() => import('./pages/HowToPlay'), 'HowToPlay');
const MemoryTips = page(() => import('./pages/MemoryTips'), 'MemoryTips');
const Faq = page(() => import('./pages/Faq'), 'Faq');
const About = page(() => import('./pages/About'), 'About');
const Contact = page(() => import('./pages/Contact'), 'Contact');
const Privacy = page(() => import('./pages/Privacy'), 'Privacy');
const Terms = page(() => import('./pages/Terms'), 'Terms');
const Sitemap = page(() => import('./pages/Sitemap'), 'Sitemap');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Loading = () => <div className="min-h-[70vh]" aria-busy="true" />;

export const App: React.FC = () => {
  const { pathname } = useLocation();

  // The page loaded fine, so a later stale-file error may reload again.
  useEffect(() => {
    try {
      sessionStorage.removeItem('memoryarena.chunk-reload');
    } catch {
      // storage blocked
    }
  }, []);

  return (
    <AppLayout>
      <ScrollToTop />
      <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/time-attack" element={<ModePage mode="time-attack" />} />
            <Route path="/survival" element={<ModePage mode="survival" />} />
            <Route path="/zen" element={<ModePage mode="zen" />} />
            <Route path="/memory-game-for-kids" element={<Kids />} />
            {Object.keys(DECK_PAGES).map((path) => (
              <Route key={path} path={path} element={<DeckPage path={path} />} />
            ))}
            <Route path="/profile" element={<Profile />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/memory-tips" element={<MemoryTips />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppLayout>
  );
};
