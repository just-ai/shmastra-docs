# Inspect & fix

Sometimes an agent or workflow misbehaves. Inspect & fix is the
shortcut for debugging one in place.

## How it works

The widget is aware of the page you're on in Mastra Studio. When you're
looking at `/agents/supportAgent` or `/workflows/invoiceWorkflow`, the
coding agent knows that's the thing you're complaining about.

## Example prompts

Navigate to the broken agent or workflow, then type:

> *This agent keeps answering in Russian. Make it always reply in
> English.*

> *The support agent doesn't know about our refund policy. Teach it
> using `handbook.pdf`.*

> *This workflow fails when the invoice has no VAT number. Make it
> default to 0% and log a warning.*

> *The sales-advisor is too chatty. Tone it down and cap responses to
> three sentences.*

## What happens

1. The coding agent reads the current file(s) under
   `src/mastra/agents/…` or `src/mastra/workflows/…`.
2. It may open the observability tab behind the scenes to check recent
   traces, then decides what to change — instructions, model tier,
   tool set, memory configuration, or a specific workflow step.
3. `apply_changes` runs a dry-run build; hot-reload pushes the fix
   live. The next invocation reflects the change.

## Tips

- **Cite a failing example.** *"Here's a message it got wrong: …"*
  gives the agent something concrete to test against.
- **Point at the right step.** For workflows with many steps, say
  *"the extraction step"* or *"step 3"* so the agent opens the right
  file.
- **Use it to rename.** *"Rename this agent to customer-support and
  update the Telegram env vars accordingly."* works too.
