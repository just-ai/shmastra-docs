# Workflow scheduling

Shmastra Cloud can run any recurring task on a schedule — daily at a
fixed time, every few hours, or on any cron expression you choose.
Just describe what you want and when; the assistant takes care of
the rest.

## Creating a schedule

Tell the widget what the task is and when it should run:

> *Send me a Telegram summary of open GitHub issues every weekday at
> 9 am.*

> *Every Monday morning have the research agent pull last week’s
> analytics and post a digest to our Slack channel.*

> *Run the **invoice-processor** on the first of every month with
> `{ "team": "billing" }` as input.*

The assistant will clarify anything it needs (which agent, which
channel, what data), then create the schedule and confirm the next
fire time. You don’t need to know cron syntax or anything about
workflows. The widget already knows your local timezone from the
browser, so *“9 am”* or *“during working hours”* is enough.

## Viewing schedules and run history

A **Tasks** button appears in the Mastra Studio sidebar. Click it to
open the schedules panel where you can see:

- The task name, cron expression, and next fire time.
- A list of past runs with status, timestamp, and a link to the
  full observability trace.

## Managing schedules

Just talk to the assistant:

| What to say | What happens |
|---|---|
| *“Pause the weekly digest.”* | Assistant disables the schedule. |
| *“Change the digest to 6 am.”* | Assistant updates the cron. |
| *“Delete the invoice-processor schedule.”* | Assistant removes it. |
| *“Show me the last 5 runs.”* | Assistant fetches and summarises run history. |

## Under the hood

Schedules are always backed by a **Mastra workflow**. If the task you
describe doesn’t already have one, the assistant creates a lightweight
workflow automatically — typically a single step wrapping your agent
call.

The schedule is stored in Supabase and fired by a pg_cron job.
On each fire, Shmastra Cloud:

1. Wakes the sandbox if it’s sleeping.
2. Calls the workflow via `@mastra/client-js`, passing your input data
   as the run payload.
3. Polls the run status and stores the result with a link to the
   observability trace.

The `shmastra-cloud` MCP server — injected automatically into every
sandbox — exposes the tools the assistant uses:
`create_workflow_schedule`, `list_schedules`, `update_schedule`,
`delete_schedule`, and `list_runs`.

## Caveats

- **The sandbox must be running** for a schedule to fire. Cloud wakes
  a sleeping sandbox automatically before each run.
- **Input data is validated** against the workflow’s input schema when
  a schedule is created or updated. If the workflow’s inputs change
  later, the assistant will flag it at the next update.
