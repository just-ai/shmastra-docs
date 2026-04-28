# Trace

The **Trace** panel shows recent agent traces streamed from inside the
selected sandbox.

## Opening it

Click on any sandbox row in the [Sandbox table](/cloud/manage-ui/sandbox-table)
to open the slide panel, then choose the **Trace** tab.

## What you see

A live feed of Mastra observability traces: agent runs, tool calls,
LLM calls, and workflow steps — the same data available in Mastra
Studio's **Traces** view, but proxied through the Manage UI so you
can inspect it without opening the sandbox URL.

Each trace entry shows:

- **Timestamp** — when the run started.
- **Name** — the agent or workflow that ran.
- **Status** — `success`, `error`, or `running`.
- **Duration** — total wall-clock time.
- Expandable span tree for inspecting individual tool calls and LLM
  completions.

## When to use it

- **Verifying a scheduled workflow fired** — confirm the run logged
  and produced expected output without opening the full Mastra Studio.
- **Investigating a broken agent** — check which tool call threw an
  error or where the LLM produced an unexpected response.
- **Comparing runs before/after an update** — open the panel
  immediately after applying an update to confirm the new code path
  ran successfully.

## See also

- [Workflow scheduling](/cloud/scheduling) — setting up recurring
  runs and viewing run history.
- [Logs](/cloud/manage-ui/logs) — raw pm2 process output when traces
  aren't enough.
