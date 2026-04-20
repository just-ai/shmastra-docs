# Patches

A **patch** is a small numbered script under
`scripts/patches/` that runs inside each sandbox during the
[update pipeline](/cloud/manage-ui/applying-updates). Use patches for
one-off migrations: install a new system dep, seed a config file,
fix a mistake that's already baked into live sandboxes.

## Anatomy

Each file exports a default function:

```ts
// scripts/patches/005_my_migration.ts
export default async function (ctx) {
  // ctx has helpers for shell, files, and the sandbox handle
  await ctx.shell('pnpm add some-new-package')
}
```

Filenames are `NNN_description.ts`, with `NNN` being a zero-padded
monotonic integer. Patches apply in filename order.

## Version tracking

The `sandboxes` table has a `version` column. Each sandbox stores the
numeric prefix of its highest-applied patch. When the update pipeline
reaches **phase 8 — patch**, it runs every patch whose prefix is
higher than the current `version`, then updates `version` to the
highest number it applied.

A freshly-provisioned sandbox starts with a `.template-version` file
(stamped by `npm run template:build`) so it skips patches already
baked into the template image.

## Currently shipped patches

At time of writing `scripts/patches/` contains:

| Filename | What it does |
|---|---|
| `001_install_sqlite3.ts` | Installs system SQLite needed by LibSQL. |
| `002_install_healer.ts` | Adds the healer agent to pm2. |
| `003_install_browsers.ts` | Installs Playwright's Chromium Headless Shell. |
| `004_setup_env.ts` | Seeds sandbox-side `.env` defaults. |

Your own patches sit alongside these.

## Writing a patch

Typical shape:

```ts
export default async function ({ shell, write }) {
  await shell('pnpm add -w some-package@1.2.3')
  await write(
    '.config/my-thing.json',
    JSON.stringify({ enabled: true }, null, 2),
  )
}
```

Rules of thumb:

- **Idempotent.** Your patch may re-run if an update is retried.
  Check for the change before making it.
- **Fast.** Every running sandbox will eventually run this. Don't
  ship a patch that takes minutes.
- **Small.** One concern per patch — easier to roll forward, easier
  to attribute failure.
- **Test against one sandbox first.** Run the update CLI against a
  single sandbox id before releasing to the whole fleet.

## When to patch vs rebuild the template

Patch when the change is:

- A single dependency install.
- A config file to add or seed.
- A fix to a value baked into older sandboxes.

[Rebuild the template](/cloud/day-2/rebuilding-template) when:

- The base image changes (new Node major, new OS base).
- You want *new* sandboxes to skip a growing patch chain — collapse
  old patches into a fresh baseline.
