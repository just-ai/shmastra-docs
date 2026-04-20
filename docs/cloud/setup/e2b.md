# Setup: E2B

[E2B](https://e2b.dev) runs the per-user sandboxes. For Cloud you
only need one secret: an API key tied to your team.

## Steps

### 1. Create an account

Sign up at <https://e2b.dev>. Add a payment method — Cloud's sandbox
lifecycle won't work on the free tier past the first couple of
minutes (auto-resume needs a paid project).

### 2. Get the API key

From the dashboard **→ API keys → Create key**. Copy it. This goes
into `E2B_API_KEY`.

## Where the variable goes

| Variable | `.env.local` | Vercel |
|---|---|---|
| `E2B_API_KEY` | ✓ | ✓ |

`.env.local` is required because you'll be running
[`npm run template:build`](/cloud/setup/build-e2b-template) locally,
and the template builder uses the E2B SDK.

## How it's used

- **Provisioning.** When a user first signs in, `/workspace` calls
  `provisionSandbox()` from `lib/sandbox.ts` which creates an E2B
  instance from the `shmastra` template.
- **Proxying.** The Node route at `/api/mastra/[...path]` forwards
  requests into the sandbox on port 4111.
- **Lifecycle.** After ~10 minutes idle, E2B pauses the sandbox
  automatically. The next `/api/mastra/*` request resumes it; work on
  the filesystem survives pauses.

## Quotas

The free account limits concurrent sandboxes and total runtime.
For a real team, check your paid plan's limits against:

- **Concurrent sandboxes** ≥ your expected peak of active users.
- **Template size** — Shmastra's template is large (Node + Python +
  Playwright + markitdown + `@manzt/uv`). Make sure you have headroom.

## Next

Continue to [AI providers](/cloud/setup/ai-providers).
