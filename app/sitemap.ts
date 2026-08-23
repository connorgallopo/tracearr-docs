import type { MetadataRoute } from "next";
import { statSync } from "fs";
import { join } from "path";
import { getTemplates } from "./templates/data";

function getLastModified(filePath: string): Date {
  try {
    const fullPath = join(process.cwd(), "app", filePath);
    const stats = statSync(fullPath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://docs.tracearr.com";

  // One entry per template in the community index, so a new template is
  // reachable without editing this file.
  const templates = await getTemplates();
  const templatePages: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: getLastModified("templates/page.tsx"),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

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
      url: `${baseUrl}/getting-started/installation/docker-ui`,
      lastModified: getLastModified(
        "getting-started/installation/docker-ui/page.mdx",
      ),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/installation/supervised`,
      lastModified: getLastModified(
        "getting-started/installation/supervised/page.mdx",
      ),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/installation/kubernetes`,
      lastModified: getLastModified(
        "getting-started/installation/kubernetes/page.mdx",
      ),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/getting-started/installation/railway`,
      lastModified: getLastModified(
        "getting-started/installation/railway/page.mdx",
      ),
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
      url: `${baseUrl}/configuration/automations`,
      lastModified: getLastModified("configuration/automations/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/realtime`,
      lastModified: getLastModified("configuration/realtime/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/tailscale`,
      lastModified: getLastModified("configuration/tailscale/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/backup`,
      lastModified: getLastModified("configuration/backup/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/configuration/recovery`,
      lastModified: getLastModified("configuration/recovery/page.mdx"),
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
      url: `${baseUrl}/api`,
      lastModified: getLastModified("api/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sse-plugin`,
      lastModified: getLastModified("sse-plugin/page.mdx"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sse-plugin/installation`,
      lastModified: getLastModified("sse-plugin/installation/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sse-plugin/events`,
      lastModified: getLastModified("sse-plugin/events/page.mdx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sse-plugin/consuming`,
      lastModified: getLastModified("sse-plugin/consuming/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sse-plugin/comparison`,
      lastModified: getLastModified("sse-plugin/comparison/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sse-plugin/troubleshooting`,
      lastModified: getLastModified("sse-plugin/troubleshooting/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/upgrading`,
      lastModified: getLastModified("upgrading/page.mdx"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: getLastModified("faq/page.mdx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: getLastModified("templates/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...templatePages,
  ];
}
