# Channel: GitHub

The GitHub adapter lets your agent reply to pull request and issue comments.
Useful for code review bots, triage agents, and release note generators.

## Before you start

Choose one authentication method:

- **Personal Access Token** — simplest. Go to GitHub Settings → Developer
  settings → Personal access tokens and create a token with the `repo` scope.
- **GitHub App** — recommended for production. Create an app at
  github.com/settings/apps, generate a private key, and note the App ID.

Either way you also need a **Webhook Secret** — any random string you choose.

## Example prompts

> *Connect the **code-review** agent to GitHub.*

> *Make a GitHub bot for my **triage** agent.*

## What happens

1. The widget asks for credentials. For a Personal Access Token:

   | name | type |
   |---|---|
   | `CODE_REVIEW_AGENT_GITHUB_TOKEN` | password |
   | `CODE_REVIEW_AGENT_GITHUB_WEBHOOK_SECRET` | password |

   For a GitHub App: `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`.

2. Shmastra wires the adapter:

   ```ts
   import { Agent } from '@mastra/core/agent'
   import { createGitHubAdapter } from '@chat-adapter/github'
   import { createAgentChannels } from '../shmastra'

   export const codeReviewAgent = new Agent({
     id: 'code-review-agent',
     channels: createAgentChannels({
       adapters: {
         github: createGitHubAdapter(),
       },
     }),
   })
   ```

3. The widget prints the webhook URL:

   ```
   {PUBLIC_URL}/api/agents/code-review-agent/channels/github/webhook
   ```

   In your repo (or GitHub App) settings, add a webhook pointing to that URL,
   set Content-Type to `application/json`, paste the secret, and subscribe to
   **Issue comments** and **Pull request review comments**.

4. Comment on a PR or issue — the agent replies in the thread.

## Tips

- **Scope issues** — if the bot can't post, check that the token has `repo`
  scope (or the App has `issues: write` and `pull_requests: write`).
- **Org-wide app** — install the GitHub App on the whole organisation to cover
  all repos with a single agent deployment.
