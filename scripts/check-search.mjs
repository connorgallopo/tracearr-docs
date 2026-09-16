// Pagefind bumps change ranking (1.4 to 1.5 moved four of these queries) and
// nothing else in the build notices.
import { readFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const indexDir = resolve(fileURLToPath(new URL('../public/_pagefind/', import.meta.url)));

const expectations = {
  docker: ['/getting-started/installation/docker-ui', '/getting-started/installation'],
  kubernetes: ['/getting-started/installation/kubernetes'],
  railway: ['/getting-started/installation/railway'],
  backup: ['/configuration/backup'],
  restore: ['/configuration/backup'],
  env: ['/configuration/environment'],
  config: ['/configuration'],
  tailscale: ['/configuration/tailscale'],
  automations: ['/configuration/automations'],
  log: ['/troubleshooting/logs'],
  webhook: ['/sse-plugin/comparison'],
  'trust score': ['/templates/trust-score-changed'],
  import: ['/getting-started/import'],
};

// pagefind.js resolves everything relative to its own file URL, and Node's
// fetch refuses file: URLs, so serve those from disk.
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = String(input);
  if (!url.startsWith('file:')) return realFetch(input, init);
  return new Response(await readFile(fileURLToPath(url.replace(/\?.*$/, ''))));
};

const pagefind = await import(pathToFileURL(resolve(indexDir, 'pagefind.js')).href);
await pagefind.options({ baseUrl: '/', basePath: pathToFileURL(indexDir).href + '/' });

let failures = 0;
for (const [query, wanted] of Object.entries(expectations)) {
  const { results } = await pagefind.search(query);
  const top = results[0] ? (await results[0].data()).url.replace(/\.html$/, '') : '(no results)';
  const ok = wanted.includes(top);
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${query.padEnd(14)} -> ${top}`);
}

if (failures) {
  console.error(`\n${failures} search ranking check(s) failed`);
  process.exit(1);
}
