# Setup overview

You'll do everything once, in this order:

1. **[Supabase](/cloud/setup/supabase)** — create the database and run
   the initial migration. Gives you `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY`.
2. **[WorkOS](/cloud/setup/workos)** — set up AuthKit and pick your
   organisation. Gives you `WORKOS_API_KEY`,
   `WORKOS_CLIENT_ID`, `WORKOS_ORGANIZATION_ID`, and a
   `WORKOS_COOKIE_PASSWORD` you generate yourself.
3. **[E2B](/cloud/setup/e2b)** — create an API key. Gives you
   `E2B_API_KEY`.
4. **[AI providers](/cloud/setup/ai-providers)** — at minimum one of
   OpenAI / Anthropic / Google; optionally Composio.
5. **[Build the E2B template](/cloud/setup/build-e2b-template)** —
   run `npm run template:build` locally so sandboxes have something
   to spawn from.
6. **[Environment variables](/cloud/setup/env-vars)** — the full
   reference, useful when you're pasting into Vercel.
7. **[Deploy to Vercel](/cloud/setup/deploy-to-vercel)** — push the
   repo, paste the env vars, click deploy.

After that you can:

- Test locally first with [local development](/cloud/local-development).
- [Onboard your team](/cloud/onboarding-your-team) via WorkOS.
- Keep an eye on things through the [Manage UI](/cloud/manage-ui/).

## Two places each variable lives

Every env var goes into two spots:

- `.env.local` on your machine (so the Manage UI and the E2B template
  build can run).
- **Vercel → Settings → Environment Variables** for production.

The env-vars reference calls out which set each variable belongs to.

## A clean setup in an afternoon

If nothing unusual happens, the whole thing — dashboards, keys,
template build, first Vercel deploy — is doable in an afternoon. The
one time-consuming step is the first `npm run template:build`, which
uploads a multi-GB image to E2B.
