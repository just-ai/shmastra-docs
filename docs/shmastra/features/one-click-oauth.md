# One-click OAuth

Whenever an integration needs OAuth — authorising Gmail, Slack, Drive,
Notion, and most [Composio toolkits](/shmastra/features/composio-toolkits)
— Shmastra handles the flow for you. You click once, sign in on the
provider's page, and come back to a connected agent.

## How it works

1. You ask the widget to connect an integration.
2. The widget opens the provider's consent screen in a new browser
   tab (via Composio's session-based OAuth).
3. You authorise (pick an account, grant scopes).
4. Composio stores the refresh token under your Shmastra user id; the
   popup closes; the widget proceeds to wire the tools.

No code, no `.env` entries, no callback URL fiddling. The
access token lives in Composio's vault; Shmastra only gets the
short-lived tokens it needs to make each API call.

## Example prompts

> *Connect Google Drive to this agent.*

> *Give the research agent Notion access.*

> *Authorise Gmail as me and then let the agent send mail.*

## Multiple accounts

Composio tracks connections per Shmastra user id. If a single user
needs multiple accounts for the same service (e.g. work and personal
Gmail), ask the widget to create a second connection — it'll distinguish
them with an `integrationId` parameter.

## Revoking

To drop a connection:

> *Disconnect my Google Drive from this agent.*

The widget calls the Composio API to revoke the stored credentials. You
can also remove connections from your Composio dashboard at
<https://platform.composio.dev>.

## Tips

- **Pop-up blockers.** The OAuth window is a real browser popup — if
  your browser blocks it, the widget will print a link you can open
  manually.
- **Scopes per toolkit are fixed** by Composio; if you want narrower
  scopes, ask in the toolkit's settings on Composio's side.
- **Not every integration uses OAuth.** Some need API keys instead
  (e.g. Stripe server keys). Those go through the
  [safe env-var UI](/shmastra/features/environment-variables).
