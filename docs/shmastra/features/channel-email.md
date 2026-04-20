# Channel: Email (Resend)

Turn an agent into an email correspondent. Incoming email arrives via
[Resend](https://resend.com/)'s inbound webhook; replies are sent
through Resend's API from a verified domain.

## Before you start

In the Resend dashboard:

1. Verify the domain you'll send from.
2. Create an **API key**.
3. Pick (or create) an inbound webhook and copy its **signing
   secret**.
4. Decide on the `from` address — e.g. `support@yourcompany.com`.

You'll also need a `PUBLIC_URL` Resend can call.

## Example prompts

> *Connect the **support-agent** to email via Resend. Send from
> `support@acme.com`.*

## What happens

1. Safe env-var UI asks for:

   | name | type |
   |---|---|
   | `SUPPORT_AGENT_RESEND_FROM_ADDRESS` | text |
   | `SUPPORT_AGENT_RESEND_FROM_NAME` (optional) | text |
   | `SUPPORT_AGENT_RESEND_API_KEY` | password |
   | `SUPPORT_AGENT_RESEND_WEBHOOK_SECRET` | password |
2. Shmastra wires the Resend adapter via `createAgentChannels`.
3. The widget prints the webhook URL:

   ```
   {PUBLIC_URL}/api/agents/support-agent/channels/resend/webhook
   ```

   In Resend: **Webhooks → Add** → paste that URL → copy the signing
   secret back into `SUPPORT_AGENT_RESEND_WEBHOOK_SECRET`.
4. The adapter threads incoming mail automatically via standard email
   headers (`Message-Id`, `In-Reply-To`), so a single conversation
   stays in one memory thread.

## Behaviour

- Inbound HTML and plain-text bodies are both handled; attachments
  go into the file RAG pipeline.
- Replies are plain text by default. Ask the widget for *"rich HTML
  replies"* if you want formatted output.
- One agent, many inbox aliases — use Resend's routing to map
  multiple inbound addresses to one webhook.

## Tips

- **Sender reputation matters.** Use a dedicated subdomain (e.g.
  `bot.acme.com`) with SPF, DKIM, and DMARC set up. Resend's dashboard
  walks you through it.
- **Abuse guardrails.** Add prompts like *"Never send more than 5
  emails to the same person per day"* to the agent's instructions.
- **Local testing.** Use a tunnel so Resend can reach your dev server;
  or, for pure-send workflows, skip the inbound webhook entirely and
  just use Resend as an outbound tool in a [workflow](/shmastra/features/creating-workflows).
