# Prerequisites

Before you start, make sure you have accounts on the services Cloud
depends on, plus the tools to deploy it. None of this is heavy —
most have free tiers that cover a small team.

## Accounts

| Service | Why | Sign-up |
|---|---|---|
| **Vercel** | Hosts the Next.js app. | <https://vercel.com> |
| **WorkOS** | Auth + organisation membership. | <https://workos.com> |
| **Supabase** | Postgres for `users` and `sandboxes`. | <https://supabase.com> |
| **E2B** | Runs the per-user sandboxes. | <https://e2b.dev> |
| **OpenAI** | (Optional) LLM provider. | <https://platform.openai.com> |
| **Anthropic** | (Optional) LLM provider. Recommended for the coding agent. | <https://console.anthropic.com> |
| **Google AI Studio** | (Optional) LLM provider. | <https://aistudio.google.com> |
| **Composio** | (Optional) Toolkit catalog for 200+ services. | <https://platform.composio.dev> |

At least one of OpenAI / Anthropic / Google is required. Cloud works
best with all three configured — users can pick the tier they want
and Shmastra falls back across providers automatically.

## Local tools

- **Node.js 22** (Cloud pins `>=22 <23`).
- **npm** — `npm ci` is used during install.
- A shell you're comfortable in — macOS / Linux / WSL.
- **git** for cloning `shmastra-cloud`.

## The Cloud repository

Clone it:

```shell
git clone https://github.com/just-ai/shmastra-cloud.git
cd shmastra-cloud
npm ci
cp .env.example .env.local
```

Keep this checkout around — you'll use it for the one-time E2B
template build, for running the [Manage UI](/cloud/manage-ui/), and
for pushing patches to your fleet later.

## Rough cost estimate (small team)

A five-person team running daily, with conservative LLM usage:

- **Vercel** — free tier (Hobby) is enough for internal use; upgrade
  to Pro if you want custom domains plus teammate access to the
  dashboard.
- **WorkOS** — free for the first 1 000 monthly active users.
- **Supabase** — free tier handles the two tables trivially.
- **E2B** — pay-as-you-go; sandboxes pause after 10 minutes idle.
  Budget a few dollars per active user per month.
- **LLM providers** — the bulk of the cost. Plan for whatever the
  coding agent will run (Claude Sonnet 4.6 is the default heavy
  model), plus per-user usage inside their own agents.

None of these are fixed numbers — treat them as order-of-magnitude.

## Next

Once you have the accounts, proceed to [Setup overview](/cloud/setup/).
