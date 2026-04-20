# Architecture

A one-page tour of what the engineer actually has to stand up.

## Component diagram

```
┌─────────────────────────────────────────────────────────┐
│ Browser (your teammate)                                 │
└────────┬────────────────────────────────────────────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────────────┐
│ Next.js app on Vercel                                   │
│                                                         │
│  middleware.ts           WorkOS AuthKit                 │
│     │                                                   │
│     ├─► /studio/*        static Mastra Studio bundle    │
│     ├─► /api/mastra/*    proxy → user's E2B sandbox     │
│     ├─► /api/gateway/*   AI proxy (Edge): vk → real key │
│     └─► /workspace       sandbox bootstrap page         │
└────────┬────────────────────────────────────────────────┘
         │
         ├──────────────► Supabase (users, sandboxes)
         │
         ├──────────────► WorkOS (sign-in, org membership)
         │
         └──────────────► E2B (per-user Linux sandboxes)

                ┌────────────────────────────────┐
                │ E2B sandbox (one per user)     │
                │                                │
                │  pm2                           │
                │   ├─ shmastra  (pnpm dev, 4111)│
                │   └─ healer    (self-heal bot) │
                │                                │
                │  .env has virtual key only     │
                └────────────────────────────────┘
```

## Request flow

1. Teammate visits the Cloud URL → Next.js middleware checks WorkOS
   session and organisation membership.
2. `/workspace` page provisions (or resumes) the user's sandbox via
   E2B's SDK. Once the sandbox is healthy the page redirects into
   Mastra Studio.
3. Studio runs entirely in the browser. Its API calls go to
   `/api/mastra/...` on the Next.js app; the app proxies them to
   `:4111` inside the user's sandbox.
4. When Shmastra inside the sandbox needs to call an LLM, it calls
   `/api/gateway/...` with its virtual key. The Edge gateway resolves
   `vk_<userId>_<hex>` → the real provider key from Vercel env, then
   proxies to OpenAI/Anthropic/Google/Composio.

## Data model (Supabase)

- **`users`** — WorkOS id ↔ Supabase user, includes `virtual_key`.
- **`sandboxes`** — one per user. Stores E2B sandbox id, status
  (`provisioning` | `ready` | `healing` | `broken` | `paused`), the
  patch `version` currently applied, timestamps.
- **`user_sandboxes`** — a view joining the two for admin queries.

Migrations live in `supabase/migrations/`. The first is
`001_init.sql`, which you run once before your first deploy (see
[Setup: Supabase](/cloud/setup/supabase)).

## Sandbox lifecycle

| Status | Meaning |
|---|---|
| `provisioning` | E2B sandbox is being created from the template. |
| `ready` | Mastra dev server is healthy on port 4111. |
| `healing` | [Healer agent](/cloud/day-2/healer-agent) is diagnosing a crash. |
| `broken` | Healer gave up after 3 attempts — admin action needed. |
| `paused` | Sandbox suspended for inactivity; resumes on the next request. |

## Key files

- `middleware.ts` — auth + org checks, redirects to `/workspace`.
- `lib/sandbox.ts` — provision / connect / health-check helpers.
- `lib/db.ts` — all Supabase queries.
- `lib/virtual-keys.ts` — generation + resolution of virtual keys.
- `app/api/mastra/[...path]/route.ts` — sandbox proxy (Node runtime).
- `app/api/gateway/[...path]/route.ts` — AI provider proxy (Edge).
- `app/workspace/page.tsx` — server-side sandbox bootstrap.
- `scripts/build-e2b-template.ts` — builds the E2B template.
- `scripts/patches/` — numbered scripts applied to sandboxes on update.
- `scripts/sandbox/` — files baked into the sandbox template
  (`ecosystem.config.cjs`, `start.sh`, `healer.mts`).
- `manage/` — the [Manage UI](/cloud/manage-ui/) and CLI.

## Important constraints

- **E2B-using routes must stay on the Node runtime.** Do not convert
  `/api/mastra/*` or anything touching `@mastra/e2b` to Edge.
- **Mastra Studio is a Vite-built static bundle.** `build:studio`
  must run before `next build` — `npm run build` does both in order.
- **Template must exist.** The `shmastra` E2B template needs a
  one-time `npm run template:build` before any sandbox can spawn.
