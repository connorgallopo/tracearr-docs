import { execFileSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, relative } from 'path';
import { withPostHogConfig } from '@posthog/nextjs-config';
import nextra from 'nextra';

const withNextra = nextra({
  // Nextra options
});

const REPO_URL = 'https://github.com/connorgallopo/tracearr-docs.git';

function git(args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

// Vercel clones with --depth=10 and no remote, so a page untouched in the last
// ten commits would have no history to date it by.
function ensureFullHistory(): void {
  try {
    if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
      git(['fetch', '--unshallow', REPO_URL]);
    }
  } catch (error) {
    process.emitWarning(
      `[sitemap] could not fetch full git history, page dates fall back to build time: ${String(error)}`
    );
  }
}

function lastCommitDate(file: string): string | null {
  try {
    return git(['log', '-1', '--format=%cI', '--', file]) || null;
  } catch {
    return null;
  }
}

interface DocPage {
  route: string;
  lastModified: string;
}

/** Every static page under app/. Dynamic segments like [slug] are listed by the sitemap itself. */
function listPages(dir: string, route: string, buildTime: string): DocPage[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const pageFile = entries.find((e) => e.isFile() && /^page\.(mdx|tsx)$/.test(e.name));
  const here: DocPage[] = pageFile
    ? [
        {
          route: route || '/',
          lastModified:
            lastCommitDate(relative(process.cwd(), join(dir, pageFile.name))) ?? buildTime,
        },
      ]
    : [];
  const below = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('['))
    .flatMap((e) => listPages(join(dir, e.name), `${route}/${e.name}`, buildTime));
  return [...here, ...below].sort((a, b) => a.route.localeCompare(b.route));
}

const buildTime = new Date().toISOString();
ensureFullHistory();

const config = withNextra({
  // Next.js options
  reactStrictMode: true,
  env: {
    DOCS_BUILD_TIME: buildTime,
    DOCS_PAGES: JSON.stringify(listPages(join(process.cwd(), 'app'), '', buildTime)),
  },
  async redirects() {
    return [
      {
        source: '/getting-started/installation/portainer',
        destination: '/getting-started/installation/docker-ui',
        permanent: true,
      },
      {
        source: '/debug',
        destination: '/configuration/debug',
        permanent: true,
      },
      {
        source: '/rules',
        destination: '/configuration/automations',
        permanent: true,
      },
      {
        source: '/configuration/rules',
        destination: '/configuration/automations',
        permanent: true,
      },
      {
        source: '/update',
        destination: '/upgrading',
        permanent: true,
      },
      {
        source: '/analytics',
        destination: '/',
        permanent: true,
      },
      {
        source: '/performance',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // The proxied /ingest paths 308 away unless this is off.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
});

const personalApiKey = process.env.POSTHOG_API_KEY;

// withPostHogConfig has to be the outermost wrapper or its build hooks are dropped.
export default personalApiKey
  ? withPostHogConfig(config, {
      personalApiKey,
      projectId: process.env.POSTHOG_PROJECT_ID,
      sourcemaps: { releaseName: 'docs-site' },
    })
  : config;
