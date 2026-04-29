# Hello, Shmastra

**Released:** April 29, 2025

## What is this?

I always wanted to build multi-agent systems and workflows by simply describing what I need in a chat. Let the assistant find the right APIs, hook up MCP servers, connect Google Drive and whatever else — all in one click.

[Mastra](https://mastra.ai/) already lets developers do this in TypeScript with Claude Code. But even for engineers, wiring everything together is a grind.

Shmastra lets anyone — engineers or not — vibe-code agents and entire workflows directly in Mastra Studio. No context-switching, no boilerplate, no setup.

## What Shmastra actually is

Shmastra is a Mastra template with a [chat widget](/shmastra/the-chat-widget) embedded right inside Mastra Studio. You open the widget, describe what you want in plain English, and Shmastra's coding agent writes the TypeScript, runs a dry-run build, and hot-reloads the project — all without you leaving the browser.

```shell
npx create-mastra@latest --template https://github.com/just-ai/shmastra
npm run dev
```

That's it. Two commands and you're talking to the widget.

Everything the widget generates is real, editable TypeScript under `src/mastra/`. Shmastra is not a black box — it's a coding assistant that writes code into your own project. Pop open VS Code at any point and keep going by hand.

### Powered by mastracode

The coding agent inside Shmastra is built on top of **[mastracode](https://code.mastra.ai)** — a harness that gives an LLM structured, skill-based access to a Mastra project. Each capability (creating agents, wiring channels, building web apps) is a separate skill file that teaches the model exactly what to generate and how to register it. This is what makes the widget reliable: instead of free-form code generation, mastracode constrains the model to well-defined patterns and validates the output with a dry-run build before hot-reloading.

## Build anything by describing it

The widget knows how to build the full Mastra surface:

**[Agents.](/shmastra/features/creating-agents)** Describe the agent's name, persona, and goals. The widget writes the agent file, registers it, and hot-reloads — the agent shows up in Studio in seconds.

**[Workflows.](/shmastra/features/creating-workflows)** Describe a multi-step process and the widget composes it as a Mastra workflow with proper step dependencies, input/output shapes, and suspend/resume support.

**[Inspect & fix.](/shmastra/features/inspect-and-fix)** When something behaves wrong, the widget already has context of whatever is open in Mastra Studio — the current agent, its last run, logs, traces. It sees what's happening without you having to paste anything, analyses the root cause, and applies the fix.

## Give your agents superpowers

Agents are only as useful as their tools. A few prompts unlock the good stuff:

**[Working with files.](/shmastra/features/working-with-files)** Upload a PDF, DOCX, XLSX, or HTML file and immediately ask questions about it. Shmastra wires up a RAG pipeline under the hood — chunking, embedding, and retrieval included.

**[Web search.](/shmastra/features/web-search)** Ask for web search and the agent gets a live-results tool powered by Brave Search. No API wrangling, no middleware.

**[Headless browser.](/shmastra/features/headless-browser)** Give an agent a browser — Playwright-backed, running inside the sandbox — and it can scrape pages, fill forms, and interact with the web like a person would.

**[MCP servers.](/shmastra/features/mcp-servers)** Point Shmastra at any MCP server URL and the coding agent will install it and wire it into your agent as a tool provider. Notion, Linear, GitHub — anything MCP-compatible just works.

**[Composio toolkits.](/shmastra/features/composio-toolkits)** With a Composio API key you unlock 200+ third-party integrations: Gmail, Google Drive, Slack, Notion, HubSpot, and more. One prompt to add them; [one-click OAuth](/shmastra/features/one-click-oauth) to authorize them.

## Ship it somewhere

Building an agent in Studio is great. Talking to it from the real world is better.

**[Channels.](/shmastra/features/connecting-channels)** Connect any agent to a messaging platform. This initial release ships with 14 channel adapters out of the box:

- [Discord](/shmastra/features/channel-discord), [Slack](/shmastra/features/channel-slack), [Microsoft Teams](/shmastra/features/channel-teams), [Mattermost](/shmastra/features/channel-mattermost), [Google Chat](/shmastra/features/channel-google-chat), [Webex](/shmastra/features/channel-webex)
- [Telegram](/shmastra/features/channel-telegram), [WhatsApp](/shmastra/features/channel-whatsapp), [Zalo](/shmastra/features/channel-zalo), [Zernio](/shmastra/features/channel-zernio) (social DMs)
- [Email via Resend](/shmastra/features/channel-email)
- [GitHub](/shmastra/features/channel-github) (issues and PR comments as triggers)
- [Linear](/shmastra/features/channel-linear) (issue and comment events)
- [Liveblocks](/shmastra/features/channel-liveblocks) (collaborative document comments)

Each channel takes a handful of env vars and a prompt like *"Connect the support agent to my Telegram bot"* — the widget handles the rest.

**[Web apps.](/shmastra/features/web-apps)** Ask the widget to build a frontend and it generates a self-contained HTML/JS/CSS app served directly from the Mastra route layer. Charts, dashboards, forms — anything that can be expressed in vanilla HTML.

**[Rich chat replies.](/shmastra/features/rich-chat)** Agents can respond with formatted HTML, embedded iframes, and interactive widgets — not just plain text — right inside the chat widget.

## Shmastra Cloud: share with your team

Running Shmastra locally is great for building. [Shmastra Cloud](/cloud/) is for when you want everyone at your company to vibe-code agents from a browser — no Node, no CLI, no local setup.

You deploy **one Next.js app to Vercel**. From that point, every teammate who signs in through WorkOS gets their own **E2B sandbox** with Mastra Studio and Shmastra pre-installed. Private filesystem, private processes, private environment — but the same widget experience you have locally.

The Cloud adds things you'd otherwise have to build yourself:

**Virtual-key gateway.** Each sandbox talks to AI providers through a virtual key that Cloud swaps for your real API key at the edge. Users never see your keys; you control all provider access from one place.

**[Manage UI.](/cloud/manage-ui/)** An admin dashboard you run from your laptop. It lists every sandbox, lets you [stream logs](/cloud/manage-ui/logs), [browse files](/cloud/manage-ui/files), [open a terminal](/cloud/manage-ui/terminal), and [chat with a Claude session](/cloud/manage-ui/chat-with-agent) running inside any sandbox. Roll out updates to all sandboxes in one click.

**[Healer agent.](/cloud/day-2/healer-agent)** A second process that runs alongside each Shmastra instance. When the Mastra dev server crashes or gets stuck, the healer diagnoses the problem and repairs it automatically — no pager, no intervention.

**[Workflow scheduling.](/cloud/scheduling)** Any workflow can run on a cron. Define the schedule in the widget, results and full traces are stored per run, and the [Stats](/cloud/manage-ui/stats) and [Trace](/cloud/manage-ui/trace) tabs in the Manage UI give you a timeline of every execution.

**[Patch system.](/cloud/day-2/patches)** Ship migrations to all sandboxes without rebuilding the E2B template. Patches are tiny shell scripts that run once and mark themselves complete — ideal for config changes, dependency updates, or one-off data migrations.

## What's next

This is the initial release. The foundation is solid but there's a lot more coming.

- [Get started with Shmastra](/shmastra/getting-started)
- [Deploy Shmastra Cloud](/cloud/)
