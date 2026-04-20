# Connecting channels

Any Shmastra agent can be hooked up to a messaging platform. Incoming
messages run through the agent's normal pipeline (memory, tools,
instructions) and replies stream back into the platform.

Available channels today:

- [Telegram](/shmastra/features/channel-telegram) — `@chat-adapter/telegram`
- [Slack](/shmastra/features/channel-slack) — `@chat-adapter/slack`
- [Discord](/shmastra/features/channel-discord) — `@chat-adapter/discord`
- [WhatsApp](/shmastra/features/channel-whatsapp) — `@chat-adapter/whatsapp`
- [Microsoft Teams](/shmastra/features/channel-teams) — `@chat-adapter/teams`
- [Email (Resend)](/shmastra/features/channel-email) — `@resend/chat-sdk-adapter`

Additional adapters bundled out of the box: Google Chat, iMessage,
Matrix, Webex, Linear, GitHub, Liveblocks, Sendblue, Zernio, Baileys.
Ask the widget for any of them the same way.

## How to connect a channel (any channel)

1. Open the agent you want to connect (or create one first).
2. Say, for example: *"Connect the support agent to Telegram."*
3. The widget opens the [safe env-var UI](/shmastra/features/environment-variables)
   and asks for the platform credentials (bot token, client ID, signing
   secret, depending on the platform).
4. Shmastra adds the adapter to the agent's `channels` config, wrapped
   with `createAgentChannels` from `src/shmastra`.
5. For webhook-based platforms (Slack, Discord, WhatsApp, Teams,
   Resend) the widget **prints the webhook URL** and tells you where
   to paste it in the platform's dashboard. Telegram can be wired
   automatically because its webhook is set via a simple API call.

## Long-polling fallback

If `PUBLIC_URL` isn't set and the platform supports it (Telegram does),
the adapter runs in long-polling mode — great for local development
without a tunnel.

## Env-var naming

Channel credentials use prefixed names:

```
{AGENT_ID_SCREAMING_CASE}_{PLATFORM}_{VAR}
```

For an agent with id `support-agent` on Telegram:

```
SUPPORT_AGENT_TELEGRAM_BOT_TOKEN=…
```

The widget suggests the right prefixed name automatically. If you
rename the agent, ask the widget to rename the env vars too.

## Webhook URL shape

Platforms that need a webhook pasted into their dashboard use this
path (note: no Mastra REST prefix):

```
{PUBLIC_URL}/api/agents/{agentId}/channels/{platform}/webhook
```

Example: `https://example.com/api/agents/support-agent/channels/slack/webhook`.

## Behind the scenes

Channel configuration is wrapped with `createAgentChannels` from
`src/shmastra`, which adds shared handlers for things like incoming
attachments (routed into the file RAG pipeline) and Telegram-style
reply formatting on top of the raw Chat SDK adapter. Don't attach raw
adapters directly — the widget always uses the wrapper.
