# Sandbox table

The landing page of the Manage UI: one row per sandbox in your
deployment.

## Columns

| Column | What it shows |
|---|---|
| **Email** | The signed-in user from WorkOS. |
| **Sandbox ID** | The E2B sandbox identifier. Click to open the detail panel. |
| **Status** | `provisioning` · `ready` · `healing` · `broken` · `paused`. |
| **Last activity** | Time since the last request to this sandbox. |
| **Version** | The patch `version` from the `sandboxes` table — the numeric prefix of the highest-numbered [patch](/cloud/day-2/patches) applied. |

The data is a join of Supabase's `users` and `sandboxes` tables
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
| `broken` | Healer exhausted 3 attempts. Admin action needed — open chat / terminal. |
| `paused` | E2B suspended the sandbox for inactivity. Resumes on the next user request. |

## Refresh

The table polls every few seconds. A manual **Refresh** button in the
top bar forces a re-fetch if you just made a change and don't want to
wait.
