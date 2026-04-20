# Channel: Slack

Slack needs a Slack app you control. Shmastra can't register the
webhook for you, so you'll copy a URL into the app manifest once.

## Before you start

At [api.slack.com/apps](https://api.slack.com/apps) create a new app.
You have two paths:

- **Single-workspace bot** — the simplest. You need:
  - Bot User OAuth Token (starts with `xoxb-`)
  - Signing Secret
- **Multi-workspace distribution** (OAuth) — if other orgs install
  your bot. You need:
  - Client ID
  - Client Secret
  - Signing Secret

Also: this is a webhook-only adapter, so you need a `PUBLIC_URL` that
Slack can reach (use a tunnel like ngrok or Cloudflare during local
development).

## Example prompts

> *Connect the **support-agent** to Slack — single workspace.*

> *Hook the **reports** agent to Slack. It'll be distributed to
> multiple workspaces.*

## What happens

1. The widget opens the safe env-var UI. For a single workspace:

   | name | type |
   |---|---|
   | `SUPPORT_AGENT_SLACK_BOT_TOKEN` | password |
   | `SUPPORT_AGENT_SLACK_SIGNING_SECRET` | password |
   | `SUPPORT_AGENT_SLACK_ENCRYPTION_KEY` | password (optional) |

   For multi-workspace OAuth: `CLIENT_ID`, `CLIENT_SECRET`,
   `SIGNING_SECRET`.
2. Shmastra wires the adapter with `createAgentChannels`.
3. The widget prints the webhook URL:

   ```
   {PUBLIC_URL}/api/agents/support-agent/channels/slack/webhook
   ```

   Open your app's manifest at
   [api.slack.com/apps](https://api.slack.com/apps), and set **both**
   `event_subscriptions.request_url` **and**
   `interactivity.request_url` to that URL.
4. Reinstall the app to your workspace. Mention the bot in a channel
   it's invited to — the agent replies.

## Behaviour

- The agent sees channel messages with sender labels and (optionally)
  thread history.
- Replies stream back; long answers arrive as Slack message updates.
- Files shared in Slack are treated as uploads for the agent's RAG
  tool.

## Tips

- **Scopes** — grant `chat:write`, `app_mentions:read`, `im:history`,
  `channels:history`, `files:read` at minimum.
- **Only DMs?** Remove the channel-read scopes and only subscribe to
  `message.im`.
- **Local dev without a tunnel** — use Slack's Socket Mode style
  adapter instead if it matters. The bundled adapter is webhook-based.
