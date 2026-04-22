# Healer agent

Every sandbox runs a second pm2 process alongside the Mastra dev
server: the **healer**. When the dev server crashes, the healer
diagnoses the cause and fixes it — no human, no ticket, usually no
downtime.

## Why it exists

User sandboxes are real dev environments. People experiment, break
things, and walk away. Without the healer, every messed-up agent or
bad dependency install would page you. With it, most failures recover
themselves.

## How crashes are detected

Four independent signals:

1. **pm2 process exit.** The healer subscribes to the pm2 bus and
   listens for `exit` events from the `shmastra` process. `shmastra`
   is configured with `max_restarts: 1` so pm2 hands control to the
   healer quickly instead of crash-looping.
2. **Health-check polling.** Every 20 seconds the healer hits
   `http://localhost:4111/health`. On failure it waits 10 s and
   retries. Two consecutive failures *while pm2 reports `online`*
   (i.e. the process is running but the server isn't responding)
   trigger a heal.
3. **Stuck bundling.** The healer tails `.logs/shmastra.log`. If the
   last line is `Bundling…` and the file hasn't been modified in
   20 s, it restarts the dev server (a lightweight action — this
   alone doesn't trigger a full heal).
4. **Resource pressure.** Every 15 seconds the healer reads memory
   usage from the cgroup filesystem and the 1-minute CPU load average.
   If either stays above the threshold (> 90 % of the cgroup memory
   limit, or > 2.5 load per CPU core) for four consecutive checks
   (≈ 1 minute of sustained pressure), it triggers an *emergency
   resource heal*: orphan Node processes are killed and the dev server
   is restarted. This handles situations where the process is alive
   but OOM-thrashing rather than serving requests.

## How the heal works

When any signal confirms a crash:

1. **Status → `healing`.** The healer POSTs
   `/api/sandbox/heal` on the Cloud deployment; Supabase updates
   the sandbox row; the Manage UI and the user's workspace reflect
   the status.
2. **A Mastra agent spins up.** Claude Sonnet with full workspace
   tools (file read/write, shell commands) and a custom
   `restart_shmastra` tool that restarts pm2 and waits up to 30 s
   for a healthy response.
3. **Diagnose & fix.** The agent reads the tail of the server log,
   inspects suspect files, makes *minimal* targeted code fixes, then
   restarts the server.
4. **Retry loop.** Up to **3 attempts** total. Each retry includes
   context about why the previous fix didn't work.
5. **Outcome.**
   - **Success** → the agent commits its fix (`git commit`), reports
     `status: "ready"`, and restarts itself to free memory.
   - **Failure** → after 3 attempts it reports `status: "broken"`
     with a summary and stops to avoid infinite loops.

## Status transitions

```
running → (crash) → healing → ready
                            → broken (after 3 failed attempts)
```

## What the healer can touch

- Any project file **except** `src/shmastra` (Shmastra's engine, not
  user code).
- Shell commands (`pnpm install`, `pnpm dry-run`, etc.).
- pm2 (via `restart_shmastra`).
- `.env` — checks for missing vars.
- Git — commits accepted fixes.

## pm2 config

Both processes are defined in `scripts/sandbox/ecosystem.config.cjs`:

| Process | Command | Auto-restart | Max restarts |
|---|---|---|---|
| `shmastra` | `pnpm dev` | yes | 1 |
| `healer` | `scripts/sandbox/healer.mts` | yes | unlimited |

`shmastra`'s low restart cap is deliberate — it means pm2 gives up
fast and the healer takes over.

## Authentication back to the cloud

The `/api/sandbox/heal` endpoint on Cloud authenticates the healer
using the sandbox's virtual key (`MASTRA_AUTH_TOKEN`). The real
provider keys stay on Vercel; the healer's Claude calls route through
the same `/api/gateway/*` Edge proxy.

## What to do when a sandbox is `broken`

It means the healer gave up. Open the [Manage UI](/cloud/manage-ui/):

1. **Logs → healer** — see the last few attempts and what they
   tried.
2. **Files** — fix the obvious problem.
3. **Terminal** — `pm2 restart shmastra` and verify.
4. If that's hopeless: **Chat** a Claude Sonnet session yourself,
   ask it to investigate — it has the same tools as the healer but
   no 3-attempt cap.
