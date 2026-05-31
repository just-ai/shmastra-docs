# Sandbox table

The landing page of the Manage UI: one row per sandbox in your
deployment.

## Columns

| Column | What it shows |
|---|---|
| **Email** | The signed-in user from WorkOS. When [project auto-sync](/cloud/project-persistence) is enabled, a small repo icon appears next to the email; clicking it opens the user's GitLab project in a new tab. |
| **Sandbox ID** | The E2B sandbox identifier. Click to open the detail panel. |
| **Status** | `provisioning` · `ready` · `healing` · `broken` · `syncing` · `paused`. |
| **Last activity** | Time since the last request to this sandbox. |
| **Version** | The patch `version` from the `sandboxes` table — the numeric prefix of the highest-numbered [patch](/cloud/day-2/patches) applied. |

The data is a join of Supabase's `users`, `sandboxes`, and `projects` tables
(via the `user_sandboxes` view).

## Selecting sandboxes

- **Single row click** — opens the detail panel with tabs for
  [Chat](/cloud/manage-ui/chat-with-agent),
  [Logs](/cloud/manage-ui/logs),
  [Files](/cloud/manage-ui/files), and
  [Terminal](/cloud/manage-ui/terminal).
- **Checkbox column** — select multiple sandboxes; the top bar
  changes to show bulk actions.

## Actions

- **Update selected** / **Update all** — runs the
  [9-phase update pipeline](/cloud/manage-ui/applying-updates). When
  you pick "all", the UI runs updates with a concurrency cap of 5 and
  streams logs over SSE for each in-flight run.
- **Stop** — cancels a running update (safe: it'll finish the
  current phase and roll back).
- **Open in detail panel** — opens the row in a slide-out for chat /
  logs / files / terminal.

## Status meanings (full)

| Status | What to do |
|---|---|
| `provisioning` | Just booted. If it doesn't move to `ready` in a minute, see [troubleshooting](/cloud/troubleshooting). |
| `ready` | Normal. Shmastra is responding on port 4111. |
| `healing` | The [healer agent](/cloud/day-2/healer-agent) noticed a crash and is patching it. |
| `syncing` | Git proxy received an external push; `sync.sh` is running inside the sandbox (stops server, force-pulls latest code, reinstalls deps, restarts). Clears automatically when the dev server comes back up. See [Project persistence](/cloud/project-persistence). |
| `broken` | [Healer](/cloud/day-2/healer-agent) exhausted 3 attempts and entered passive mode — it still polls health but won't call the AI agent again. The sandbox may self-recover; if not, open chat / terminal to fix manually. |
| `paused` | E2B suspended the sandbox for inactivity. Resumes on the next user request. |

## Refresh

The table polls every few seconds. A manual **Refresh** button in the
top bar forces a re-fetch if you just made a change and don't want to
wait.
