# Creating workflows

Workflows are fixed pipelines: input goes in, steps run, output comes
out. No conversation. Use them when the task has a clear shape — a
data pipeline, a document transformation, an approval flow — and you
don't need the LLM to decide what to do next.

## Example prompts

> *Make a workflow that takes an uploaded invoice PDF, extracts line
> items, and returns them as JSON.*

> *Build a workflow that summarises a transcript, translates it to
> English, and emails the result to me.*

> *Create a weekly-report workflow: pull GitHub PRs from the last 7
> days, classify them, and produce a markdown report.*

## What happens

1. The widget asks what the inputs are (plain fields, uploaded files,
   URLs) and what the final output should be.
2. It scaffolds `src/mastra/workflows/<yourWorkflowId>/` with one TS
   file per step, plus an `index.ts` that composes them via
   `createWorkflow().then(step1).then(step2).commit()`.
3. File inputs get a special `file_field_*` property in the Zod schema
   — Shmastra knows to store uploads in `files/` and pass the path.
4. Each step is either a `createStep()` from a tool, or a
   `createAgentStep()` that wraps an agent call.
5. A dry-run build confirms it compiles; Studio shows the workflow at
   `/workflows/<id>` with a Run button.

## Structured output from agent steps

By default, `createAgentStep()` returns `{ text: string }` — the
agent's raw response. When the next step needs typed data rather than
free text, pass a Zod schema via `structuredOutput`:

```typescript
import { z } from 'zod';
import { createAgentStep } from '@mastra/shmastra/workflow';

const InvoiceSchema = z.object({
  invoiceNumber: z.string(),
  lineItems: z.array(z.object({
    description: z.string(),
    amount: z.number(),
  })),
  total: z.number(),
});

const extractStep = createAgentStep(extractorAgent, {
  structuredOutput: { schema: InvoiceSchema },
});
```

The step now returns the parsed object directly — downstream steps
receive `invoiceNumber`, `lineItems`, and `total` as typed fields
without any text parsing.

You don't need to write this by hand. Just tell the widget:

> *Make the extraction step return a typed object with the invoice fields.*

Shmastra will add the schema and update all downstream steps to use
the typed output.

## Running a workflow

From Mastra Studio's workflow page you can trigger a run manually with
the input form the widget generated. You can also call it from another
agent, another workflow, or over the REST API.

## Running on a schedule

Any workflow (or agent task) can run automatically on a cron. Just
tell the widget when and how often:

> *Run this every Monday at 9 am.*

> *Send me the result in Telegram every weekday morning.*

See [Workflow scheduling](/cloud/scheduling) for details
(Shmastra Cloud only).

## Iterate

- *"Add a step that also posts the result to our #reports channel on
  Slack."*
- *"Before step 2, validate that the PDF has an invoice number."*
- *"Split step 3 into smaller steps for each line item."*

The widget edits individual step files — it's happy to refactor.

## Agents vs workflows

| Use an agent when | Use a workflow when |
|---|---|
| The user will chat back and forth. | Input is a form; output is a result. |
| The LLM needs to decide what to do next. | The steps are fixed. |
| You want memory across turns. | Each run is independent. |

When in doubt, build both — an agent can call a workflow as a tool, and
a workflow can have an agent as one of its steps.
