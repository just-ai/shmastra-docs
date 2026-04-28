# Setup: Environment variables reference

One table, all the variables. Set these in **both**:

- `.env.local` on your machine (for local dev, the Manage UI, and the
  E2B template build).
- **Vercel → Settings → Environment Variables** (for production).

The same values work in both places.

## Required

| Variable | Description | Set by |
|---|---|---|
| `WORKOS_API_KEY` | WorkOS API key (`sk_...`). | [WorkOS](/cloud/setup/workos) |
| `WORKOS_CLIENT_ID` | WorkOS client ID (`client_...`). | [WorkOS](/cloud/setup/workos) |
| `WORKOS_ORGANIZATION_ID` | WorkOS organization ID (`org_...`). Members of this org can sign in. | [WorkOS](/cloud/setup/workos) |
| `WORKOS_COOKIE_PASSWORD` | Cookie encryption secret, ≥ 32 chars. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. | You |
| `E2B_API_KEY` | E2B API key. | [E2B](/cloud/setup/e2b) |
| `SUPABASE_URL` | Supabase project URL. | [Supabase](/cloud/setup/supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (starts with `eyJ...`). Treat like a root password. | [Supabase](/cloud/setup/supabase) |

## LLM providers

At least one of these is required; all three are recommended.

| Variable | Description | Set by |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key. | [AI providers](/cloud/setup/ai-providers) |
| `ANTHROPIC_API_KEY` | Anthropic API key. Also used by the Manage UI chat (Claude Sonnet) and the healer agent. | [AI providers](/cloud/setup/ai-providers) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Generative AI key. | [AI providers](/cloud/setup/ai-providers) |

## Optional

| Variable | Description |
|---|---|
| `COMPOSIO_API_KEY` | Enables the Composio toolkit story inside user sandboxes. Get it from <https://platform.composio.dev>. |
| `SANDBOX_UPDATE_BRANCH` | Branch that sandboxes pull from when you run an update. Defaults to `main`. Change this if you want all sandboxes to track a release or staging branch instead. Must match the regex `[a-zA-Z0-9_/.-]+`. |

## Remember

- **Sandboxes never see these.** Real provider keys stay on Vercel;
  each sandbox gets a virtual key only. This is what makes the
  virtual-key gateway at `/api/gateway/*` worthwhile.
- **The Edge gateway needs them.** That's why they go in Vercel env,
  not just `.env.local`.
- **Rotate in pairs.** When you rotate a WorkOS or Supabase key,
  update both `.env.local` and Vercel at the same time to avoid a
  production–local drift.

## Next

Continue to [Deploy to Vercel](/cloud/setup/deploy-to-vercel).
