# Channel: Liveblocks

Liveblocks is a real-time collaboration platform. The adapter lets your agent
participate in Liveblocks comment threads — useful for in-app AI assistants
built on top of Liveblocks Rooms.

## Before you start

1. In the [Liveblocks dashboard](https://liveblocks.io/dashboard) open your
   project and go to **Webhooks**.
2. Create a webhook and subscribe to three events:
   - `commentCreated`
   - `commentReactionAdded`
   - `commentReactionRemoved`
3. Copy the **Webhook Signing Secret** (prefixed `whsec_…`).
4. Go to **API Keys** and copy the **Secret Key** (prefixed `sk_…`).

## Example prompts

> *Connect the **assistant** agent to Liveblocks.*

> *Add a Liveblocks bot to my **collab** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `ASSISTANT_AGENT_LIVEBLOCKS_SECRET_KEY` | password |
   | `ASSISTANT_AGENT_LIVEBLOCKS_WEBHOOK_SECRET` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createLiveblocksAdapter } from '@liveblocks/chat-sdk-adapter'
   import { createAgentChannels } from '../shmastra'

   export const assistantAgent = new Agent({
     id: 'assistant-agent',
     channels: createAgentChannels({
       adapters: {
         liveblocks: createLiveblocksAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL to paste into the Liveblocks dashboard:

   ```
   {PUBLIC_URL}/api/agents/assistant-agent/channels/liveblocks/webhook
   ```

4. Post a comment in a Liveblocks Room — the agent replies in the thread.

## Tips

- **Bot user ID** — Liveblocks identifies the bot by a stable `botUserId`; the
  adapter uses the agent ID by default. If your app already has a specific bot
  user in its permission rules, pass that ID in the adapter config.
- **Reactions** — the `commentReactionAdded` event lets users trigger the agent
  by reacting to a comment (e.g. react with 🤖 to ask the agent to elaborate).
