# The chat widget

The chat widget is the Shmastra UI: a chat panel injected into Mastra
Studio that talks to a coding agent with tools. Everything in the
[Features](/shmastra/features/) section is you typing into this widget.

## How the loop works

```
 you type a request
     │
     ▼
 coding agent thinks
     │
     ├─ uses a tool (e.g. ask_env_vars_safely,
     │   search_mcp_servers, connect_toolkit, …)
     │
     ▼
 edits files under src/mastra/
     │
     ▼
 calls apply_changes
     │
     ├─ dry-run build with scripts/dry-run.ts
     │   ↳ if it fails, the agent reads the error
     │     and fixes the code, then retries
     │
     ▼
 dev server hot-reloads
     │
     ▼
 you see the new agent / workflow / app in Studio
```

You can cancel at any time; partially applied changes are rolled back
before the next attempt.

## Tools the agent has

- **`apply_changes`** — writes the edit, runs a dry-run build, fails
  loudly if TypeScript or Mastra validation rejects it. This is how
  self-healing happens.
- **`ask_env_vars_safely`** — opens the
  [env-var UI](/shmastra/features/environment-variables) so you can
  paste secrets without the agent ever seeing them.
- **`search_toolkits` / `connect_toolkit` / `get_toolkit_tool_schema`**
  — discover and wire Composio integrations.
- **`search_mcp_servers`** — discover MCP servers from the catalog.
- **`ask_user`** — a structured prompt with concrete options (used
  sparingly).
- **`execute_command`** — run a shell command (e.g. registering a
  Telegram webhook).

## Rules the agent follows

The agent is primed by skill files from two locations:

- **Project skills** — `src/mastra/public/.mastracode/skills/` in the
  current project. These are the primary source of domain knowledge
  and custom behaviors for this project.
- **Global skills** — `~/.mastracode/skills/` in your home directory.
  Files placed here are loaded alongside the project skills and are
  available in every Shmastra project on the machine, without copying.
  Useful for personal coding conventions or shared team patterns you
  always want the agent to follow.

The ground rules baked into those skills are:

- **The user is not a developer.** The agent never asks you to edit
  files or run commands; it does that for itself.
- **Never rely on internal memory for Mastra APIs.** The agent always
  checks embedded Mastra docs (installed `@mastra/*` packages) or the
  latest remote docs before writing code.
- **Always ask before creating.** If you've been vague about an agent
  or workflow, the agent will ask you one clarifying question at a
  time.
- **One question at a time.** When it uses the structured question UI,
  it does so serially.
- **Use safe inputs for secrets.** Anything resembling a key or token
  goes through `ask_env_vars_safely`.

## Context the agent receives automatically

With every message, the widget sends two pieces of context that the
coding agent can use without you having to mention them:

- **Current page path** — the Studio URL you have open (e.g.
  `/agents/supportAgent`). This is how *Inspect & fix* knows which
  agent you mean when you say "this agent keeps answering in Russian"
  with no other context.
- **User timezone** — your browser's IANA timezone (e.g.
  `America/New_York`, `Europe/Paris`). The agent uses it when writing
  scheduled workflows, cron expressions, or any date/time logic, so
  the times are correct for your location without you having to
  specify a timezone explicitly.

Neither value is stored; both are read fresh from the browser on each
request.

## What you can ask for

Anything on the [Features](/shmastra/features/) index page. Each feature
has its own recipe with a prompt template and a description of what
happens behind the scenes.

## Tips

- **Be specific about triggers** — say *"every Monday at 9 AM UTC"*,
  *"when I upload a PDF"*, *"when a Telegram message arrives"*.
- **Name the thing you're talking about** — agents and workflows live
  at stable paths like `/agents/supportAgent` or
  `/workflows/invoiceWorkflow`. Naming them makes follow-up prompts
  ("make the support agent also check the queue every 10 minutes")
  unambiguous.
- **Use Inspect & fix** for bug reports — navigate to the broken
  agent's page in Studio, then complain in the widget. The agent sees
  which agent you're looking at and debugs that one.

## Embedding the widget in your own page

The widget ships as a self-contained IIFE bundle
(`assistant-widget.iife.js`) built from the
[shmastra-widget](https://github.com/just-ai/shmastra-widget) repo.
You can embed it in any HTML page to get the same chat panel — useful
when you want to add the Shmastra coding interface to a custom
dashboard or any page outside Mastra Studio.

### Programmatic init

```html
<script src="assistant-widget.iife.js"></script>
<script>
  AssistantWidget.initAssistantWidget({
    apiBaseUrl: 'http://localhost:4111',
    theme: 'dark',             // 'light' | 'dark' | 'system'
    element: '#my-container',  // CSS selector or HTMLElement (optional)
    width: '30rem',            // CSS value (optional)
    height: '80vh',            // CSS value (optional)
  });
</script>
```

Returns `{ unmount: () => void }` so you can tear the widget down
programmatically.

### Auto-init

If the page contains a `<div id="assistant-widget">`, the widget
mounts there automatically as soon as the script loads. Pass options
via `data-*` attributes:

```html
<div id="assistant-widget"
     data-api-base-url="http://localhost:4111"
     data-theme="light">
</div>
<script src="assistant-widget.iife.js"></script>
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `element` | `HTMLElement \| string` | new `<div>` appended to `<body>` | Mount container. Accepts a CSS selector string or an `HTMLElement`. |
| `apiBaseUrl` | `string` | `""` | Base URL of the Shmastra server (e.g. `http://localhost:4111`). |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Color theme. `'system'` tracks `prefers-color-scheme` and updates live. |
| `width` | `string` | `25rem` | Panel width — any CSS length value. |
| `height` | `string` | `calc(100vh - 6rem)` | Panel height — any CSS length value. |

### CSS customization

The panel drop-shadow is controlled by a CSS variable on the host
page (outside the Shadow DOM):

```css
body {
  --widget-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
}
```

The widget renders inside a **Shadow DOM**, so host-page styles never
bleed into the widget, and widget styles never bleed into the host
page.
