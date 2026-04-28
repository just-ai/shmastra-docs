# Channel: Mattermost

Mattermost is a self-hosted team messaging platform. The adapter connects
your agent as a bot account and supports posts, reactions, and slash commands.

::: info Community adapter
This adapter is maintained by the community: `chat-adapter-mattermost`.
:::

## Before you start

1. In Mattermost System Console → Integrations, create a **Bot Account**.
2. Copy the **Access Token** generated for the bot.
3. Note your Mattermost server URL (e.g. `https://mattermost.example.com`).
4. You need a `PUBLIC_URL` reachable by the Mattermost server for interactive
   button callbacks.

## Example prompts

> *Connect the **support-agent** to Mattermost.*

> *Add Mattermost to my **ops** agent.*

## What happens

1. The widget asks for credentials:

   | name | type |
   |---|---|
   | `SUPPORT_AGENT_MATTERMOST_BASE_URL` | text |
   | `SUPPORT_AGENT_MATTERMOST_BOT_TOKEN` | password |

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createMattermostAdapter } from 'chat-adapter-mattermost'
   import { createAgentChannels } from '../shmastra'

   export const supportAgent = new Agent({
     id: 'support-agent',
     channels: createAgentChannels({
       adapters: {
         mattermost: createMattermostAdapter(),
       },
     }),
   })
   ```

3. The widget prints the callback URL to register in Mattermost System Console
   → Integrations → Interactive Dialogs:

   ```
   {PUBLIC_URL}/api/agents/support-agent/channels/mattermost/webhook
   ```

4. Invite the bot to a channel and mention it — the agent replies.

## Tips

- **Slash commands** — register a slash command in Mattermost pointing to the
  same webhook URL to trigger the agent without an @-mention.
- **Self-signed TLS** — if your Mattermost instance uses a self-signed cert,
  set `NODE_TLS_REJECT_UNAUTHORIZED=0` in the agent's environment (dev only).
