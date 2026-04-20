# Web apps

Shmastra can generate a full standalone web app for your agent or
workflow — a dashboard, a custom chat surface, a review UI — served
right out of your Mastra project at `/shmastra/apps/<name>`.

Apps run in the browser as-is: no build step, no bundler. The stack is
Preact + [DaisyUI](https://daisyui.com/) (on Tailwind) + `htm` for
JSX-less templates, all loaded via import maps from `esm.sh`.

## Example prompts

> *Make a dashboard for the **sales-pipeline** workflow with a bar
> chart of stages.*

> *Build a chat UI for the **support-agent** that I can embed in our
> website.*

> *Create a review app that lets me approve or reject invoices coming
> out of **invoiceWorkflow**.*

> *Show the results of the last 50 runs of **weeklyReport** as a
> sortable table.*

## What happens

1. The widget scaffolds a new folder under
   `src/mastra/public/apps/<name>/` with an `index.html`, an `app.js`
   root component, and component files under `components/`.
2. It calls your Mastra agents/workflows/tools directly via the
   Mastra client — you get a real, working UI on the first build.
3. If the app needs a custom backend route, the widget creates it in
   `src/mastra/routes/` under `/shmastra/api/apps/<name>/` and
   registers it.
4. Mastra Studio shows the app link; opening it navigates to
   `/shmastra/apps/<name>` in a new tab.

## Components ready out of the box

- **`AgentChat`** — a streaming chat surface for any agent, with
  file uploads and an optional side-panel mode.
- **Charts** — line, bar, pie; Chart.js wired via the import map.
- **DaisyUI** components — buttons, cards, tables, modals, themes
  (light/dark), everything you'd expect.
- **Lucide icons** — imported via ESM.

## Iterate

- *"Add a date-range picker to the dashboard."*
- *"Make the chart update live when the workflow finishes."*
- *"Add a button that exports the table as CSV."*

The widget edits individual component files, so changes stay scoped.

## Agent-linked output

An agent can return a markdown link to the app it just generated —
the widget renders it as a normal link:

```markdown
Here is your application: [Open dashboard](/shmastra/apps/sales)
```

Clicking it opens the app (served at `/shmastra/apps/<name>` by the
Shmastra dev server) in a new tab.

## Tips

- **Say which workflow or agent drives the app.** *"A dashboard for
  `salesWorkflow`"* is unambiguous; *"a dashboard"* isn't.
- **Skip the full app for one-off visuals.** If you just want a chart
  inside a chat reply, see [Rich chat replies](/shmastra/features/rich-chat)
  — the agent can generate an HTML file and return a link to it.
- **No build step = fast iteration.** Every save hot-reloads the
  dev server.
