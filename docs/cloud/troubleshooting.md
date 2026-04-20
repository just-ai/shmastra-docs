# Troubleshooting

Common Cloud issues and where to look.

## Deploy fails on `build:studio`

The Studio frontend lives in `studio-build/` and is built with Vite
into `public/studio/`. If this step fails:

- Make sure you didn't overwrite the root `build` script in
  `package.json`. It must run `build:studio` before `next build`.
- Check the Vite build output for missing files — someone may have
  deleted part of `studio-build/`.

## "E2B routes must stay on Node runtime"

If you converted `/api/mastra/[...path]/route.ts` (or any other
`@mastra/e2b`-using route) to `export const runtime = 'edge'`, the
E2B SDK won't work. Remove the line.

The Edge runtime is correct for `/api/gateway/[...path]` only.

## Sign-in goes in circles

- **WorkOS `redirect_uri` mismatch.** Add both the Vercel URL and
  `http://localhost:3000/callback` to AuthKit Configuration.
- **`WORKOS_ORGANIZATION_ID` wrong.** The middleware only lets
  members of this specific org through. Check it matches the org
  you added the test user to.
- **Cookie password changed.** Rotating `WORKOS_COOKIE_PASSWORD`
  invalidates every session. Sign in again.

## `/workspace` sits on "provisioning" forever

1. Check that `npm run template:build` ran successfully and the
   `shmastra` template exists in the E2B dashboard.
2. Check your E2B plan's concurrent-sandbox limit — new users can't
   provision if you're maxed out.
3. In the [Manage UI](/cloud/manage-ui/sandbox-table), find the user's
   sandbox and look at its status column. If it's stuck in
   `provisioning`, try **Terminal → `pm2 status`** and
   **Logs → shmastra** to see why pnpm dev isn't starting.

## A sandbox is in `broken` state

The [healer agent](/cloud/day-2/healer-agent) gave up after three
attempts. Open the Manage UI:

- **Chat tab** — talk to a fresh Claude Sonnet session; ask it to
  investigate and fix.
- **Logs tab** — look at `healer` logs to see which fixes it tried.
- **Terminal tab** — run `pm2 restart shmastra` manually, or fix the
  underlying issue (missing env var, corrupted node_modules).

## All sandboxes lost a specific feature after an update

Your update pipeline ran, but either a patch failed or something
drifted. Check:

- `scripts/patches/` — make sure every patch in the directory has a
  monotonically-increasing prefix. Unapplied patches run on the next
  update.
- The sandbox's `version` column in Supabase — should match the
  highest patch number.
- The [update pipeline logs](/cloud/manage-ui/applying-updates) for
  errors.

## The gateway returns 401

- The sandbox's virtual key may have been regenerated (a
  reprovision does this). Ensure `MASTRA_AUTH_TOKEN` on the sandbox
  matches what Supabase has for that user.
- The real provider key on Vercel is missing or stale.

## Still stuck?

- Open an issue at <https://github.com/just-ai/shmastra-cloud/issues>.
- Include: the sandbox id, its status in Supabase, the last 100 lines
  of `shmastra` and `healer` logs from the Manage UI, and the Vercel
  deployment URL you're using.
