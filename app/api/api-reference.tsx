"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import { useTheme } from "nextra-theme-docs";
import "@scalar/api-reference-react/style.css";

type OpenApiDocument = Record<string, unknown>;

export function ApiReference({
  v1,
  v2,
  v2Beta,
}: {
  v1: OpenApiDocument | null;
  v2: OpenApiDocument | null;
  v2Beta: boolean;
}) {
  const { resolvedTheme } = useTheme();

  // While v2 only exists in prereleases it is listed as beta and v1 stays the
  // default; once a stable release carries it, v2 takes over as the default.
  const sources = [
    v2 && {
      title: v2Beta ? "v2 (beta)" : "v2 (current)",
      slug: "v2",
      content: v2,
      default: !v2Beta,
    },
    v1 && {
      title: v2 && !v2Beta ? "v1" : "v1 (current)",
      slug: "v1",
      content: v1,
      default: !v2 || v2Beta,
    },
  ].filter((s): s is Exclude<typeof s, false | null> => Boolean(s));

  return (
    <div style={{ height: "calc(100vh - var(--nextra-navbar-height, 64px))" }}>
      <ApiReferenceReact
        configuration={{
          sources,
          forceDarkModeState: resolvedTheme === "light" ? "light" : "dark",
          hideDarkModeToggle: true,
          hideClientButton: true,
          documentDownloadType: "json",
          agent: { disabled: true },
          mcp: { disabled: true },
          showDeveloperTools: "never",
        }}
      />
    </div>
  );
}
