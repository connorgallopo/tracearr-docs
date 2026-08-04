import type { Metadata } from "next";
import { ApiReference } from "./api-reference";

// Re-fetch the specs from the latest stable release at most hourly, so a new
// release shows up here without a redeploy.
export const revalidate = 3600;

const SPEC_BASE =
  process.env.TRACEARR_SPEC_BASE_URL ??
  "https://github.com/connorgallopo/tracearr/releases/latest/download";

const description =
  "Interactive reference for the Tracearr public REST API. Query streams, watch history, users, libraries, and recently added media from your Plex, Jellyfin, or Emby monitoring instance.";

export const metadata: Metadata = {
  title: "API Reference",
  description,
  alternates: {
    canonical: "https://docs.tracearr.com/api",
  },
  openGraph: {
    title: "Tracearr API Reference",
    description,
    url: "https://docs.tracearr.com/api",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebAPI",
  name: "Tracearr Public API",
  description,
  documentation: "https://docs.tracearr.com/api",
  provider: {
    "@type": "Organization",
    name: "Tracearr",
    url: "https://tracearr.com",
  },
};

type OpenApiDocument = Record<string, unknown>;

async function fetchJson(url: string): Promise<OpenApiDocument | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    // Release assets are served as application/octet-stream, so parse manually
    return JSON.parse(await res.text()) as OpenApiDocument;
  } catch {
    return null;
  }
}

// Until a stable release ships API v2, surface the spec from the newest
// prerelease that carries it, marked as beta on the page.
async function fetchPrereleaseV2(): Promise<OpenApiDocument | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/connorgallopo/tracearr/releases?per_page=10",
      { headers: { accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return null;
    const releases = (await res.json()) as Array<{
      draft: boolean;
      assets: Array<{ name: string; browser_download_url: string }>;
    }>;
    for (const release of releases) {
      if (release.draft) continue;
      const asset = release.assets.find((a) => a.name === "openapi-v2.json");
      if (asset) return fetchJson(asset.browser_download_url);
    }
    return null;
  } catch {
    return null;
  }
}

export default async function ApiPage() {
  const [v1, v2Stable] = await Promise.all([
    fetchJson(`${SPEC_BASE}/openapi-v1.json`),
    fetchJson(`${SPEC_BASE}/openapi-v2.json`),
  ]);
  const v2 = v2Stable ?? (await fetchPrereleaseV2());
  const v2Beta = !v2Stable && v2 !== null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {v1 || v2 ? (
        <ApiReference v1={v1} v2={v2} v2Beta={v2Beta} />
      ) : (
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-3xl font-bold">API reference</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Tracearr exposes a public REST API for third-party integrations:
            active streams, watch history, users, libraries, and recently added
            media. Authentication uses a bearer API key generated in Settings
            &gt; General on your instance.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            The interactive reference is published with each stable release and
            will appear here once the next stable version of Tracearr ships. In
            the meantime, every Tracearr instance serves its own copy under
            Settings &gt; API Docs, matching the exact version you run.
          </p>
        </div>
      )}
    </>
  );
}
