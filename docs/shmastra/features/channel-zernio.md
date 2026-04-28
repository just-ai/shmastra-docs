# Channel: Zernio

Zernio is a unified social-media DM platform that covers Instagram, Facebook,
X (Twitter), and others through a single API. Connect once and your agent
handles DMs across all linked social accounts.

## Before you start

1. Sign up at [zernio.com](https://zernio.com) and enable the **Inbox** addon
   on your account.
2. Connect your social accounts (Instagram, Facebook page, X, etc.) in the
   Zernio dashboard.
3. Go to **Settings → API** and create an API key.
4. In the Zernio dashboard configure a webhook, subscribe to `message.received`
   and `comment.received`, and set a webhook secret.

## Example prompts

> *Connect the **social-agent** to Zernio.*

> *Add Instagram and Facebook DMs to my **marketing** agent via Zernio.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `SOCIAL_AGENT_ZERNIO_API_KEY` | password |
   | `SOCIAL_AGENT_ZERNIO_WEBHOOK_SECRET` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createZernioAdapter } from '@zernio/chat-sdk-adapter'
   import { createAgentChannels } from '../shmastra'

   export const socialAgent = new Agent({
     id: 'social-agent',
     channels: createAgentChannels({
       adapters: {
         zernio: createZernioAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL to paste into the Zernio dashboard:

   ```
   {PUBLIC_URL}/api/agents/social-agent/channels/zernio/webhook
   ```

4. Send a DM to any connected social account — the agent replies.

## Tips

- **Multiple platforms, one agent** — all social DMs from all connected
  accounts arrive in the same agent thread. Use `message.platform` in your
  agent's context if you need to branch on which network sent the message.
- **Comments vs DMs** — subscribe to `comment.received` if you also want the
  agent to reply to comments on posts, not just direct messages.
