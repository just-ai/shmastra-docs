# Workflow scheduling

Shmastra Cloud can run any Mastra workflow on a schedule — daily at a
fixed time, every few hours, or on any cron expression you choose.
Schedules are created by your assistant; you never touch a config file.

## How it works

Shmastra Cloud injects a `shmastra-cloud` MCP server into every sandbox
automatically. The coding assistant uses that server's tools to create
and manage schedules on your behalf. At fire time, Cloud wakes the
sandbox if needed, triggers the workflow run, and records the outcome —
including the full observability trace.

## Creating a schedule

Just ask the widget:

> *Schedule my **weekly-report** workflow to run every Monday at 9 am
> Moscow time.*

> *Run the **invoice-processor** workflow at midnight on the first of
> every month with `{ "team": "billing" }` as input.*

The assistant will:

1. Confirm which workflow to use and when to run it.
2. Confirm the input data (it must match the workflow's declared input
   schema — the server validates it before saving).
3. Create the schedule and report the cron expression and next fire time.

## Only workflows can be scheduled

Schedules target **Mastra workflows**, not raw agents. Agents require a
conversation thread for observable memory and cannot be triggered
in isolation.

If you want to schedule agent work, ask the widget to wrap the agent
call in a workflow step:

> *Wrap my **research-agent** in a workflow so I can schedule it.*

The widget will generate a minimal workflow with a single
`createAgentStep`.

## Viewing schedules and run history

A **Tasks** button appears in the Mastra Studio sidebar inside your
sandbox. Click it to open the schedules panel. For each schedule you
can see:

- The workflow name, cron expression, and next fire time.
- A list of past runs with status, timestamp, and a link to the
  observability trace.

## Managing schedules

Talk to your assistant:

| What to say | What happens |
|---|---|
| *"Pause the weekly-report schedule."* | Assistant disables it. |
| *"Change invoice-processor to run at 6 am."* | Assistant updates the cron. |
| *"Delete the weekly-report schedule."* | Assistant removes it. |
| *"Show me the last 5 runs of invoice-processor."* | Assistant fetches and summarises run history. |

## Caveats

- **The sandbox must be running** for a schedule to fire. Cloud
  automatically wakes a sleeping sandbox before each run.
- **`input_data` is validated** against the workflow's input schema
  when you create or update a schedule. If you change the workflow's
  input schema after a schedule exists, the next fire will surface a
  validation error — ask the assistant to update the schedule with the
  corrected input.
- **Cron times are in UTC by default.** Always tell the assistant your
  timezone when you want a local time (e.g., *"9 am Paris time"*). The
  assistant already has your browser timezone in context, so a simple
  *"9 am my time"* is enough.
