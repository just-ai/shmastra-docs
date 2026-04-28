# Environment profiles

The profile switcher in the Manage UI header lets you point the app at a different
set of credentials — switching Supabase projects, E2B accounts, or AI keys — without
touching `.env.local`.

## Why it exists

If you run Shmastra Cloud in more than one environment (production and staging, for
example), each needs its own Supabase project and credentials. Without profiles you
edit `.env.local` back and forth between them, which is error-prone. With profiles
you create one file per environment, and a dropdown in the header reloads all
credentials and refreshes the sandbox list in one click.

## File naming

Profile names come from the filenames themselves. The Manage UI scans the project
root for `.env*` files on startup and derives a profile name from the middle segment:

| File | Role |
|------|------|
| `.env` | Base defaults, committed to version control |
| `.env.local` | Personal local overrides, git-ignored, always loaded |
| `.env.<profile>` | Profile-specific values (e.g. `.env.prod`, `.env.staging`) |
| `.env.<profile>.local` | Profile-specific local secrets, git-ignored |
| `.env.example` | Template only — never loaded |

`.env.prod` → profile name **prod**. `.env.staging` → profile name **staging**.
The built-in **local** profile maps to `.env.local` + `.env` and is always present.

## Load order and priority

Files are merged from lowest to highest priority. A variable set in a higher-priority
file wins over the same variable in a lower-priority file. Files that do not exist on
disk are silently skipped.

**local profile:**

```
.env.local  (highest)
.env
```

**Named profile (e.g. prod):**

```
.env.prod.local  (highest)
.env.prod
.env.local
.env             (lowest)
```

### What to put in each layer

- **`.env`** — non-secret shared defaults that apply everywhere (e.g. a single shared
  E2B account key). Safe to commit.
- **`.env.<profile>`** — environment-specific Supabase URLs and service-role keys.
  Commit if your secrets are managed elsewhere (Vault, 1Password); otherwise keep local.
- **`.env.<profile>.local`** — the real secrets for that environment when you don't
  want them in version control. Git-ignored.
- **`.env.local`** — personal overrides that apply across all profiles (e.g. your
  `ANTHROPIC_API_KEY`).

## Auto-discovery

The Manage UI discovers profiles from `.env*` filenames at startup. No registration
is required — just create a file and restart:

```shell
npx tsx manage/index.mts --serve
```

New profile files added while the server is running are not picked up automatically;
a restart is needed.

## Switching in the UI

The profile switcher is the leftmost control in the header bar. It shows the currently
active profile name.

- **One profile available** — the select is visible but disabled (nothing to switch to).
- **Multiple profiles** — click to open the dropdown and select a profile.
- **Switching in progress** — the select is dimmed and disabled while credentials reload.

**Tooltip:** hover over the dropdown to see exactly which files were loaded and in which
order, for example:

```
.env.prod.local > .env.prod > .env.local > .env
```

Files that do not exist on disk are omitted from the tooltip.

## What happens on switch

1. The UI sends the new profile name to the Manage server.
2. The server unloads all environment variables set by the previous profile.
3. It re-reads the file stack for the new profile (highest priority last, with
   override enabled so it wins).
4. Supabase and Anthropic clients are re-created with the new credentials.
5. The UI fetches the sandbox list with the new session to confirm everything works.

## Error recovery

If the sandbox list fails to load after a switch (wrong Supabase URL, invalid key,
network error), the Manage UI:

1. Shows an error toast naming the failed profile and the reason.
2. Automatically reverts the server to the previous profile.
3. Restores the previous profile name and file list in the dropdown.

No manual action is needed — you land back where you started.

## Be careful

`.env.<profile>.local` files contain real service credentials. The default `.gitignore`
in `shmastra-cloud` excludes `.env*.local`, so they should not be committed
accidentally — but verify this before committing if you have modified `.gitignore`.

## Example: local + prod setup

Two profiles — **local** (default) and **prod** — using four files:

**`.env`** (committed)

```
# Shared key that works for both environments
E2B_API_KEY=e2b_...
```

**`.env.local`** (git-ignored)

```
# Personal keys, used in both profiles
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

**`.env.prod`** (optionally committed — no secrets here)

```
SUPABASE_URL=https://xyzxyz.supabase.co
```

**`.env.prod.local`** (git-ignored — the real secret)

```
SUPABASE_SERVICE_ROLE_KEY=eyJp...prod-key...
```

When you select **prod** in the dropdown, the Manage UI loads all four files in
priority order, substituting the production Supabase URL and key. Switch back to
**local** and it reverts to your `.env.local` values.

## See also

- [Environment variables reference](/cloud/setup/env-vars) — the full list of
  variables the Manage UI needs.
- [Local development](/cloud/local-development) — running the Manage UI alongside
  the dev server.
