# Sharing apps

You can build a [web app](/shmastra/features/web-apps) in your own
sandbox and hand a stable link to teammates so they can use it
without touching Mastra Studio or your code. The owner keeps full
control; the guest sees only the app.

## How to share

Open your app at `/apps/<name>` while signed in to Cloud. A **Share**
button appears in the top-right corner of the page.

1. Click **Share**. Cloud generates a stable URL of the form
   `/apps/shared/<name>-<slug>` and shows it in a popup with a
   copy-to-clipboard button.
2. Send the URL to whoever you want to use the app. The recipient
   must already be a member of your WorkOS organisation — see
   [Onboarding your team](/cloud/onboarding-your-team).
3. The same app always maps to the same URL. Re-sharing later opens
   the existing link instead of minting a new one, so bookmarks keep
   working.

## What the guest sees

The guest opens the URL, signs in through WorkOS, and lands on the
app exactly as you built it. They can interact with the agents,
workflows, and any custom routes the app exposes.

What they **cannot** do:

- Open Mastra Studio or the Shmastra coding widget.
- Read or change your code, environment variables, files, or
  observability data.
- Call any management or telemetry endpoint on the sandbox.

If they try (e.g. by hand-crafting a request), the sandbox returns
`403 Forbidden`.

## Revoking access

Open the app again at `/apps/<name>` and click **Share** → **Revoke
access** in the same popup.

- The guest's next request to the sandbox returns `401`.
- If they reload the share URL, Cloud shows a "this shared app link
  doesn't exist" page.
- Re-sharing later re-uses the same `/apps/shared/<name>-<slug>` URL,
  so previously distributed links start working again. If you don't
  want that, keep the share revoked.

## Under the hood

Cloud and the sandbox split the work so guest traffic doesn't go
through Vercel:

1. The browser loads the HTML for `/apps/shared/<id>` from Cloud.
   Cloud authenticates the WorkOS user, creates a per-guest session
   in the owner's sandbox, and rewrites the page's auth token to a
   session token (the owner's virtual key is never sent to the
   browser).
2. The HTML carries a `<base href>` pointing at the owner's sandbox,
   so every `fetch`, `<script src>`, and `<img src>` resolves to the
   sandbox origin. From there on the browser talks directly to the
   sandbox — Cloud is out of the data path.
3. LLM calls the agents make on the guest's behalf go through Cloud's
   virtual-key gateway, but billed to the owner. Usage is tagged with
   the guest's session for future per-share analytics.

Revoking a share deletes the session file from the sandbox, so the
sandbox's auth layer rejects the guest on the next request.

## Caveats

- **Any teammate in the org can use a shared link** once they have
  the URL. There is no per-recipient ACL — if you need that, run
  separate WorkOS organisations.
- **The owner's sandbox must be reachable** for guests to use the
  app. Cloud wakes a paused sandbox on the first guest request, so
  expect a one-off cold-start delay (~10–20 s) the first time
  somebody opens a shared link after idle.
- **Owner pays for guest usage.** LLM tokens, browser tools,
  Composio calls — anything the agent does on the guest's behalf
  hits the owner's account through the virtual-key gateway.
- **Referer-scope is soft.** Cloud checks that requests originate
  from the share page via the browser's `Referer` header. A
  determined user with DevTools can forge the header from the share
  page, so do not rely on this as the only line of defence for
  sensitive data inside your app — treat anyone with the link as a
  trusted teammate.
