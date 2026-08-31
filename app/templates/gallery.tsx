'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Giscus from '@giscus/react';
import { Check, Copy } from 'lucide-react';
import {
  GROUP_LABELS,
  GROUP_ORDER,
  KIND_LABELS,
  type TemplateEntry,
  type TemplateGroup,
} from './data';

export const VERIFIED_TOOLTIP =
  'A Tracearr maintainer read this template and its definition. That is a human review; nothing here is signed.';
export const BUILTIN_TOOLTIP =
  'The slug and fingerprint match a template Tracearr already ships, so this is the ready-made one.';

export function Badge({
  children,
  tone = 'plain',
  title,
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'verified' | 'builtin';
  title?: string;
}) {
  const tones = {
    plain: 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400',
    verified: 'border-cyan-500/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/5',
    builtin: 'border-gray-400/40 text-gray-700 dark:text-gray-300 bg-gray-500/5',
  } as const;
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function CopyCode({
  code,
  label = 'Copy the share code',
  className = '',
}: {
  code: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className={`inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${className}`}
    >
      {copied ? <Check className="size-4 text-cyan-500" /> : <Copy className="size-4" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function TemplateCard({ template }: { template: TemplateEntry }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/templates/${template.slug}`}
          className="font-semibold underline-offset-4 hover:underline"
        >
          {template.name}
        </Link>
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
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{template.sentence}</p>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
        <CopyCode code={template.code} label="Copy the share code" />
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {GROUP_LABELS[template.group]}
          {template.author ? ` · ${template.author}` : ''}
        </span>
      </div>
    </div>
  );
}

export function Gallery({ templates }: { templates: TemplateEntry[] }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<TemplateGroup | 'all'>('all');

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return templates.filter((template) => {
      if (group !== 'all' && template.group !== group) return false;
      if (!needle) return true;
      return [template.name, template.description, template.sentence, template.author ?? '']
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [templates, query, group]);

  const groups = GROUP_ORDER.filter((candidate) =>
    templates.some((template) => template.group === candidate)
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          aria-label="Search templates"
          className="min-w-52 flex-1 rounded-md border border-gray-300 bg-transparent px-3 py-1.5 text-sm dark:border-gray-700"
        />
        <div className="flex flex-wrap gap-1.5">
          {(['all', ...groups] as const).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setGroup(candidate)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                group === candidate
                  ? 'border-cyan-500 text-cyan-700 dark:text-cyan-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {candidate === 'all' ? 'All' : GROUP_LABELS[candidate]}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Nothing matches that. Try a word from what the automation does: discord, offline, paused.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {shown.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The template's GitHub Discussion, mapped by number. The numbers come from
 * index.json, which the community repo's workflow writes after it creates each
 * thread.
 *
 * Reactions need a GitHub account. That is all the abuse control there is:
 * one account votes once, and nothing stops someone with several. Read the
 * counts as rough interest, not as a rating.
 */
export function Comments({ discussionNumber }: { discussionNumber: number }) {
  const { resolvedTheme } = useTheme();

  return (
    <Giscus
      repo="Tracearr/Automation-Templates"
      // Node ids of the repository and its Templates category (gh api graphql).
      repoId="R_kgDOUBJsVQ"
      category="Templates"
      categoryId="DIC_kwDOUBJsVc4DEB1Q"
      mapping="number"
      term={String(discussionNumber)}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      lang="en"
      loading="lazy"
    />
  );
}
