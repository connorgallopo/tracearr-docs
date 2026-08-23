import type { Metadata } from "next";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { getTemplates } from "./data";
import { BUILTIN_TOOLTIP, Badge, Gallery, VERIFIED_TOOLTIP } from "./gallery";

// The community repo rebuilds index.json on merge; an hour is close enough.
export const revalidate = 3600;

const description =
  "Automation templates for Tracearr, shared as codes you paste into your own install. Notifications, server health, limits and housekeeping for Plex, Jellyfin and Emby.";

export const metadata: Metadata = {
  title: "Automation templates",
  description,
  alternates: { canonical: "https://docs.tracearr.com/templates" },
  openGraph: {
    title: "Tracearr automation templates",
    description,
    url: "https://docs.tracearr.com/templates",
  },
};

// Non-MDX routes get the sidebar, breadcrumb and pagination only through the
// theme's MDX wrapper; nothing else renders them.
const Wrapper = getMDXComponents().wrapper;

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <Wrapper
      toc={[]}
      metadata={{
        title: "Automation templates",
        filePath: "app/templates/page.tsx",
      }}
      sourceCode=""
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Automation templates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Each of these is an automation someone built in Tracearr and
            exported as a share code. Copy a code, open{" "}
            <b>Automations → Import</b> in your own Tracearr, and paste it.
            Tracearr shows you what the automation does before it is added, and
            adds it paused.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            This gallery lives on the docs site. Your Tracearr never reads it,
            and there is no way to import from a URL: pasting is the only way
            in, so nothing your install does depends on this page staying up.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800">
          <div className="flex flex-wrap items-start gap-2">
            <Badge tone="verified" title={VERIFIED_TOOLTIP}>
              Verified
            </Badge>
            <span className="text-gray-600 dark:text-gray-400">
              A Tracearr maintainer read the template and its definition. That
              is a human review. Nothing about a share code is signed, and
              nothing is checked cryptographically.
            </span>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <Badge tone="builtin" title={BUILTIN_TOOLTIP}>
              Built-in
            </Badge>
            <span className="text-gray-600 dark:text-gray-400">
              The slug and fingerprint both match a template Tracearr ships, so
              this is the same one already in your New automation gallery.
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Neither badge travels with a code. A code someone sends you carries
            no claim at all, which is why the import review shows what it does
            and the automation starts paused.
          </p>
        </div>

        <Gallery templates={templates} />

        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Adding one of your own
          </h2>
          <p>
            Open the automation in Tracearr, choose <b>Export</b>, expand{" "}
            <b>Put this in the community gallery</b> and copy the JSON. Then
            open a pull request against{" "}
            <a
              href="https://github.com/Tracearr/automation-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Tracearr/automation-templates
            </a>{" "}
            with the JSON in <code>templates/</code>. CI validates the envelope
            against the same schema the app uses and recomputes the fingerprint,
            so a hand-edited definition fails before anyone reads it.
          </p>
          <p>
            The gallery renders the envelope&apos;s own fields and nothing else.
            There is no place for a contributor to put markup or a link, and the
            consequence lines on each page are read off the definition rather
            than off the description its author wrote.
          </p>
        </div>
      </div>
    </Wrapper>
  );
}
