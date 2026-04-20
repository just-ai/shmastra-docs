# Composio toolkits

[Composio](https://composio.dev) is a catalog of 200+ ready-to-use
third-party integrations — Gmail, Google Drive, Slack, Notion, GitHub,
HubSpot, Linear, Stripe, and so on. Shmastra can search the catalog,
handle the OAuth dance for you, and attach the right tools to your
agent in a single prompt.

## Prerequisite

Set `COMPOSIO_API_KEY` in `.env`. You can do this during the
[setup wizard](/shmastra/setup-wizard) or anytime after by saying:

> *Set my Composio API key.*

The key lives at <https://platform.composio.dev>.

## Example prompts

> *Give the **support-agent** access to Gmail — read and send.*

> *Connect this agent to Google Drive.*

> *Let the **it-helpdesk** agent create Linear tickets.*

> *Give the research agent Notion read access.*

## What happens

1. The widget calls `search_toolkits` with keywords from your prompt.
   Results include each toolkit's supported tool names and its current
   `connected` status for you.
2. If the toolkit isn't connected yet, it calls `connect_toolkit` —
   this opens Composio's OAuth popup in a new tab, you authorise, and
   the popup closes automatically. See
   [One-click OAuth](/shmastra/features/one-click-oauth).
3. Once connected, the widget pulls the relevant tool names (e.g.
   `SEND_GMAIL`, `READ_GMAIL`) and wires them into the agent:

   ```ts
   import { getConnectedTools } from '../shmastra/connections'

   export const supportAgent = new Agent({
     tools: createAgentTools({
       ...(await getConnectedTools(['SEND_GMAIL', 'READ_GMAIL'])),
     }),
   })
   ```
4. Hot-reload. The agent can now read and send mail.

## Using a toolkit tool in a workflow

If you need a Composio tool **outside** an agent — say, as a step in
a workflow — ask the widget for it explicitly:

> *Make a workflow step that sends an email via Gmail with this
> subject and body.*

The widget fetches the tool's input/output schema
(`get_toolkit_tool_schema`) and wires it as a proper `createStep()`.

## Tips

- **Name what you want.** *"Give this agent Gmail access — reading
  only"* is clearer than *"connect email"*.
- **Multiple toolkits per agent** — no limit. The widget will add
  each integration as you ask.
- **Disconnect / reconnect** — ask the widget: *"Disconnect the
  Google Drive toolkit for this account."* It calls the matching
  Composio API.
- **Prefer Composio over hand-rolled APIs** when there's an obvious
  match. You get OAuth refresh, rate-limit handling, and schema
  validation for free.
