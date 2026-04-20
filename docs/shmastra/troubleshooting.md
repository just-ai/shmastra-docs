# Troubleshooting

Things that usually go wrong, and where to look.

## The setup wizard keeps asking for a key

Shmastra wants at least one provider key in `.env`. If you have the key
but the wizard ignores it, double-check:

- The variable name matches exactly: `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY`, or `GOOGLE_GENERATIVE_AI_API_KEY`.
- The value is on the same line as the variable (no surrounding
  spaces), and the line isn't commented out.
- The `.env` file is in the **project root**, not in `src/`.

Restart `npm run dev` after editing `.env`.

## Dry-run build keeps failing

When `apply_changes` fails, the widget prints the build error and the
coding agent tries to fix it. If you hit the same error twice:

- **Outdated Mastra APIs** — the agent's skill files force a fresh
  docs lookup, but you may have multiple `@mastra/*` versions. Try
  deleting `node_modules` and reinstalling.
- **Missing env var** — the agent may have forgotten to ask. Tell it
  explicitly: *"You still need `MY_SERVICE_API_KEY` in `.env`."*
- **TypeScript target** — Mastra requires `ES2022`. If you edited
  `tsconfig.json` by hand, revert it.

## Hot-reload doesn't pick up changes

The dev server watches the project root. A reload can stall if:

- You edited files inside `node_modules` or `.mastra/output/`.
- A second `mastra dev` is already running on `PORT`.

Kill lingering processes and restart.

## A channel bot isn't responding

- **Webhook mode** — Shmastra needs a `PUBLIC_URL` to register
  webhooks. If you're on localhost without a tunnel (ngrok, Cloudflare
  Tunnel) the widget will usually fall back to long-polling where the
  adapter supports it.
- **Wrong env-var name** — channel adapters use prefixed names like
  `SUPPORT_AGENT_TELEGRAM_BOT_TOKEN`. The widget's
  [safe env-var UI](/shmastra/features/environment-variables) suggests
  the right name. Renaming the agent changes the prefix too.
- Check the logs in Mastra Studio: incoming channel messages are
  traced like any other agent invocation.

## Composio tools don't show up

- `COMPOSIO_API_KEY` must be in `.env`.
- Did you [connect the toolkit](/shmastra/features/composio-toolkits)?
  The search tool flags every toolkit's `connected` status — until
  you click through the OAuth popup it stays `false`.

## Files return empty answers

The [file RAG pipeline](/shmastra/features/working-with-files) uses
`markitdown` and caps the processed text at 200 000 characters. Very
large PDFs are truncated. For tabular data (CSV, XLSX) ask the agent
for a structured approach (Python + pandas, or a JS tool) instead of
natural-language queries.

## Still stuck?

Open an issue at <https://github.com/just-ai/shmastra/issues> with:

- Output of `node -v`.
- The exact prompt you sent to the widget.
- Relevant log lines from the Mastra Studio traces tab.
