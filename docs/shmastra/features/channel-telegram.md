# Channel: Telegram

Telegram is the easiest channel to connect — Shmastra can register
the webhook automatically if you have a `PUBLIC_URL`, and falls back
to long-polling when you don't.

## Before you start

Create a bot with [@BotFather](https://t.me/BotFather) on Telegram:

1. Send `/newbot` and follow the prompts.
2. Copy the **bot token** BotFather gives you (it looks like
   `123456:ABC…`).

## Example prompts

> *Connect the **support-agent** to Telegram.*

> *Make a Telegram bot for my **scribe** agent.*

> *Hook this agent up to a Telegram bot.*

## What happens

1. The widget opens the safe env-var UI and asks for one variable:
   `SUPPORT_AGENT_TELEGRAM_BOT_TOKEN` (`password` type). Paste the
   BotFather token.
2. Shmastra adds the Telegram adapter to the agent, wrapped with
   `createAgentChannels`:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createTelegramAdapter } from '@chat-adapter/telegram'
   import { createAgentChannels } from '../shmastra'

   export const supportAgent = new Agent({
     id: 'support-agent',
     channels: createAgentChannels({
       adapters: {
         telegram: createTelegramAdapter({
           botToken: process.env.SUPPORT_AGENT_TELEGRAM_BOT_TOKEN,
         }),
       },
     }),
   })
   ```
3. If `PUBLIC_URL` is set, Shmastra calls Telegram's `setWebhook` API
   for you pointing at
   `{PUBLIC_URL}/api/agents/support-agent/channels/telegram/webhook`.
4. If no public URL is available, the adapter runs in long-polling
   mode — good enough for local development.
5. After hot-reload, send your bot a message on Telegram. It replies.

## Multiple bots

You can connect multiple agents, each to its own bot. Each agent gets
its own prefixed env var (`{AGENT_ID}_TELEGRAM_BOT_TOKEN`), so
credentials never collide.

## Tips

- **Use `/setjoingroups` in BotFather** if you want the bot to accept
  group messages; otherwise it only accepts DMs.
- **Attachments work.** Send a PDF to the bot and the agent will see
  it the same way it would via the chat widget — `queryDocumentsTool`
  picks it up.
- **Rename carefully.** If you rename the agent, the env-var prefix
  changes. Ask the widget to rename both at once.
