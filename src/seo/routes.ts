/**
 * SEO metadata for every page. Used at runtime by <SeoMeta> and at build time
 * by scripts/seoPlugin.ts (one static HTML file per page, sitemap.xml, Netlify
 * _redirects). Keep titles under about 60 characters.
 */
export type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  changefreq: ChangeFreq;
  priority: number;
  noindex?: boolean;
  parent?: string;
  /** Interactive game pages get WebApplication structured data. */
  app?: boolean;
}

const game = (r: Omit<RouteMeta, 'changefreq' | 'priority' | 'app' | 'parent'> & { priority?: number }): RouteMeta => ({
  changefreq: 'monthly',
  priority: 0.8,
  parent: '/',
  app: true,
  ...r,
});

const page = (r: Omit<RouteMeta, 'changefreq' | 'priority' | 'parent'> & { priority?: number; changefreq?: ChangeFreq }): RouteMeta => ({
  changefreq: 'monthly',
  priority: 0.5,
  parent: '/',
  ...r,
});

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'Memory Arena - Free Memory Card Game Online',
    description:
      'Flip cards, find the pairs and climb the ranks. A free memory matching game with a daily board, Time Attack, Survival, Zen mode and seven card decks.',
    label: 'Home',
    heading: 'Memory Arena',
    changefreq: 'weekly',
    priority: 1,
    app: true,
  },
  game({
    path: '/daily',
    title: 'Daily Memory Challenge - A New Board Every Day',
    description: 'One board a day, the same for everyone. Clear it in as few moves as you can, keep your streak alive and share your score.',
    label: 'Daily Arena',
    heading: 'Daily Arena',
    priority: 0.9,
  }),
  game({
    path: '/time-attack',
    title: 'Time Attack Memory Game - Beat the Clock',
    description: 'The clock is running and every pair you find adds four seconds. How big a board can you clear before time runs out?',
    label: 'Time Attack',
    heading: 'Time Attack',
  }),
  game({
    path: '/survival',
    title: 'Survival Memory Game - Three Hearts, No Mistakes',
    description: 'See the whole board for a moment, then match from memory. Forget a card you have already seen and you lose a heart.',
    label: 'Survival',
    heading: 'Survival',
  }),
  game({
    path: '/zen',
    title: 'Zen Memory Game - Relaxed, No Timer',
    description: 'No clock, no score, no pressure. A calm memory matching game with free peeks whenever you want them.',
    label: 'Zen',
    heading: 'Zen mode',
  }),
  game({
    path: '/memory-game-for-kids',
    title: 'Memory Game for Kids - Easy Animal Matching',
    description: 'A gentle animal memory game for children: a small board, big cards, friendly sounds and no timer. Free, with no ads or sign-up.',
    label: 'For kids',
    heading: 'Memory game for kids',
    priority: 0.7,
  }),
  game({
    path: '/animal-memory-game',
    title: 'Animal Memory Game - Match the Animal Pairs',
    description: 'Foxes, pandas, owls and octopuses. Find every animal pair on boards from 4 × 4 to 6 × 6.',
    label: 'Animal cards',
    heading: 'Animal memory game',
    priority: 0.7,
  }),
  game({
    path: '/emoji-memory-game',
    title: 'Emoji Memory Game - Match the Smileys',
    description: 'Robots, ghosts, aliens and a lot of faces. Match the emoji pairs and see how few moves you need.',
    label: 'Emoji cards',
    heading: 'Emoji memory game',
    priority: 0.7,
  }),
  game({
    path: '/food-memory-game',
    title: 'Food Memory Game - Match the Snacks',
    description: 'Pizza, doughnuts, sushi and strawberries. A tasty memory matching game on boards from 4 × 4 to 6 × 6.',
    label: 'Food cards',
    heading: 'Food memory game',
    priority: 0.6,
  }),
  game({
    path: '/space-memory-game',
    title: 'Space Memory Game - Match Planets and Rockets',
    description: 'Rockets, planets, moons and comets. Find every pair in this space themed memory game.',
    label: 'Space cards',
    heading: 'Space memory game',
    priority: 0.6,
  }),
  page({
    path: '/profile',
    title: 'Your Arena Profile',
    description: 'Your rank, XP, best scores, daily streak and achievements, saved on this device.',
    label: 'Profile',
    heading: 'Your arena',
    noindex: true,
  }),
  page({
    path: '/how-to-play',
    title: 'How to Play Memory Arena - Rules, Modes and Scoring',
    description: 'How matching works, what each mode does, how scores, combos, stars and ranks are worked out, and the keyboard controls.',
    label: 'How to play',
    heading: 'How to play',
    priority: 0.7,
  }),
  page({
    path: '/memory-tips',
    title: 'Memory Game Tips - How to Remember More Cards',
    description: 'Practical tricks that make a real difference: naming cards, sweeping the board in order, chunking and the method of loci.',
    label: 'Memory tips',
    heading: 'Tips for a better memory game',
    priority: 0.7,
  }),
  page({
    path: '/faq',
    title: 'Memory Arena FAQ - Common Questions Answered',
    description: 'How the daily board works, what counts as a slip, how ranks and stars are earned, where your progress is saved and more.',
    label: 'FAQ',
    heading: 'Frequently asked questions',
    priority: 0.6,
  }),
  page({ path: '/about', title: 'About Memory Arena', description: 'Why Memory Arena exists, what makes it different and who builds it.', label: 'About', heading: 'About Memory Arena', changefreq: 'yearly' }),
  page({
    path: '/contact',
    title: 'Contact',
    description: 'Report a bug, suggest a deck or just say hello. Email, LinkedIn and GitHub links for Memory Arena.',
    label: 'Contact',
    heading: 'Contact',
    changefreq: 'yearly',
    priority: 0.4,
  }),
  page({
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'No accounts and no game server. Your progress stays in your browser. Here’s the little we collect and how to opt out.',
    label: 'Privacy',
    heading: 'Privacy policy',
    changefreq: 'yearly',
    priority: 0.3,
  }),
  page({ path: '/terms', title: 'Terms and Conditions', description: 'The terms that apply when you use Memory Arena.', label: 'Terms', heading: 'Terms and conditions', changefreq: 'yearly', priority: 0.3 }),
  page({ path: '/sitemap', title: 'Sitemap', description: 'Every page on Memory Arena in one list.', label: 'Sitemap', heading: 'Sitemap', priority: 0.2 }),
];

/** Old or likely URLs, permanently redirected to their page. */
export const REDIRECTS: Record<string, string> = {
  '/play': '/',
  '/classic': '/',
  '/daily-challenge': '/daily',
  '/stats': '/profile',
  '/achievements': '/profile',
  '/tips': '/memory-tips',
  '/rules': '/how-to-play',
};

const byPath = new Map(ROUTES.map((m) => [m.path, m]));
export const getRouteMeta = (path: string): RouteMeta | undefined => byPath.get(path);

export const getBreadcrumbs = (path: string): RouteMeta[] => {
  const trail: RouteMeta[] = [];
  let current = byPath.get(path);
  const seen = new Set<string>();
  while (current && !seen.has(current.path)) {
    seen.add(current.path);
    trail.unshift(current);
    current = current.parent ? byPath.get(current.parent) : undefined;
  }
  return trail;
};
