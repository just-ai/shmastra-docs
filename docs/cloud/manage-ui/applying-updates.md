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

## The 8 phases

Every update runs through these phases in order. The UI shows a
phase progress bar per sandbox and streams logs over SSE.

1. **fetch** — configure git identity, commit any local sandbox
   changes (so no work is lost), fetch `origin`, and check whether
   we're behind the update branch (default: `main`; configurable via
   [`SANDBOX_UPDATE_BRANCH`](/cloud/setup/env-vars)).
2. **merge** — create a git worktree on the update branch, merge any
   local commits into it. The dev server keeps running in the main
   working tree throughout this phase.
3. **install** — `pnpm install` inside the worktree.
4. **build** — `pnpm dry-run` to verify the build compiles. If it
   fails, the pipeline bails out without touching the main tree.
5. **migrate** — stop pm2 briefly to flush DuckDB's WAL, snapshot
   the observability database, and run any required schema migrations
   against the worktree copy. If migration fails, the original
   snapshot is restored and the update aborts — the sandbox stays on
   its current schema and code.
6. **apply** — fast-forward the main branch to the update branch tip
   and run `pnpm install` in the main directory.
7. **patch** — run any pending scripts from `scripts/patches/` (see
   [Patches](/cloud/day-2/patches)). Each sandbox tracks its
   `version` in Supabase; only newer patches are applied. This phase
   also unconditionally re-syncs cloud-managed artifacts (MCP server
   config, skill files) to ensure every sandbox has the latest
   versions even if no code update was needed.
8. **restart** — stop pm2, swap migrated databases into place (if a
   migration ran in phase 5), and restart pm2 processes (`shmastra`,
   `healer`). The UI polls the `/api/version` endpoint and waits
   until the server reports the new version before calling the update
   complete.

> **Phases 7 and 8 always run**, even when the sandbox is already up
> to date with the update branch. This keeps MCP configuration, skill
> files, and other cloud-managed artifacts in sync on every pass.

Only phases 6–8 mutate production state. The pipeline is safe to
cancel or retry at any earlier phase.

## Rollback on failure

If phase 6 (apply) succeeds but any later phase fails, the pipeline
automatically rolls the sandbox back to its exact pre-update state:

1. `git reset --hard` to the commit that was HEAD before the merge.
2. Restore the DuckDB snapshot taken in phase 5 (if a migration ran).
3. Re-run `pnpm install` to sync `node_modules` with the restored
   `package.json` / lockfile.
4. Restart pm2 on the now-consistent old code and schema.

The result is that a failed update leaves the sandbox byte-equivalent
to its state before the update started. Users experience a brief
downtime window (the restart in step 4) but return to a working
sandbox on the previous version.

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
