# Project persistence

By default, E2B sandboxes are ephemeral — a sandbox that is wiped
(e.g. after a prolonged pause) starts fresh from the template.
Shmastra Cloud can preserve each user's work in a private GitLab
repository and restore it automatically when the sandbox is
re-provisioned.

## How it works

When `GITLAB_SERVICE_TOKEN` and `GITLAB_GROUP_ID` are set in your
Cloud environment, each user gets a private Git repository inside the
configured GitLab group. A `project-watcher` daemon runs as a third
PM2 process inside the sandbox:

1. **Watch.** The watcher uses `inotifywait` to monitor
   `/home/user/shmastra` for file changes, respecting `.gitignore`
   exclusions so large directories like `node_modules` and
   `.mastra` never generate events.
2. **Debounce.** After the last change settles for 3 seconds the
   watcher runs `git add -A`, `git commit`, and `git push project main`.
3. **Proxy.** The `project` remote points at `/api/git` on the Cloud
   deployment — a server-side proxy that holds `GITLAB_SERVICE_TOKEN`
   and forwards the push to GitLab. The sandbox only ever sees a
   per-user `PROJECT_TOKEN`; the GitLab service token never leaves
   the server.
4. **Restore.** When a user's sandbox is re-provisioned on a fresh
   E2B instance, Cloud force-pulls the user's saved GitLab branch
   (`git reset --hard project/main`) over the fresh template before
   starting the dev server. The user's project continues where it
   left off.
5. **Sync.** When code is pushed to the git proxy by anyone other than
   `project-watcher` (the watcher tags its own pushes via `User-Agent`
   so they are not counted as external triggers), Cloud sets the
   sandbox status to `syncing` and runs `sync.sh` inside the sandbox.
   The script stops the dev server, force-pulls the latest branch,
   reinstalls dependencies, and restarts. This lets you push updates
   directly from a local clone to the GitLab project and have them
   appear in the running sandbox immediately.

The update pipeline coordinates with the watcher: it stops the daemon
before applying an update and starts it again in the `finally` block,
so no changes are committed mid-update.

## Syncing status

While `sync.sh` is running, the workspace page shows a **Syncing**
indicator with its own status dot and message. The sandbox is
accessible again once the dev server comes back up. If the sync fails
(e.g. a dependency install error), the sandbox status reverts to
`broken` and the error tail is written to `/tmp/shmastra-sync-failure`
inside the sandbox for inspection.

## Studio project button

When auto-sync is enabled, Studio shows a **project** button in the
top toolbar. Clicking it opens the user's GitLab project in a new tab,
making it easy to browse commit history or push updates from a local
clone.

## Env-var manifest and secret restoration

`.env` is gitignored, so secrets are never pushed to GitLab. Instead,
the watcher writes a tracked `shmastra.json` file alongside each
commit that lists the **names** (not values) of variables present in
`.env`:

```json
{
  "version": 1,
  "env": ["OPENAI_API_KEY", "DATABASE_URL"]
}
```

When a user's sandbox is re-provisioned and this manifest contains
keys, Cloud shows a **Restore project** form before provisioning.
The user enters the secret values; they are sent directly to the new
sandbox over HTTPS and written to `.env` — nothing is stored on the
Cloud side.

## GitLab setup (one-time)

1. **Create a GitLab group** for the per-user repos (e.g. `shmastra`).
   The numeric group ID is shown under the group name in the GitLab
   UI — that is `GITLAB_GROUP_ID`.
2. **Create a service account** (GitLab Premium/Ultimate: Group →
   Settings → Members → Service accounts; free plan: use a dedicated
   user's Personal Access Token instead).
3. **Add the service account to the group as Maintainer.** Creating
   the account does _not_ add it to the group automatically; without
   group membership `POST /projects` fails with
   `namespace: is not valid`.
4. **Generate an access token** for the service account with scopes
   `api` and `write_repository`. This is `GITLAB_SERVICE_TOKEN`.
5. Smoke-test:
   ```bash
   curl -s -H "PRIVATE-TOKEN: $GITLAB_SERVICE_TOKEN" \
     "https://gitlab.com/api/v4/groups/$GITLAB_GROUP_ID" | head -c 200
   ```
   A JSON description of the group confirms the token works. A
   `404 Group Not Found` response means the service account is not
   yet a group member — go back to step 3.

Self-hosted GitLab: set `GITLAB_API_URL` to your instance's API base
(e.g. `https://gitlab.example.com/api/v4`).

## Back-filling existing sandboxes

If you enable auto-sync on a deployment that already has sandboxes,
run an update from the Manage UI. Patch `001_projects.ts` creates the
per-user GitLab repos, wires `PROJECT_TOKEN` into each sandbox's
daemon environment, and configures the `project` remote. The patch is
idempotent.

## Security notes

- The sandbox holds only `PROJECT_TOKEN` (a per-user scoped token),
  not `GITLAB_SERVICE_TOKEN`.
- Secret values collected by the restore form transit only in memory
  — they are validated against the manifest, passed to
  `provisionSandbox` in-process, and written directly to the
  sandbox's `.env`. They are never logged or stored in the database.
- The watcher tags its own pushes with a custom `User-Agent` so the
  git proxy does not treat them as external sync triggers — only
  pushes from outside the sandbox (e.g. from a developer's local
  clone) kick off `sync.sh`.

## What happens without GitLab configured

If `GITLAB_SERVICE_TOKEN` is absent, the feature is entirely disabled:
no `project-watcher` daemon starts, no `project` remote is configured,
and sandbox provisioning skips the manifest check and restore form.
Work is preserved only while the sandbox's E2B filesystem lives.
