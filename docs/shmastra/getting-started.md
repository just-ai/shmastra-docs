# Getting started

Shmastra is a Mastra template. You bootstrap a fresh Mastra project from
it, then start the dev server and open Mastra Studio.

## Requirements

- **Node.js ≥ 22.13.0** (required by both Mastra and Shmastra).
- **npm** or **pnpm** — Shmastra auto-detects pnpm and prefers it when
  available.
- At least one LLM provider account — OpenAI, Anthropic, or Google AI.
  You can either log in via OAuth (OpenAI / Anthropic) during the setup
  wizard, or paste an API key. Google AI needs an API key.

## Bootstrap

```shell
npx create-mastra@latest --template https://github.com/just-ai/shmastra
```

Follow the on-screen prompts (project name, package manager). The
template is copied into the folder you chose and dependencies install
automatically.

## First run

From the project directory:

```shell
npm run dev
```

On the first start Shmastra runs its [setup wizard](/shmastra/setup-wizard)
in the terminal. You'll be asked to:

1. Optionally log in to OpenAI or Anthropic with OAuth (so the coding
   agent uses your existing Pro/Max subscription instead of burning API
   credits).
2. Add at least one provider API key. The key is written to `.env`.
3. Optionally add a **Composio** API key to unlock 200+ third-party
   toolkits (Gmail, Drive, Slack, Notion, …).

Once the wizard finishes, the Mastra dev server starts on
`http://localhost:4111` and Mastra Studio opens with the Shmastra chat
widget already attached.

## Say hello

In the widget, try:

> *Create an agent called "scribe" that summarises any text I send it in
> three bullet points.*

Shmastra will:

1. Write `src/mastra/agents/scribeAgent.ts`.
2. Register it and run a dry-run build.
3. Hot-reload the dev server — the agent shows up in Mastra Studio
   immediately.

Click the new agent in Studio to chat with it directly.

## Other commands

```shell
npm run build   # production build (mastra build)
npm run start   # run the production server
npm test        # unit tests (Vitest, pure helpers)
```

## Next

- [Setup wizard](/shmastra/setup-wizard) — what runs on first start.
- [The chat widget](/shmastra/the-chat-widget) — how vibe-coding works.
- [Features](/shmastra/features/) — full menu of what you can ask for.
