# Local development

You can run the full Cloud app on your laptop against real Supabase,
real WorkOS, and real E2B. Good for catching issues before they hit
production.

## One-time setup

```shell
git clone https://github.com/just-ai/shmastra-cloud.git
cd shmastra-cloud
npm ci
cp .env.example .env.local
```

Paste everything from the [env-vars reference](/cloud/setup/env-vars)
into `.env.local`.

## Run the dev server

```shell
npm run dev
```

Next.js starts on `http://localhost:3000`. Make sure
`http://localhost:3000/callback` is registered in WorkOS redirect
URIs (see [WorkOS setup](/cloud/setup/workos)).

## Run the Manage UI alongside

In a second terminal:

```shell
npx tsx manage/index.mts --serve
```

Opens on `http://localhost:3737`. See
[Manage UI overview](/cloud/manage-ui/) for what's inside.

## Production build

Same chain Vercel uses:

```shell
npm run build   # build:studio + next build
npm run start
```

If `build:studio` fails, Mastra Studio won't render — check that the
`studio-build/` directory is intact.

## Tips

- **Use the same `.env.local` for everything.** `npm run template:build`,
  `manage/index.mts`, and `npm run dev` all read it. One file, one
  set of secrets. If you manage multiple environments, see
  [Environment profiles](/cloud/manage-ui/env-profiles) to keep them
  separate without editing this file.
- **Hot-reload does not cross runtimes.** If you edit
  `/api/gateway/[...path]/route.ts` (Edge), Next.js restarts the edge
  function — no weird action needed. If you edit
  `/api/mastra/[...path]/route.ts` (Node), it reloads in place.
- **Local sandboxes are real sandboxes.** Every `/workspace` visit
  from localhost provisions an actual E2B sandbox on your paid
  account — be mindful of quota.
- **Blow away the dev user.** If you want to start fresh, delete your
  row in the `users` and `sandboxes` tables in Supabase. The next
  sign-in provisions from scratch.

## What to test locally before you deploy

- Sign-in round trip (WorkOS redirect + session cookie).
- First-time `/workspace` provision — you should see the pm2
  processes start in the sandbox within ~30 seconds.
- A simple Shmastra prompt — create a trivial agent and talk to it
  to confirm the `/api/gateway/*` proxy swap works.
- `manage --serve` tabs: Sandbox table shows your newly provisioned
  sandbox; Logs tab streams pm2 output; Files tab lists the sandbox
  filesystem.
