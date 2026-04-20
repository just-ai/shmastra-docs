# Chat with agent

Every sandbox has an admin-side chat session: a Claude Sonnet agent
that runs inside the Manage UI's process, connected to the sandbox
over E2B. Use it for debugging, one-off fixes, and spelunking without
opening a terminal.

## Where to find it

[Sandbox table](/cloud/manage-ui/sandbox-table) → click a row →
**Chat** tab (or **Chat** slide-out).

## What the agent can do

The session is a Mastra agent with workspace tools:

- **Read and edit** any file on the sandbox (except `src/shmastra`
  internals, matching the Shmastra convention).
- **Execute shell commands** — `pnpm install`, `pm2 restart`,
  anything you'd run yourself.
- **Manage processes** — restart `shmastra` or `healer`.
- **Inspect state** — read env vars, check `.storage/`, tail logs.

## Example prompts

> *This sandbox has been stuck on `broken` for an hour. Look at the
> healer logs and tell me what it tried.*

> *One of the channels stopped working. Check the Telegram env vars
> and confirm they look right.*

> *Run `pm2 restart shmastra` and watch until the health check
> passes.*

> *Inspect this user's agent file at `src/mastra/agents/support.ts`
> — why does it fail at startup?*

## When to use chat vs terminal

| Use chat when | Use [terminal](/cloud/manage-ui/terminal) when |
|---|---|
| You want the agent to figure it out. | You know exactly what to run. |
| The fix may touch multiple files. | A one-liner does it. |
| You want a narrated explanation. | You want raw output. |

Chat and terminal share the same sandbox; anything one does, the
other can see immediately.

## Privacy

The Manage UI is a local tool you run from your machine. Chat
sessions don't persist anywhere unless you scroll up before closing
the panel. Conversations go to Anthropic via the `ANTHROPIC_API_KEY`
in your `.env.local` — no separate account, no extra config.

## Interactive CLI alternative

Prefer a terminal?

```shell
npx tsx manage/index.mts --agent <sandbox_id>
```

Same agent, same tools, standard readline interface. Handy for
headless debugging over SSH.
