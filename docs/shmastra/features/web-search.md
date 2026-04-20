# Web search

Give an agent a `web_search` tool and it can fetch fresh results from
the open web. No extra API keys — Shmastra routes the search through
the same LLM provider the agent already uses.

## Example prompts

> *Give the research agent a web-search tool.*

> *Add web search to the sales-advisor — it should look up companies
> before drafting emails.*

> *Equip this agent with web search.*

## What happens

The widget updates the agent's tool list with `createWebSearchTool(<agentId>)`:

```ts
import { createWebSearchTool } from '../shmastra'

export const myAgent = new Agent({
  id: 'my-agent',
  tools: createAgentTools({
    web_search: createWebSearchTool('my-agent'),
  }),
})
```

A dry-run build confirms it compiles, and the agent reloads. Next time
you chat, it can search.

## Using it in practice

- *"Find the latest funding round for Anthropic."*
- *"Compare current pricing for the top three cloud GPU providers."*
- *"Check if there's a new release of Mastra and summarise the
  changelog."*

## Tips

- **Say when to use it.** Add to the agent's instructions: *"Prefer
  web search for anything that might have changed in the last six
  months."* — otherwise the agent may rely on training-data memory.
- **Combine with the browser.** Web search gives a result list;
  [headless browser](/shmastra/features/headless-browser) fetches the
  full page.
- **Cache expensive queries.** For repeat research tasks, consider a
  workflow with a web-search step whose output you store.
