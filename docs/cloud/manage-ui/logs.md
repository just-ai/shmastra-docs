# Logs

Syntax-highlighted pm2 logs from inside the sandbox. Two processes,
two streams.

## Where to find it

[Sandbox table](/cloud/manage-ui/sandbox-table) → row → **Logs** tab.

## The two streams

- **`shmastra`** — the Mastra dev server (`pnpm dev`). Shows
  incoming requests, Shmastra widget activity, build output,
  TypeScript errors, and any `console.log` from user agents.
- **`healer`** — the [healer agent](/cloud/day-2/healer-agent).
  Shows crash detection signals, healing attempts, the agent's
  reasoning, and outcomes.

Switch between them with the tab at the top of the panel.

## Filters

- **Lines** — tail the last N lines (default 500).
- **Follow** — switch to a live tail that appends new lines as they
  come in.
- **Search** — client-side substring match; highlights matches in
  place.

## Log paths inside the sandbox

If you prefer to tail from a [terminal](/cloud/manage-ui/terminal):

```shell
tail -f .logs/shmastra.log
tail -f .logs/healer.log
```

Both files live at the project root inside the sandbox.

## Tips

- **When a sandbox is `broken`.** Start with `healer` logs — they
  summarise what the agent tried. Then jump to `shmastra` logs for
  the underlying error.
- **"Bundling…" stuck.** The healer already watches for this (it
  restarts the dev server when the log hasn't moved in 20 s). If
  you see it linger in the UI, check if the healer itself is dead.
- **Long output.** For a full capture (thousands of lines) the
  terminal + `cat .logs/shmastra.log | head -10000` is more
  efficient than scrolling the UI.
