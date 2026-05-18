# App sharing

When you build a web app in Shmastra, it lives at `/apps/<name>` on
your sandbox and is accessible only to you (the owner) by default.
Shmastra Cloud lets you share any app with other members of your
WorkOS organisation via a stable, guesswork-free URL — no separate
deployment, no credentials to hand out.

## How to share

1. Open the app at `/apps/<name>` while signed in as the sandbox owner.
2. A **Share** button appears in the top-right corner of the page.
3. Click **Share** → the panel opens showing a stable share URL of the
   form `/apps/shared/<name>-<slug>`.
4. Copy the link and send it to colleagues. Anyone in your WorkOS
   organisation who opens the URL is signed in automatically and lands
   on the shared app.

## What guests can do

Guests (any signed-in org member other than the owner) can:

- Use the app — chat with agents, trigger workflows, interact with any
  custom UI the app exposes.
- Upload files through the app's file-upload interface.
- Read their own run results and chat history.

Guests **cannot**:

- Access the Mastracode coding widget (it is hidden for non-owners).
- Call management endpoints — no access to environment variables,
  agent builder, logs, observability traces, scorer results, or
  processor management.
- Modify the Mastra project in any way.

## Sign-in redirect

If a guest opens the share URL before signing in, they are redirected
to the magic-code sign-in page. After completing sign-in they are
returned directly to the shared app — no extra navigation needed.

## Stable URLs and revoke / re-share

Share URLs are stable across revoke → re-share cycles. If you revoke a
share and then re-share the same app, the same URL becomes active
again. Existing guest sessions are invalidated when you revoke, so
guests who try to use cached sessions will be prompted to sign in again.

To revoke a share:

1. Open the app as the owner.
2. Click the **Share** button — the panel shows the current status.
3. Click **Revoke** — the share URL becomes inactive immediately and
   all guest sessions for that share are cleared.

## Per-viewer sessions

Cloud mints a unique session token for each (share, viewer) pair.
This means:

- Usage is billed to the owner account.
- Each viewer's activity is independently trackable.
- Revoking a share invalidates all sessions at once without affecting
  other shares or the owner's own session.

## App unavailable page

If the sandbox is sleeping when a guest opens the share URL, Cloud
displays an "unavailable" page and starts waking the sandbox in the
background. Once the sandbox is ready the guest can refresh and use the
app normally.

## Access control summary

| Endpoint type | Owner | Guest |
|---|---|---|
| App UI (`/apps/<name>`) | ✅ | ✅ via share URL |
| App custom routes (`/shmastra/api/apps/<name>/…`) | ✅ | ✅ |
| Agent stream / workflow run | ✅ | ✅ |
| File download (`/shmastra/api/files/<name>`) | ✅ | ✅ |
| File upload (`POST /shmastra/api/files`) | ✅ | ✅ |
| Mastracode chat (`/shmastra/api/chat`) | ✅ | ❌ |
| Environment variables (`/shmastra/api/vars`) | ✅ | ❌ |
| Composio OAuth (`/shmastra/api/connection`) | ✅ | ❌ |
| Observability / traces | ✅ | ❌ |
| Logs / system info | ✅ | ❌ |
