import type { MetadataRoute } from "next";
import { statSync } from "fs";
import { join } from "path";

function getLastModified(filePath: string): Date {
  try {
    const fullPath = join(process.cwd(), "app", filePath);
    const stats = statSync(fullPath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://docs.tracearr.com";

  return [
    {
      url: baseUrl,
      lastModified: getLastModified("page.mdx"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/getting-started`,
      lastModified: getLastModified("getting-started/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/installation`,
      lastModified: getLastModified("getting-started/installation/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/first-server`,
      lastModified: getLastModified("getting-started/first-server/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/import`,
      lastModified: getLastModified("getting-started/import/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration`,
      lastModified: getLastModified("configuration/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/environment`,
      lastModified: getLastModified("configuration/environment/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/mobile`,
      lastModified: getLastModified("configuration/mobile/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/debug`,
      lastModified: getLastModified("configuration/debug/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: getLastModified("faq/page.mdx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
