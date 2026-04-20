# Setup wizard

The first time you run `npm run dev` in development mode, Shmastra walks
you through provider setup in the terminal. The wizard only runs when no
provider credentials are configured — once you've completed it, every
subsequent dev start goes straight into Mastra Studio.

## What the wizard does

The wizard lives in `src/shmastra/wizard/` and runs in three phases.

### 1. OAuth login (optional)

You're offered a one-click login with your existing **OpenAI (Codex)**
or **Anthropic** account. If you log in, Shmastra uses your Pro/Max
subscription for the coding agent instead of billing through an API
key.

You can skip this phase — an API key works just as well.

### 2. Require at least one provider API key

You pick a provider and paste a key. Shmastra supports:

| Provider | Env var |
|---|---|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google AI | `GOOGLE_GENERATIVE_AI_API_KEY` |

The key is written to `.env` in the project root. The wizard keeps
prompting until at least one provider is configured.

### 3. Add more providers (optional)

After the first key is saved you can add keys for the other providers,
or skip straight to the dev server.

### 4. Composio (optional)

If you want your agents to reach 200+ pre-built toolkits (Gmail, Google
Drive, Slack, Notion, GitHub, etc.) the wizard offers a final step to
paste a `COMPOSIO_API_KEY` from [platform.composio.dev](https://platform.composio.dev).
See [Composio toolkits](/shmastra/features/composio-toolkits).

## Running the wizard again

Delete the relevant lines from `.env` (or the whole file) and restart
`npm run dev`. The wizard will re-prompt for any missing values.

## Non-interactive environments

The wizard is gated by `NODE_ENV === "development"`. In production
builds (`npm run build && npm run start`) or when `NODE_ENV` is anything
else, Shmastra expects all environment variables to be already present
and skips the interactive prompts.

## Where keys live

- `.env` — provider API keys and any other variables you add later
  through the widget's [safe env-var UI](/shmastra/features/environment-variables).
- `auth.json` (managed by `mastracode`) — OAuth tokens from the login
  phase.

Both files stay on disk in the project root; nothing is sent elsewhere.
