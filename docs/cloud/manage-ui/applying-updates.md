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

1. **connect** — open an E2B connection to the sandbox.
2. **fetch** — configure git identity, commit any local sandbox
   changes (so no work is lost), fetch `origin`, and check whether
   we're behind `main`.
3. **merge** — create a git worktree on `origin/main`, merge any
   local commits into it. The dev server keeps running in the main
   working tree throughout this phase.
4. **install** — `pnpm install` inside the worktree.
5. **build** — `pnpm dry-run` to verify the build compiles. If it
   fails, the pipeline bails out without touching the main tree.
6. **apply** — stop `shmastra` and `healer` processes, fast-forward
   the main branch to `origin/main`, re-run `pnpm install` in the
   main directory.
7. **patch** — run any pending scripts from `scripts/patches/` (see
   [Patches](/cloud/day-2/patches)). Each sandbox tracks its
   `version` in Supabase; only newer patches are applied.
8. **restart** — restart pm2 processes (`shmastra`, `healer`). The
   UI waits for a healthy response on port 4111 before calling the
   update complete.

If any phase fails, the pipeline stops and reports. The worktree is
thrown away; the main tree is untouched until phase 6. Only phases
6–8 mutate production state.

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
