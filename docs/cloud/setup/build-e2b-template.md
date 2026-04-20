# Setup: Build the E2B template

Before Cloud can spawn any sandboxes, you need to build the
`shmastra` E2B template. This is a one-time step — subsequent
Shmastra changes are delivered to existing sandboxes through the
[Manage UI update pipeline](/cloud/manage-ui/applying-updates), not
via template rebuilds.

## When do I need to rebuild?

- On **first setup** (now).
- When the base image in `scripts/build-e2b-template.ts` changes (new
  system dependency, new Node major, etc.).
- When you want *new* sandboxes to be provisioned with a different
  starting Shmastra revision.

For day-to-day Shmastra upgrades, use
[patches](/cloud/day-2/patches) and the
[update pipeline](/cloud/manage-ui/applying-updates) instead of
rebuilding. See [Rebuilding the template](/cloud/day-2/rebuilding-template)
for the decision tree.

## Steps

### 1. Have `.env.local` ready

`npm run template:build` reads `.env.local` for `E2B_API_KEY`. If
you haven't already:

```shell
cp .env.example .env.local
```

and paste in at least `E2B_API_KEY`.

### 2. Run the build

From the `shmastra-cloud` checkout:

```shell
npm run template:build
```

What this does:

- Runs `scripts/build-e2b-template.ts` under Node's
  `--experimental-strip-types` flag.
- Builds an E2B sandbox image containing pm2, the Shmastra repo, and
  the project's dependencies.
- Stamps the image with the **current template version** — this is
  how sandboxes know which [patches](/cloud/day-2/patches) are already
  baked in.
- Uploads the image to E2B under the `shmastra` template name.

This takes a while — the image is multi-gigabyte (Node 22 + Python 3 +
Playwright Chromium + markitdown + `@manzt/uv` + the full Shmastra
node_modules).

### 3. Verify

In the E2B dashboard, under **Templates**, you should see `shmastra`
with the size and creation timestamp. New sandboxes spawn from this
template.

## Next

Continue to [Environment variables](/cloud/setup/env-vars).
