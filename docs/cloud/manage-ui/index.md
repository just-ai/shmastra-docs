# Manage UI

The Manage UI is a local web app you run from your laptop to manage
every sandbox Cloud has provisioned. It talks to Supabase (to list
users and sandboxes), to E2B (to connect, execute, read files), and
to Anthropic (to chat inside a sandbox).

Because it uses your service-role credentials, **you run it locally
from your own machine, never on a public server.**

## Launching it

From the `shmastra-cloud` checkout:

```shell
npx tsx manage/index.mts --serve
```

Opens on `http://localhost:3737`. For a custom port:

```shell
npx tsx manage/index.mts --serve 8080
```

## Required env vars

The Manage UI reads the same `.env.local` as the main app. These are
the bare minimum it needs (most of them you already have):

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
E2B_API_KEY=...
ANTHROPIC_API_KEY=...
```

By default the Manage UI loads `.env.local` and `.env` (the **local**
profile). To manage multiple environments without editing `.env.local`,
create named profiles and switch via the header dropdown. See
[Environment profiles](/cloud/manage-ui/env-profiles).

## What's inside

- [Environment profiles](/cloud/manage-ui/env-profiles) — switch
  between named env profiles (local, prod, staging…) from the header
  bar.
- [Sandbox table](/cloud/manage-ui/sandbox-table) — every sandbox
  with status and quick actions.
- [Applying updates](/cloud/manage-ui/applying-updates) — the 9-phase
  pipeline, one or all sandboxes, streaming logs.
- [Chat with agent](/cloud/manage-ui/chat-with-agent) — Claude
  Sonnet with full sandbox access.
- [Logs](/cloud/manage-ui/logs) — pm2 logs from `shmastra` and
  `healer`.
- [Files](/cloud/manage-ui/files) — full file manager.
- [Terminal](/cloud/manage-ui/terminal) — arbitrary shell commands.
- **Stats** — live CPU, memory, and disk sparklines for the sandbox
  process, updated every few seconds.
- **Trace** — observability view showing recent agent traces streamed
  from inside the sandbox.

## CLI alternatives

The same pipeline works from the command line when you don't want
the web UI:

```shell
npx tsx manage/index.mts <sandbox_id>       # update one sandbox
npx tsx manage/index.mts                    # update every sandbox (sequential)
npx tsx manage/index.mts --agent <sandbox>  # interactive CLI chat with the sandbox
```

Use the CLI for scripted runs and CI-style operations; use the web
UI for interactive admin.
