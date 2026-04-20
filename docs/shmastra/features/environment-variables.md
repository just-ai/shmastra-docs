# Environment variables

When the widget needs a secret — API key, bot token, signing secret —
it never types the value into the chat. Instead it opens a dedicated
**safe env-var UI** that writes the variable directly to `.env`. The
coding agent only sees the variable name and whether it's filled, never
the value.

This is how every integration that needs credentials is wired:
channels, MCP servers, standalone APIs. Composio-backed integrations
skip this step entirely — they use [OAuth](/shmastra/features/one-click-oauth)
instead.

## What the UI looks like

When the agent calls `ask_env_vars_safely` you see an inline form in
the chat with:

- A short **description** — what the variables are for, and where to
  get them (the agent writes this — e.g. *"BotFather bot token for
  Telegram"*).
- One **row per variable** with:
  - **name** — the env-var name, already namespaced with the agent
    prefix.
  - **type** — `text` (shown) or `password` (masked).
  - **required** — whether you must fill it in to proceed.

You type the values, click save, and the file writes happen in one
atomic update. No restart needed — Shmastra reloads `.env` in place.

## Example prompts that trigger it

- *"Connect the support agent to Telegram."* → asks for
  `SUPPORT_AGENT_TELEGRAM_BOT_TOKEN`.
- *"Wire up a Notion MCP server."* → asks for `NOTION_API_KEY`.
- *"Use this custom API — the key is in my 1Password."* → asks for
  a variable with the name the agent picks.
- *"Set my Composio API key."* → asks for `COMPOSIO_API_KEY`.

You can also open it directly:

> *I'd like to store a custom env var called `MY_SERVICE_API_KEY`.*

## Naming convention

Per-agent integrations use this shape:

```
{AGENT_ID_SCREAMING_CASE}_{PLATFORM}_{VAR}
```

Example: for an agent `support-agent` on Slack,
`SUPPORT_AGENT_SLACK_SIGNING_SECRET`. This keeps credentials isolated
per agent so you can run many bots side by side.

Global variables (like `COMPOSIO_API_KEY` or your provider keys) are
written without an agent prefix.

## Editing by hand

`.env` is yours — you can open it and change values whenever you
want. The dev server hot-reloads on save. Keep lines in the shape
`KEY=value`; Shmastra quotes anything that contains whitespace or
special characters automatically when writing.

## Tips

- **Treat the UI as the source of truth.** If the widget asks for a
  variable that's already in `.env`, it won't overwrite a non-empty
  value unless you confirm.
- **Delete carefully.** Removing a variable while an agent is live
  will make the next call fail. Rename or replace, don't just delete.
- **Share nothing.** `.env` is in `.gitignore`. Keep it that way.
