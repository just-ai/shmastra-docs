# Channel: Google Chat

Google Chat connects your agent to Google Workspace spaces. The adapter
authenticates via a service account and receives messages through Pub/Sub
or direct webhook delivery.

## Before you start

1. In [Google Cloud Console](https://console.cloud.google.com) create or open
   a project and enable the **Google Chat API**.
2. Create a **Service Account** and download the JSON credentials file.
3. In the Chat API configuration, set **Connection settings → App URL** to
   your webhook endpoint (see below). If you want to receive messages from
   spaces you're not @-mentioned in, configure a **Pub/Sub topic** as well.

## Example prompts

> *Connect the **support-agent** to Google Chat.*

> *Add Google Chat to my **assistant** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `SUPPORT_AGENT_GCHAT_CREDENTIALS` | password (paste the full service account JSON) |
   | `SUPPORT_AGENT_GCHAT_PROJECT_NUMBER` | text (optional, for webhook verification) |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createGoogleChatAdapter } from '@chat-adapter/gchat'
   import { createAgentChannels } from '../shmastra'

   export const supportAgent = new Agent({
     id: 'support-agent',
     channels: createAgentChannels({
       adapters: {
         gchat: createGoogleChatAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL to paste into Google Chat API settings:

   ```
   {PUBLIC_URL}/api/agents/support-agent/channels/gchat/webhook
   ```

4. Mention the bot in a Chat space — it replies.

## Tips

- **Spaces vs DMs** — the adapter handles both. Mention the bot with `@BotName`
  in a space to start a thread.
- **Pub/Sub mode** — if you want the bot to receive every message in a space
  (not just mentions), set up a Pub/Sub push subscription pointing at the
  same webhook URL.
- **ADC alternative** — if deploying to GCP (Cloud Run, GCE), set
  `GOOGLE_CHAT_USE_ADC=true` instead of providing a credentials JSON.
