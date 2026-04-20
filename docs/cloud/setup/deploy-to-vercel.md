# Setup: Deploy to Vercel

The last step. With the [template built](/cloud/setup/build-e2b-template)
and all [environment variables](/cloud/setup/env-vars) in hand, Vercel
is a copy-paste.

## Steps

### 1. Push `shmastra-cloud` to your own remote

Fork or copy the repo into a GitHub account Vercel can read.

### 2. Import into Vercel

<https://vercel.com/new> → pick the repo → **Import**.

Vercel auto-detects it as a Next.js project. Don't override the
build command — `npm run build` already chains `build:studio` and
`next build`.

### 3. Paste environment variables

Under **Settings → Environment Variables** paste every value from
[the reference](/cloud/setup/env-vars). Scope to **Production,
Preview, and Development**.

### 4. Deploy

Trigger the first deploy. The build compiles Mastra Studio (Vite)
into `public/studio/`, then runs `next build`. Watch for errors —
typical first-deploy traps:

- **Missing env var.** Vercel fails the build with a clear message.
  Add it and redeploy.
- **`E2B-using routes must stay on Node runtime`.** If you've edited
  `app/api/mastra/[...path]/route.ts` or any other E2B-using route
  and added `export const runtime = 'edge'`, remove it.
- **`build:studio` didn't run.** Check the build log — if someone
  changed the root `build` script to just `next build`, the static
  Studio bundle won't exist and `/studio/*` will 404. Revert the
  script.

### 5. Add your domain (optional)

Settings → Domains → add your company domain. Remember to register
the `/callback` URL in WorkOS.

### 6. Smoke test

Visit the deployment. You should hit WorkOS sign-in, then land on
`/workspace`. The first sign-in of the first user triggers a sandbox
provision — expect a short wait while E2B spawns it from the
`shmastra` template.

Once the sandbox is `ready`, Mastra Studio loads and the Shmastra
chat widget is attached. Type *"Create an agent that says hello"* as
a sanity check.

## Runtime guardrails (don't break these)

- **Node runtime for E2B routes.** `/api/mastra/[...path]` and
  anything touching `@mastra/e2b` must be `nodejs`. The Edge runtime
  won't work for E2B.
- **Edge runtime for the gateway.** `/api/gateway/[...path]` *is*
  Edge — that's the whole point of swapping virtual → real keys at
  the edge.
- **Studio is static.** `build:studio` must run before `next build`.
  The bundled `npm run build` does this for you.
- **Template must exist.** Without a successful
  [`npm run template:build`](/cloud/setup/build-e2b-template) the
  first `/workspace` request will error.

## Next

- Want to test end-to-end without deploying first?
  → [Local development](/cloud/local-development).
- Ready to invite your team?
  → [Onboarding your team](/cloud/onboarding-your-team).
- Want to see your sandboxes?
  → [Manage UI](/cloud/manage-ui/).
