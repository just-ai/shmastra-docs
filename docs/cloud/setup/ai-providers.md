# Setup: AI providers

The LLM keys live on your Vercel deployment. **They never reach the
sandbox.** Each sandbox only knows its virtual key; the
`/api/gateway/*` Edge route swaps that for the real key before
calling the provider.

That means you can rotate provider keys without touching anything on
the sandbox side, and a user with shell access inside their own
sandbox can't exfiltrate your keys.

## Which providers to set up

At least one. The widget prefers whatever it can find, in order:
OpenAI → Google → Anthropic (this is what Shmastra itself uses
internally for model-tier selection).

| Provider | Env var | Where |
|---|---|---|
| **OpenAI** | `OPENAI_API_KEY` | <https://platform.openai.com/api-keys> |
| **Anthropic** | `ANTHROPIC_API_KEY` | <https://console.anthropic.com/settings/keys> |
| **Google AI** | `GOOGLE_GENERATIVE_AI_API_KEY` | <https://aistudio.google.com/app/apikey> |

**Recommended:** configure all three. Shmastra's coding agent
automatically picks a tier (`fast`, `general`, `best`, or
`developer`) based on what's available, so more keys = more
flexibility and a cheaper hot path.

## Composio (optional)

If you want your users to have the [toolkits](/shmastra/features/composio-toolkits)
story out of the box, add:

| Variable | Where |
|---|---|
| `COMPOSIO_API_KEY` | <https://platform.composio.dev> |

Without this, users can still wire third-party services themselves
via [MCP servers](/shmastra/features/mcp-servers) — they just don't
get one-click OAuth for 200+ integrations.

## Where the variables go

All of these need to be set in **both** places:

| Variable | `.env.local` | Vercel |
|---|---|---|
| `OPENAI_API_KEY` | ✓ | ✓ |
| `ANTHROPIC_API_KEY` | ✓ | ✓ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✓ | ✓ |
| `COMPOSIO_API_KEY` | ✓ | ✓ |

`.env.local` is needed because the Manage UI's chat feature uses
`ANTHROPIC_API_KEY` directly (Claude Sonnet), and the E2B template
build respects these values too.

## Separation of concerns

- **Sandboxes** see only `VK=vk_<userId>_<hex>` in their env. Their
  AI calls go to the virtual-key gateway.
- **Vercel** holds the real keys. Only the Edge gateway and the
  Manage UI read them.
- **`.env.local` on your machine** is for local development of the
  Cloud app itself (and running the template build and Manage UI).

## Next

Continue to [Build the E2B template](/cloud/setup/build-e2b-template).
