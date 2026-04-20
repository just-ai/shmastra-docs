# Channel: WhatsApp

Connect an agent to the **WhatsApp Business Cloud API** — the official
Meta-provided API for WhatsApp bots. (For personal WhatsApp accounts,
use the Baileys adapter instead — ask the widget for *"WhatsApp via
Baileys"*.)

## Before you start

At [developers.facebook.com](https://developers.facebook.com/):

1. Create (or use) an app with the **WhatsApp** product added.
2. Grab the **Phone Number ID** from the WhatsApp → API Setup page.
3. Generate a **permanent access token** (via a System User, not the
   24-hour temporary token).
4. Choose a **Verify Token** — any secret string you pick.
5. Make sure you have a `PUBLIC_URL` for webhooks.

## Example prompts

> *Connect the **concierge** agent to WhatsApp.*

## What happens

1. Safe env-var UI asks for:

   | name | type |
   |---|---|
   | `CONCIERGE_WHATSAPP_ACCESS_TOKEN` | password |
   | `CONCIERGE_WHATSAPP_APP_SECRET` | password |
   | `CONCIERGE_WHATSAPP_PHONE_NUMBER_ID` | text |
   | `CONCIERGE_WHATSAPP_VERIFY_TOKEN` | password |
   | `CONCIERGE_WHATSAPP_BOT_USERNAME` (optional) | text |
2. Shmastra wires the adapter with `createAgentChannels`.
3. The widget prints the webhook URL:

   ```
   {PUBLIC_URL}/api/agents/concierge/channels/whatsapp/webhook
   ```

   In the Meta dashboard: **WhatsApp → Configuration → Callback URL**,
   set **Verify Token** to the same value as
   `CONCIERGE_WHATSAPP_VERIFY_TOKEN`, and subscribe to the
   **messages** field.
4. Meta performs a GET handshake with your webhook; the adapter
   answers automatically. POST events then stream in.

## Tips

- **Templates.** WhatsApp only lets you *initiate* conversations using
  pre-approved templates. Inside the 24-hour service window after a
  user messages you, you can reply with freeform messages.
- **Media.** Images, PDFs, and audio all come through as file uploads
  — the agent sees them via `queryDocumentsTool`.
- **Test number.** Meta gives you a free sandbox number to develop
  against before buying one.
