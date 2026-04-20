# Channel: Microsoft Teams

The Teams adapter talks to the **Azure Bot** service. You'll register
a Bot in Azure, point it at Shmastra's webhook, and install the bot
in a Teams channel.

## Before you start

In the [Azure portal](https://portal.azure.com/):

1. Create an **Azure Bot** resource.
2. Note the **App ID**, **App Password** (client secret), and (for
   SingleTenant bots) the **Tenant ID**.
3. You'll need a `PUBLIC_URL` that Azure can reach.

## Example prompts

> *Connect the **it-helpdesk** agent to Microsoft Teams.*

## What happens

1. Safe env-var UI asks for:

   | name | type |
   |---|---|
   | `IT_HELPDESK_TEAMS_APP_ID` | text |
   | `IT_HELPDESK_TEAMS_APP_PASSWORD` | password |
   | `IT_HELPDESK_TEAMS_APP_TENANT_ID` (SingleTenant) | text |
2. Shmastra adds the Teams adapter via `createAgentChannels`.
3. The widget prints the webhook URL:

   ```
   {PUBLIC_URL}/api/agents/it-helpdesk/channels/teams/webhook
   ```

   In Azure: go to your Bot resource → **Configuration** → set
   **Messaging endpoint** to that URL and click **Apply**.
4. Install the bot in Teams (via an app manifest or an admin
   sideload) and send it a message. The agent replies.

## Tips

- **Channels vs DMs.** The adapter supports both. For channels the
  agent sees the sender's display name.
- **Adaptive cards.** If you want rich replies, have the agent return
  an HTML file (see [rich chat replies](/shmastra/features/rich-chat))
  or build a proper [web app](/shmastra/features/web-apps).
- **Single-tenant vs multi-tenant.** Shmastra supports either — ask
  the widget to switch.
