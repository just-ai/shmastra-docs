# MCP servers

[MCP](https://modelcontextprotocol.io) (the Model Context Protocol) is a
standard way for agents to talk to external services. If there's an MCP
server for the service you care about, Shmastra can discover it, set up
any required env vars, and attach its tools to your agent — usually
without a single line of custom code.

## Example prompts

> *Find a Notion MCP server and let the **research-agent** use it.*

> *Wire up a Postgres MCP so this agent can query our orders database.*

> *Look for an MCP server that controls my home assistant setup.*

## What happens

1. The widget calls `search_mcp_servers` with keywords from your
   prompt. The catalog returns candidates with their package name,
   available tools, and required env vars.
2. It picks the best match — preferring verified servers whose tool
   names match your task.
3. If the server needs env vars (API key, DB connection string, etc.),
   the widget opens the
   [safe env-var UI](/shmastra/features/environment-variables).
4. It instantiates an `MCPClient` from `@mastra/mcp` using `npx` to
   run the server package, and wires its tools into the agent via
   `createAgentTools`.

Generated code looks roughly like:

```ts
import { MCPClient } from '@mastra/mcp'

const notion = new MCPClient({
  servers: {
    notion: {
      command: 'npx',
      args: ['-y', '@some-vendor/notion-mcp'],
      env: { NOTION_API_KEY: process.env.NOTION_API_KEY! },
    },
  },
})

export const researchAgent = new Agent({
  // …
  tools: createAgentTools({
    ...(await notion.listTools()),
    web_search: createWebSearchTool('research-agent'),
  }),
})
```

## Filtering tools

Some MCP servers expose dozens of tools; attaching all of them bloats
the agent's context window. Tell the widget:

> *Only give me the `search` and `read-page` tools from the Notion MCP.*

The widget will filter `listTools()` down to just those names.

## Using MCP tools in a workflow

Any MCP tool can be a workflow step if it has both input and output
Zod schemas. Ask the widget: *"Use the `query` tool from this
Postgres MCP as the first step of a new workflow."*

## Tips

- **Composio first.** For popular SaaS apps (Gmail, Slack, Linear,
  Notion, Drive), [Composio toolkits](/shmastra/features/composio-toolkits)
  are often simpler than wiring an MCP server yourself.
- **Local MCP servers work.** Any command that speaks MCP on stdio
  is fair game — not just npm packages. Ask the widget to use a
  specific binary if you have one.
- **Verify first.** Ask *"which MCP servers match these keywords?"*
  first — the widget will list candidates before committing to one.
