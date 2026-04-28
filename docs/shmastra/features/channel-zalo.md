# Channel: Zalo

Zalo is one of Vietnam's largest messaging platforms. The adapter connects
your agent as a Zalo Bot to handle messages from Zalo users.

::: info Community adapter
This adapter is maintained by the community: `chat-adapter-zalo`.
:::

## Before you start

1. Register a **Zalo Bot** at [developers.zalo.me](https://developers.zalo.me).
2. Copy the **Bot Token** (format: `12345689:abc-xyz`).
3. Choose a **Webhook Secret** — any random string for request verification.
4. In the Zalo Bot dashboard set the webhook URL (see below) and verify it.

## Example prompts

> *Connect the **customer-agent** to Zalo.*

> *Add Zalo messaging to my **sales** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `CUSTOMER_AGENT_ZALO_BOT_TOKEN` | password |
   | `CUSTOMER_AGENT_ZALO_WEBHOOK_SECRET` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createZaloAdapter } from 'chat-adapter-zalo'
   import { createAgentChannels } from '../shmastra'

   export const customerAgent = new Agent({
     id: 'customer-agent',
     channels: createAgentChannels({
       adapters: {
         zalo: createZaloAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL to paste into the Zalo Bot dashboard:

   ```
   {PUBLIC_URL}/api/agents/customer-agent/channels/zalo/webhook
   ```

4. Send a message to the Zalo Bot — the agent replies.

## Tips

- **Webhook verification** — Zalo sends a verification request when you first
  register the URL; the adapter handles it automatically.
- **Rich messages** — Zalo supports image and file attachments. The agent sees
  them the same way it would via the chat widget.
