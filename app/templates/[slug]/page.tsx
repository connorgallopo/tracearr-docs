import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';
import {
  EFFECT_LINES,
  GROUP_LABELS,
  HARM_EFFECTS,
  KIND_LABELS,
  type TemplateInput,
  getTemplate,
  getTemplates,
  shortFingerprint,
} from '../data';
import { BUILTIN_TOOLTIP, Badge, Comments, CopyCode, VERIFIED_TOOLTIP } from '../gallery';

export const revalidate = 3600;

// Non-MDX routes get the sidebar and the rest of the docs chrome only through
// the theme's MDX wrapper; nothing else renders them.
const Wrapper = getMDXComponents().wrapper;

/** What the control holds before anyone touches it, the way the app opens on it. */
function startsAt(input: TemplateInput): string {
  if (input.kind === 'server') return 'Any server';
  if (typeof input.default === 'boolean') return input.default ? 'On' : 'Off';
  if (input.default !== undefined) {
    return `${String(input.default)}${input.unit ? ` ${input.unit}` : ''}`;
  }
  return input.required ? 'Required' : 'Optional';
}

export async function generateStaticParams() {
  const templates = await getTemplates();
  return templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template) return { title: 'Template not found' };

  return {
    title: `${template.name} - automation template`,
    description: template.description,
    alternates: { canonical: `https://docs.tracearr.com/templates/${slug}` },
    openGraph: {
      title: `${template.name} - Tracearr automation template`,
      description: template.description,
      url: `https://docs.tracearr.com/templates/${slug}`,
    },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template) notFound();

  return (
    <Wrapper
      toc={[]}
      metadata={{
        title: template.name,
        filePath: 'app/templates/[slug]/page.tsx',
      }}
      sourceCode=""
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Link
            href="/templates"
            className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
          >
            ← All templates
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{template.name}</h1>
            {template.verified && (
              <Badge tone="verified" title={VERIFIED_TOOLTIP}>
                Verified
              </Badge>
            )}
            {template.builtin && (
              <Badge tone="builtin" title={BUILTIN_TOOLTIP}>
                Built-in
              </Badge>
            )}
            <Badge>{KIND_LABELS[template.kind]}</Badge>
            <Badge>{GROUP_LABELS[template.group]}</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {template.author ? `Author: ${template.author} · ` : ''}
            code {shortFingerprint(template.fingerprint)} · needs Tracearr{' '}
            {template.minServerVersion} or newer
          </p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-500">In plain words</h2>
          <p className="rounded-lg border-l-2 border-cyan-500/50 bg-gray-500/5 px-4 py-3">
            {template.sentence}
          </p>
        </section>

        {/* The same two surfaces the binding form shows, in the same order and
          without headings over them: what it will do, then what it needs. */}
        <section aria-label="What this will do" className="rounded-lg bg-gray-500/5 px-4 py-3">
          <ul className="flex flex-col gap-2 text-sm">
            {template.effects.map((effect) => (
              <li
                key={effect}
                className={
                  HARM_EFFECTS.includes(effect)
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {EFFECT_LINES[effect] ?? effect}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="What it needs" className="flex flex-col gap-4">
          {template.inputs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Nothing to fill in.</p>
          ) : (
            template.inputs.map((input) => (
              <div key={input.key} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{input.label}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{startsAt(input)}</span>
                {input.description ? (
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {input.description}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Share code</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Copy this, then paste it into Automations → Import in your Tracearr. It carries the
            steps and the blanks above, nothing about the install it came from. Tracearr shows you a
            review first, and adds the automation paused so you can check it before turning it on.
          </p>
          <CopyCode code={template.code} label="Copy the share code" />
          <pre className="max-h-40 overflow-auto rounded-lg border border-gray-200 p-3 text-xs break-all whitespace-pre-wrap dark:border-gray-800">
            {template.code}
          </pre>
        </section>

        {typeof template.discussionNumber === 'number' ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Reactions and replies</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is the template&apos;s GitHub Discussion. Reacting needs a GitHub account, and
              that is the only limit on it, so read the counts as rough interest rather than as a
              score.
            </p>
            <Comments discussionNumber={template.discussionNumber} />
          </section>
        ) : null}
      </div>
    </Wrapper>
  );
}
