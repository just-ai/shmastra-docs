# Workflow scheduling

Shmastra Cloud can run any recurring task on a schedule — daily at a
fixed time, every few hours, or on any cron expression you choose.
Just describe what you want; the assistant builds and wires up
everything for you.

## How it works

Shmastra Cloud injects a `shmastra-cloud` MCP server into every sandbox
automatically. The assistant uses that server's tools to create and
manage schedules on your behalf. At fire time, Cloud wakes the sandbox
if needed, runs the task, and records the outcome — including the full
observability trace.

## Creating a schedule

Just ask the widget what you want and when:

> *Send me a daily Telegram summary of open GitHub issues at 9 am on
> weekdays.*

> *Run the **invoice-processor** workflow at midnight on the first of
> every month with `{ "team": "billing" }` as input.*

> *Every Monday morning, have the research agent pull last week's
> analytics and post a digest to our Slack channel.*

The assistant will:

1. Ask any clarifying questions (which agent, what data, which
   channel, etc.) if you haven't specified.
2. Create or adapt the necessary workflow and wire up the schedule.
3. Confirm the cron expression and next fire time.

You don't need to know anything about workflows or cron syntax —
just describe the goal.

## Viewing schedules and run history

A **Tasks** button appears in the Mastra Studio sidebar inside your
sandbox. Click it to open the schedules panel. For each schedule you
can see:

- The task name, cron expression, and next fire time.
- A list of past runs with status, timestamp, and a link to the
  observability trace.

## Managing schedules

Talk to your assistant:

| What to say | What happens |
|---|---|
| *"Pause the weekly-report schedule."* | Assistant disables it. |
| *"Change the digest to run at 6 am instead."* | Assistant updates the cron. |
| *"Delete the invoice-processor schedule."* | Assistant removes it. |
| *"Show me the last 5 runs of the digest."* | Assistant fetches and summarises run history. |

## Caveats

- **The sandbox must be running** for a schedule to fire. Cloud
  automatically wakes a sleeping sandbox before each run.
- **Cron times are in UTC by default.** Always mention your timezone
  or working hours when you want a local time (e.g., *"9 am my time"*
  or *"during Moscow business hours"*). The assistant already has your
  browser timezone in context, so a simple *"9 am my time"* is enough.
