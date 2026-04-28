# Applying updates

When you ship a new Shmastra version (new widget features, new
skills, new adapters), you update every user's sandbox to the latest
`origin/main` through this pipeline. Users stay signed in; their dev
server keeps running during most of the update thanks to a git
worktree.

## Where to trigger it

- [Sandbox table](/cloud/manage-ui/sandbox-table) → select rows →
  **Update selected** or **Update all**.
- CLI: `npx tsx manage/index.mts <sandbox_id>` (one sandbox) or
  `npx tsx manage/index.mts` (every sandbox, sequential).

Web-UI updates run in parallel with a concurrency cap of 5.

## The 9 phases

Every update runs through these phases in order. The UI shows a
phase progress bar per sandbox and streams logs over SSE.

1. **connect** — open an E2B connection to the sandbox.
2. **fetch** — configure git identity, commit any local sandbox
   changes (so no work is lost), fetch `origin`, and check whether
   we're behind the update branch (default: `main`; configurable via
   [`SANDBOX_UPDATE_BRANCH`](/cloud/setup/env-vars)).
3. **merge** — create a git worktree on the update branch, merge any
   local commits into it. The dev server keeps running in the main
   working tree throughout this phase.
4. **install** — `pnpm install` inside the worktree.
5. **build** — `pnpm dry-run` to verify the build compiles. If it
   fails, the pipeline bails out without touching the main tree.
6. **migrate** — snapshot the observability database (DuckDB) and run
   any required schema migrations against the worktree copy. If
   migration fails, the original snapshot is restored and the update
   aborts — the sandbox stays on its current schema and code.
7. **apply** — fast-forward the main branch to the update branch tip
   and run `pnpm install` in the main directory.
8. **patch** — run any pending scripts from `scripts/patches/` (see
   [Patches](/cloud/day-2/patches)). Each sandbox tracks its
   `version` in Supabase; only newer patches are applied. This phase
   also unconditionally re-syncs cloud-managed artifacts (MCP server
   config, skill files) to ensure every sandbox has the latest
   versions even if no code update was needed.
9. **restart** — stop pm2, swap migrated databases into place (if a
   migration ran in phase 6), and restart pm2 processes (`shmastra`,
   `healer`). The UI waits for a healthy response on port 4111 before
   calling the update complete.

> **Phases 8 and 9 always run**, even when the sandbox is already up
> to date with the update branch. This keeps MCP configuration, skill
> files, and other cloud-managed artifacts in sync on every pass.

If any phase fails, the pipeline stops and reports. The worktree is
thrown away; the main tree is untouched until phase 7. Only phases
7–9 mutate production state.

## Conflict resolution

Because users (or the healer) can edit sandbox files between updates,
merges can conflict. The pipeline resolves them automatically:

- **Lockfiles** (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
  — deleted and regenerated on install.
- **Config files** (`package.json`, `tsconfig.json`, others) —
  resolved via a direct call to the Claude API that picks a merged
  result.
- **Source files** — resolved by a Mastra agent with full workspace
  tools; it reads both versions and writes a unified result.

You can watch the resolutions in the streaming log.

## Stopping a running update

The **Stop** button on the row. The pipeline completes the current
phase (so it doesn't leave the sandbox in a partially-applied state)
and exits. Use stop if you notice something fishy in the logs; you
can re-trigger later.

## CLI output

```shell
npx tsx manage/index.mts <sandbox_id>
```

Prints phase-by-phase logs to stdout. Exit code is 0 on success,
non-zero on any phase failure — suitable for a cron or GitHub Action.
