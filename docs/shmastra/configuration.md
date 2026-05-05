# Configuration

Shmastra configuration is a regular `.env` file in the project root.
Most values are written by the [setup wizard](/shmastra/setup-wizard) or
by the widget's [safe env-var UI](/shmastra/features/environment-variables),
but you can edit the file by hand too — the dev server hot-reloads
whenever `.env` changes.

## Required — at least one LLM provider

```ini
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AI...
```

Any one of these is enough to get started; more keys give Shmastra more
fallback options when a provider is down.

## Model selection and fallback

Shmastra organises models into three tiers used for different tasks:

| Tier | Current model priority | Used for |
|---|---|---|
| **fast** | gpt-5.4-nano → gemini-3.1-flash-lite → claude-sonnet-4-6 | Quick lookups and lightweight rewrites. |
| **general** | gpt-5.4-mini → claude-sonnet-4-6 → gemini-3-flash | Most agent responses (default). |
| **best** | gpt-5.4 → claude-opus-4-7 → gemini-3.1-pro | Complex reasoning: architecture decisions, conflict resolution. |

Each tier holds a priority-ordered list of models across providers.
When a request runs, Shmastra picks every model in that tier whose
provider key is set and configures them as ordered fallbacks — each
with one automatic retry. If the top-priority model returns an error,
the next available model is tried transparently, without any
configuration change on your part.

**Practical result:** if you have both an OpenAI key and an Anthropic
key you get automatic provider-level redundancy for free. If one
provider is down or rate-limits you, calls fall through to the next
one silently.

> **Coding agent models.** The widget's coding agent uses a separate
> priority list tuned for code-generation tasks:
> **claude-opus-4-7 → gpt-5.5 → gemini-3.1-pro**. The first model
> whose provider key is present wins.

## Optional

| Variable | Purpose |
|---|---|
| `COMPOSIO_API_KEY` | Unlocks the Composio toolkits search/connect flow. Get it from <https://platform.composio.dev>. |
| `PORT` | Dev-server port. Defaults to `4111`. |
| `PUBLIC_URL` | Public base URL of the dev server. Shmastra reads this **once at startup** to derive the Mastra Studio's public origin (`studioHost`, `studioProtocol`, `studioPort`) and to build webhook URLs for channels (Telegram, Slack…). If not set, Shmastra derives it automatically from the E2B sandbox URL when running in Cloud. Self-hosted deployments behind a reverse proxy should always set this so both the Studio and webhook channels use the correct public origin. |
| `CORS_ORIGIN` | Extra allowed origin for the Mastra server. |
| `MASTRA_AUTH_TOKEN` | Bearer token required for Mastra API calls when set. |
| `USER_ID` | Pre-pins the current user id (used by Shmastra Cloud sandboxes). |
| `GOOGLE_BASE_URL` | Override the base URL for **Google** provider API calls (e.g. route through an internal proxy or gateway). When set, Shmastra replaces the default models.dev endpoint with this URL for all `google/*` model requests. |
| `GEMINI_BASE_URL` | Same as `GOOGLE_BASE_URL` but for the `gemini` provider alias. Both can be set independently if needed. |

## Per-agent variables

Channel adapters and many integrations read their credentials from
prefixed env vars, where the prefix is the agent id in
`SCREAMING_SNAKE_CASE`. Example for an agent with id `support-agent`
connected to Telegram:

```ini
SUPPORT_AGENT_TELEGRAM_BOT_TOKEN=123456:ABC...
```

When you ask the widget to wire an integration it calls the
[safe env-var UI](/shmastra/features/environment-variables), which
suggests the correct prefixed names — you usually don't need to guess.

## Where things live on disk

| Path | Contents |
|---|---|
| `.env` | Environment variables. |
| `auth.json` | OAuth tokens from the setup wizard. |
| `.storage/mastra.db` | Main database (LibSQL): threads, traces, scores, agent memory. |
| `.storage/mastra.duckdb` | Observability database (DuckDB): metrics, timeseries. |
| `.storage/code.db` | The mastracode harness database. |
| `files/` | Uploaded files. Accessible via generated public URLs on localhost. |
| `.mastra/output/` | Build output (do not edit). |
| `src/mastra/public/.mastracode/skills/` | Coding agent skill files (project-level). Shmastra reads these to prime the coding agent with project-specific knowledge and custom behaviors. |
| `~/.mastracode/skills/` | Global coding agent skill files, shared across all projects on this machine. Loaded alongside the project-level skills — useful for skills you want available in every project without copying them. |

All paths are relative to the project root, except `~/.mastracode/skills/`
which is in your home directory.

## Package manager

Shmastra auto-detects `pnpm` — if `pnpm --version` succeeds it uses
pnpm, otherwise npm. The widget respects that choice when it installs
new dependencies.

## Production

Build and run with:

```shell
npm run build
npm run start
```

`npm run start` respects `PORT`, every provider key, and
`MASTRA_AUTH_TOKEN` / `CORS_ORIGIN`. The setup wizard does **not** run
outside `NODE_ENV=development`; make sure every needed variable is
supplied through the deploy platform.
