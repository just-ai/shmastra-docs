# What is Shmastra

Shmastra is a [Mastra](https://mastra.ai) template with a chat widget
embedded right inside Mastra Studio. Open the widget, describe the agent
or workflow you want in plain English, and Shmastra writes the
TypeScript, runs a dry-run build, and hot-reloads the project. Then it
keeps a conversation with you while you refine behaviour, connect
services, add channels, or build a companion web app.

If you can type, you can ship an agent.

## What the widget can do for you

| Feature | Ask the widget something like |
|---|---|
| [Create an agent](/shmastra/features/creating-agents) | *"Build a weekly-digest agent that summarises my inbox and posts to Slack."* |
| [Create a workflow](/shmastra/features/creating-workflows) | *"Make a workflow that takes an uploaded invoice PDF and returns the line items as JSON."* |
| [Inspect & fix](/shmastra/features/inspect-and-fix) | *"This agent keeps answering in Russian — make it always reply in English."* |
| [Work with files](/shmastra/features/working-with-files) | Upload a PDF: *"Answer questions about this document."* |
| [Web search](/shmastra/features/web-search) | *"Give the research agent a web-search tool."* |
| [Headless browser](/shmastra/features/headless-browser) | *"Give this agent a browser so it can scrape product pages."* |
| [Web apps](/shmastra/features/web-apps) | *"Build me a dashboard for this workflow with a bar chart."* |
| [Channels](/shmastra/features/connecting-channels) | *"Connect the support agent to my Telegram bot."* |
| [MCP servers](/shmastra/features/mcp-servers) | *"Find a Notion MCP server and let my research agent use it."* |
| [Composio toolkits](/shmastra/features/composio-toolkits) | *"Give this agent access to Gmail — read and send."* |

## Behind the scenes

Shmastra is a regular Mastra project. Everything the widget creates
lives under `src/mastra/` (agents, workflows, routes, web apps) in
editable TypeScript — you can keep editing by hand if you want. Shmastra
adds:

- **`src/shmastra/`** — the engine: HTTP handlers for the widget,
  mastracode harness, agent tools, channel adapters, RAG, browser,
  Composio/MCP discovery.
- **`src/mastra/public/.mastracode/skills/`** — skill files that teach
  the coding agent how to build agents, workflows, apps, and channels.
- **Dev-mode wizard** — one-time OAuth login + API-key setup when you
  run `npm run dev` for the first time.

## Next

- [Getting started](/shmastra/getting-started) — bootstrap the project.
- [The chat widget](/shmastra/the-chat-widget) — how the vibe-coding loop
  works.
- [Features](/shmastra/features/) — one recipe per capability.
