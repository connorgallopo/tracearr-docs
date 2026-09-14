import type { MetadataRoute } from 'next';
import { getTemplates } from './templates/data';

type SitemapEntry = MetadataRoute.Sitemap[number];

const baseUrl = 'https://docs.tracearr.com';

// Both come from next.config.ts at build time. The sitemap regenerates hourly
// for the template list, and neither the app directory nor git history is
// available to that regeneration. A page's date is its last commit.
const buildTime = new Date(process.env.DOCS_BUILD_TIME ?? Date.now());
const docPages: { route: string; lastModified: string }[] = JSON.parse(
  process.env.DOCS_PAGES ?? '[]'
);

const DEFAULTS: Pick<SitemapEntry, 'changeFrequency' | 'priority'> = {
  changeFrequency: 'monthly',
  priority: 0.8,
};

const OVERRIDES: Record<string, Pick<SitemapEntry, 'changeFrequency' | 'priority'>> = {
  '/': { changeFrequency: 'weekly', priority: 1 },
  '/getting-started': { priority: 0.9 },
  '/getting-started/installation': { priority: 0.9 },
  '/getting-started/installation/docker-ui': { priority: 0.9 },
  '/getting-started/installation/supervised': { priority: 0.9 },
  '/getting-started/installation/kubernetes': { priority: 0.9 },
  '/getting-started/installation/railway': { priority: 0.9 },
  '/getting-started/first-server': { priority: 0.9 },
  '/configuration/email/recipients': { priority: 0.7 },
  '/configuration/debug': { priority: 0.7 },
  '/api': { changeFrequency: 'weekly' },
  '/sse-plugin': { changeFrequency: 'weekly', priority: 0.9 },
  '/sse-plugin/events': { changeFrequency: 'weekly' },
  '/sse-plugin/troubleshooting': { priority: 0.7 },
  '/upgrading': { priority: 0.7 },
  '/faq': { changeFrequency: 'weekly' },
  '/templates': { changeFrequency: 'weekly' },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = docPages.map(({ route, lastModified }) => ({
    url: route === '/' ? baseUrl : `${baseUrl}${route}`,
    lastModified: new Date(lastModified),
    ...DEFAULTS,
    ...OVERRIDES[route],
  }));

  // Template content lives in the community repo, so there is no commit here to date it by.
  const templates = await getTemplates();
  const templatePages: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: buildTime,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...templatePages];
}
