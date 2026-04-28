# Channel: Webex

Cisco Webex lets your agent participate in Webex spaces and direct messages,
with support for adaptive cards and rich formatting.

::: info Community adapter
This adapter is maintained by the community: `@bitbasti/chat-adapter-webex`.
:::

## Before you start

1. Go to the [Webex Developer Portal](https://developer.webex.com) and create
   a **Bot** under My Webex Apps.
2. Copy the **Bot Access Token**.
3. Choose a random **Webhook Secret** string — you'll set this in both the
   env vars and the webhook registration.

## Example prompts

> *Connect the **support-agent** to Webex.*

> *Add Webex to my **helpdesk** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `SUPPORT_AGENT_WEBEX_BOT_TOKEN` | password |
   | `SUPPORT_AGENT_WEBEX_WEBHOOK_SECRET` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createWebexAdapter } from '@bitbasti/chat-adapter-webex'
   import { createAgentChannels } from '../shmastra'

   export const supportAgent = new Agent({
     id: 'support-agent',
     channels: createAgentChannels({
       adapters: {
         webex: createWebexAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL. Register **two webhooks** in the Webex
   Developer Portal:

   | Resource | Event |
   |---|---|
   | `messages` | `created` |
   | `attachmentActions` | `created` |

   Both point to:

   ```
   {PUBLIC_URL}/api/agents/support-agent/channels/webex/webhook
   ```

4. Add the bot to a Webex space and mention it — the agent replies.

## Tips

- **Direct messages** — the bot can receive 1:1 messages without being in a
  space. Users just open a direct conversation with the bot in the Webex app.
- **Adaptive cards** — the agent can return card responses; subscribe to
  `attachmentActions` to handle button clicks on those cards.
