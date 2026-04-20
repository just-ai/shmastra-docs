# What is Shmastra Cloud

Shmastra Cloud is a **Next.js app you deploy once on Vercel** that
turns Shmastra into a shared, browser-accessible product for your
team. Think of it as a hosted IDE for AI agents.

## The shape of the system

- **Next.js app on Vercel** — handles auth, routing, and proxies
  sandbox traffic.
- **WorkOS AuthKit** — single sign-on for your team. Users sign in
  through your corporate IdP (or email OTP during development).
- **Supabase** — stores the `users` and `sandboxes` tables plus the
  virtual-key column.
- **E2B** — provides the per-user Linux sandboxes where Mastra Studio
  and Shmastra actually run.
- **Virtual-key gateway** — an Edge route that swaps each sandbox's
  `vk_<userId>_<hex>` token for your real OpenAI / Anthropic / Google /
  Composio keys before proxying to the provider.

## User journey

```
teammate opens yourcompany.shmastra.com
  → WorkOS sign-in
  → Cloud calls provisionSandbox()
       → E2B spawns a sandbox from the shmastra template
       → Shmastra's dev server starts on port 4111 via pm2
       → healer agent runs alongside as a second pm2 process
  → Cloud proxies /api/mastra/* to the sandbox
  → Mastra Studio opens in the browser, Shmastra widget attached
  → teammate types prompts; Shmastra generates code, hot-reloads, etc.
```

After 10 minutes of inactivity the sandbox pauses automatically. It
resumes on the next request — work is preserved on the sandbox's
persistent filesystem.

## What it is **not**

- Not multi-tenant shared infrastructure. Each user gets their own
  sandbox — isolated filesystem, isolated processes, isolated
  environment variables.
- Not a rebrand of Mastra Studio. It's Mastra Studio plus the
  [Shmastra](/shmastra/) template plus the cloud plumbing.
- Not an API product. Agents your teammates build are theirs — hosted
  in their sandbox. You can export and publish them as standalone
  Mastra apps whenever you want.

## What you do as the engineer

You own four ongoing responsibilities:

1. **Auth.** Invite team members in WorkOS; manage the org.
2. **Credits.** Provide LLM API keys; watch Composio / E2B billing.
3. **Updates.** Roll out Shmastra upgrades via the
   [Manage UI](/cloud/manage-ui/) so everyone stays on the same
   version.
4. **Recovery.** If the healer agent gives up on a sandbox, you open
   the Manage UI and unstick it by hand.

Each of those has its own page in this section.
