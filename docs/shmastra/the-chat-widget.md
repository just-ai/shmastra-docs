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

The agent is primed by skill files under
`src/mastra/public/.mastracode/skills/`. The ground rules are:

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
