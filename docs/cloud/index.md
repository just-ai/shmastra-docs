# Shmastra Cloud — for your team

**Who this section is for:** the engineer setting Shmastra Cloud up at
their company so teammates can vibe-code AI agents from a browser
without touching Node, npm, or a terminal.

If that’s not you — if you just want to build agents on your own
machine — head to [Shmastra for developers](/shmastra/) instead.

<video src="https://github.com/user-attachments/assets/28805105-827c-459b-bd77-8536d46710ae" controls style="width:100%;border-radius:8px;margin:1rem 0"></video>

<a href="/shmastra-docs/overview.html" style="display:inline-block;margin:0.5rem 0 1.5rem;padding:0.5rem 1.25rem;background:#46f488;color:#050505;border-radius:6px;font-weight:600;text-decoration:none">See the overview</a>

## What your teammates get

After you deploy Cloud once, every colleague who signs in gets:

- A personal **E2B sandbox** running Mastra Studio with Shmastra
  pre-installed.
- The full [chat widget](/shmastra/the-chat-widget) experience — the
  same one Shmastra developers get locally.
- **No local setup.** Just a browser.
- **No API keys to manage.** Cloud hands each sandbox a virtual key;
  the real provider keys stay on your Vercel environment.
- **[Scheduled tasks](/cloud/scheduling)** — any agent task or
  workflow can run automatically on a cron, with results and traces
  stored per run.

## What you get as the admin

- A **Manage UI** you run from your laptop
  (`npx tsx manage/index.mts --serve`) that lists every sandbox,
  applies updates, streams logs, pokes at files, and lets you chat
  with a Claude Sonnet session inside any sandbox.
- A **healer agent** that auto-diagnoses and repairs broken sandboxes
  without paging you.
- A **patch system** so you can ship migrations to every sandbox
  without rebuilding the E2B template.

## Path to production

Work top-to-bottom:

1. [What is Shmastra Cloud](/cloud/what-is-shmastra-cloud) — the
   one-page concept.
2. [Architecture](/cloud/architecture) — the moving parts you’ll
   provision.
3. [Prerequisites](/cloud/prerequisites) — accounts you’ll need.
4. [Setup](/cloud/setup/) — step-by-step: Supabase → WorkOS → E2B →
   env vars → deploy to Vercel.
5. [Onboarding your team](/cloud/onboarding-your-team) — invite users
   via WorkOS.
6. [Manage UI](/cloud/manage-ui/) — day-to-day admin.
7. [Day 2](/cloud/day-2/) — patches, healer, template rebuilds.
