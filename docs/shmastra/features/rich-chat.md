# Rich chat replies

The Shmastra widget renders markdown **and** iframes. That means an
agent can return a link to a generated HTML file and the chat will
show the live page inline — charts, dashboards, landing pages, even
little interactive demos.

## Example prompts

> *When I ask for a chart, generate an HTML file with Chart.js and
> show it inline.*

> *Visualise this data as a bar chart.*

> *Draft a one-page landing page for this product idea.*

> *Turn these numbers into a pie chart I can screenshot.*

## What happens

The agent uses a small tool the widget provides: it writes an HTML
file into `files/`, then replies with a markdown link whose target is
an HTML file. The widget recognises the content type and renders the
page in an iframe inside the message bubble.

## When to use this vs a full web app

| Use rich replies when | Use a [web app](/shmastra/features/web-apps) when |
|---|---|
| It's a one-off visual. | You want a standalone surface you'll open again later. |
| You want it in the conversation. | You want it embeddable in other sites. |
| No backend logic needed. | You want custom routes, forms, auth. |

## Tips

- **Charts.** Ask for Chart.js specifically — it's small, well-known,
  and works in a plain HTML file with a CDN script tag.
- **Screenshots.** The [headless browser](/shmastra/features/headless-browser)
  can open a generated page and save a PNG; return both the PNG and
  the live HTML if you want printable assets too.
- **Long-lived links.** Files under `files/` stay on disk until you
  remove them — but the public URL is scoped to the running dev
  server. For real sharing, publish to a proper host.
