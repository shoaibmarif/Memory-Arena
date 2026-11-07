/**
 * Brand and deployment details in one place. Change `url` if the domain
 * changes: canonical URLs, the sitemap, social tags and structured data all
 * derive from it.
 */
export const SITE = {
  name: 'Memory Arena',
  url: 'https://memoryarena.netlify.app',
  defaultDescription:
    'Memory Arena is a free memory card matching game. Flip cards, find pairs and climb the ranks: a daily board, Time Attack, Survival, relaxed Zen mode and seven card decks.',
  locale: 'en_US',
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Memory Arena, a free online memory card game',
  author: {
    name: 'Shoaib Arif',
    url: 'https://shoaibarif.vercel.app/',
    github: 'https://github.com/shoaibmarif',
    linkedin: 'https://www.linkedin.com/in/shoaibmarif/',
    email: 'shoaibmuhammadarif@gmail.com',
  },
  repo: 'https://github.com/shoaibmarif/memory-arena',
  issues: 'https://github.com/shoaibmarif/memory-arena/issues',
} as const;

export const absoluteUrl = (path: string): string => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`);
