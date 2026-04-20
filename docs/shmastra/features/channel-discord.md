# Channel: Discord

Discord bots have two surfaces: the **Gateway** (for regular messages)
and the **Interactions Endpoint** (for slash commands, buttons, modals).
Shmastra's adapter wires both.

## Before you start

Create an application at
[discord.com/developers/applications](https://discord.com/developers/applications),
add a Bot, and copy:

- **Bot Token**
- **Public Key**
- **Application ID**

## Example prompts

> *Connect the **game-master** agent to Discord.*

> *Hook this agent up to my Discord bot.*

## What happens

1. The widget asks for env vars via the safe UI:

   | name | type |
   |---|---|
   | `GAME_MASTER_DISCORD_BOT_TOKEN` | password |
   | `GAME_MASTER_DISCORD_PUBLIC_KEY` | text |
   | `GAME_MASTER_DISCORD_APPLICATION_ID` | text |
   | `GAME_MASTER_DISCORD_MENTION_ROLE_IDS` (optional) | text |
   | `GAME_MASTER_DISCORD_CRON_SECRET` (optional) | password |
2. Shmastra adds the Discord adapter wrapped with
   `createAgentChannels`.
3. The widget prints the webhook URL for interactions:

   ```
   {PUBLIC_URL}/api/agents/game-master/channels/discord/webhook
   ```

   Paste it into **Discord Developer Portal → your app → General
   Information → Interactions Endpoint URL**. Discord sends a
   validation PING; once it succeeds, slash commands and button
   clicks route through Shmastra.
4. Regular chat messages use the Gateway WebSocket — no webhook
   needed for those; the adapter opens the connection automatically.

## Tips

- **Invite the bot.** Generate an invite URL in the Developer Portal
  (OAuth2 → URL Generator, `bot` + `applications.commands` scopes)
  and add the bot to your server.
- **Intents.** If the bot needs to read server messages, enable the
  "Message Content Intent" privilege and request the `MESSAGE_CONTENT`
  intent.
- **Slash commands.** Register them through the Developer Portal or
  via a `discord.js` script — the adapter will deliver the
  interaction to the agent.
