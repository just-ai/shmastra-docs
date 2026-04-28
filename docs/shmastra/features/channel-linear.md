# Channel: Linear

The Linear adapter lets your agent comment on issues and respond to @-mentions
in issue threads. Good for triage agents, estimation bots, and sprint planners.

## Before you start

Go to Linear **Settings → API** and choose one auth method:

- **Personal API key** — instant, for single-workspace use.
- **OAuth access token** — for apps that users install via OAuth.
- **Client credentials** — for machine-to-machine flows.

Also create a **Webhook** in Settings → API → Webhooks. Choose the events
**Comments** and, if you want agent sessions, **Agent session events**.

## Example prompts

> *Connect the **triage** agent to Linear.*

> *Add Linear to my **estimator** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `TRIAGE_AGENT_LINEAR_API_KEY` | password |
   | `TRIAGE_AGENT_LINEAR_WEBHOOK_SECRET` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createLinearAdapter } from '@chat-adapter/linear'
   import { createAgentChannels } from '../shmastra'

   export const triageAgent = new Agent({
     id: 'triage-agent',
     channels: createAgentChannels({
       adapters: {
         linear: createLinearAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL to paste into Linear:

   ```
   {PUBLIC_URL}/api/agents/triage-agent/channels/linear/webhook
   ```

4. @-mention the bot in a Linear issue comment — the agent replies.

## Tips

- **Mode: comments vs agent-sessions** — the adapter defaults to `comments`
  mode (reacts to new comments). Agent-session mode gives the bot more
  structured control over issue state; subscribe to the matching Linear events.
- **Reactions** — subscribe to "Emoji reactions" in the webhook to let users
  trigger actions by reacting to comments.
