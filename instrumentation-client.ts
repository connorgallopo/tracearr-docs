import posthog from 'posthog-js';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// api_host is relative because next.config rewrites /ingest to PostHog; ui_host
// has to name the real host so dashboard links resolve.
if (token) {
  posthog.init(token, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
  });
}
