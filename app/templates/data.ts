/**
 * The gallery's data. index.json is built by CI in the community repo from the
 * envelopes it holds, and this site reads it at build time.
 *
 * Set TEMPLATES_INDEX_URL to point somewhere else (a branch, a fork). Until the
 * repository exists the fetch 404s and the bundled copy is used instead, which
 * is also what happens if GitHub is down while a deploy runs.
 */

import fallback from "./fallback-index.json";

const INDEX_URL =
  process.env.TEMPLATES_INDEX_URL ??
  "https://raw.githubusercontent.com/Tracearr/automation-templates/main/index.json";

export type TemplateGroup =
  | "notifications"
  | "server_health"
  | "policies"
  | "housekeeping";

export interface TemplateInput {
  key: string;
  kind: string;
  label: string;
  description?: string;
  required: boolean;
  default?: unknown;
  /**
   * What the app prints inside the control. A duration carries its own; a
   * number takes it from the condition its answer lands in, and plenty of
   * inputs have none.
   */
  unit?: string;
}

export interface TemplateEntry {
  slug: string;
  name: string;
  description: string;
  group: TemplateGroup;
  kind: "policy" | "notification";
  minServerVersion: string;
  inputs: TemplateInput[];
  sentence: string;
  effects: string[];
  code: string;
  fingerprint: string;
  builtin: boolean;
  verified: boolean;
  author?: string;
  discussionNumber?: number;
}

/** The app's own labels, so the gallery and the New automation screen agree. */
export const GROUP_LABELS: Record<TemplateGroup, string> = {
  notifications: "Notifications",
  server_health: "Server health",
  policies: "Limits and rules",
  housekeeping: "Housekeeping",
};

export const GROUP_ORDER: TemplateGroup[] = [
  "notifications",
  "server_health",
  "policies",
  "housekeeping",
];

export const KIND_LABELS: Record<TemplateEntry["kind"], string> = {
  policy: "A violation",
  notification: "An alert",
};

/**
 * The consequence lines, word for word as Tracearr shows them. Which lines a
 * template earns is decided in the community repo, off the definition rather
 * than off its description.
 *
 * `oneServer` is missing on purpose: it names the server the reader picked, and
 * nothing is picked on this site, so no template here can earn it.
 */
export const EFFECT_LINES: Record<string, string> = {
  kill: "Can stop a stream that is playing.",
  trust: "Changes trust scores.",
  message: "Puts a message on a player.",
  violation: "Records a violation against the matched person.",
  tellsOnly: "Only notifies. Never stops a stream or changes an account.",
  allServers: "Runs on every server unless one is chosen.",
  everyServer: "Runs on every server.",
};

/** The two lines that name harm, which the app marks and so does this page. */
export const HARM_EFFECTS = ["kill", "violation"];

/** first4…last3, the same shape the import review shows, so codes compare by eye. */
export function shortFingerprint(fingerprint: string): string {
  return `${fingerprint.slice(0, 4)}…${fingerprint.slice(-3)}`;
}

export async function getTemplates(): Promise<TemplateEntry[]> {
  try {
    const response = await fetch(INDEX_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return fallback as TemplateEntry[];
    const parsed: unknown = await response.json();
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallback as TemplateEntry[];
    }
    return parsed as TemplateEntry[];
  } catch {
    return fallback as TemplateEntry[];
  }
}

export async function getTemplate(
  slug: string,
): Promise<TemplateEntry | undefined> {
  const templates = await getTemplates();
  return templates.find((template) => template.slug === slug);
}
