# Headless browser

Shmastra ships Mastra's native AgentBrowser — a headless Chromium
(Playwright) the agent can drive. Good for scraping, filling forms,
and anything search snippets can't handle.

## Example prompts

> *Give the research agent a browser so it can fetch and parse product
> pages.*

> *Build a scraper agent that visits URLs I paste and extracts the
> main article text.*

> *Let this agent navigate sites — I'll ask it to compare two
> checkout flows.*

## What happens

The widget adds `browser: createAgentBrowser()` to the agent:

```ts
import { createAgentBrowser } from '../shmastra'

export const myAgent = new Agent({
  // …
  browser: createAgentBrowser(),
})
```

Shmastra makes sure Playwright's Chromium Headless Shell is installed
(the template ships `npm run install-browsers`).

## What the agent can do

- Navigate a URL, read the DOM.
- Click, type, wait for selectors.
- Take screenshots (which you can return as inline images via
  [rich chat replies](/shmastra/features/rich-chat)).
- Chain multiple pages together — login flows, searches, paginated
  scrapes.

## Example conversations

- *"Visit `https://news.ycombinator.com/` and summarise the top five
  stories."*
- *"Compare prices for this product on Amazon and the manufacturer's
  site: …"*
- *"Fill in the signup form on `example.com/signup` with test data
  and tell me what errors it returns."*

## Tips

- **Tell the agent to be polite.** For public sites, ask it to
  respect `robots.txt` and throttle requests.
- **Sites with CAPTCHAs won't work** — the browser is real Chromium
  but no humans are behind it.
- **Long-running scrapes belong in a workflow.** Build a
  [workflow](/shmastra/features/creating-workflows) whose step is an
  agent with a browser, and let it run in the background.
