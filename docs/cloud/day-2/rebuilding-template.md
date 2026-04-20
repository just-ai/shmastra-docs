# Rebuilding the E2B template

Most Shmastra upgrades reach existing sandboxes through the
[update pipeline](/cloud/manage-ui/applying-updates) and
[patches](/cloud/day-2/patches). Rebuilding the E2B template is a
separate lever you pull less often.

## When to rebuild

Rebuild when:

- The base image changes — new system dependency, new Node major,
  OS update.
- You want **newly-provisioned** sandboxes to start with a different
  baseline — e.g. you've accumulated a long list of patches and
  want new sandboxes to skip them.
- The node_modules in the template are badly stale and every
  sandbox's first install takes too long.

## When NOT to rebuild

Do not rebuild for routine Shmastra upgrades. Running the update
pipeline against every sandbox is much cheaper and doesn't touch
users' filesystems.

Reasons not to rebuild:

- Existing sandboxes won't pick up template changes anyway — they're
  already running the old template's filesystem.
- Uploading a new template takes a long time (multi-GB image).
- E2B may bill you for the template storage.

## How to rebuild

From your `shmastra-cloud` checkout, with `E2B_API_KEY` in
`.env.local`:

```shell
npm run template:build
```

This runs `scripts/build-e2b-template.ts`, which:

- Builds an E2B image on top of Node 22 + Python 3 + Playwright +
  markitdown.
- Clones the Shmastra repo at the revision the script pins.
- Runs `pnpm install` inside the image so the template's
  `node_modules` is pre-baked.
- Stamps the image with the **current template version** —
  sandboxes created from this template will write the matching
  number to `.template-version` and skip already-baked patches.
- Uploads to E2B under the `shmastra` template name.

## Cut-over behaviour

- **Existing sandboxes** are untouched by a rebuild. They continue
  to run the filesystem they were originally provisioned with, and
  they get Shmastra upgrades through the normal update pipeline.
- **New sandboxes** (next time a user signs in for the first time
  *or* you delete an existing sandbox and force a reprovision) spawn
  from the new template.

If you want every sandbox on a newer baseline, provision fresh
sandboxes after the rebuild — but be aware that the user's agent /
workflow files live on the sandbox filesystem, so destroying a
sandbox deletes their work unless you've exported it first.

## Collapsing patches

A common reason to rebuild: you've shipped 30 patches and want a
clean baseline.

1. Point `scripts/build-e2b-template.ts` at the Shmastra revision
   that already includes everything those patches did.
2. Run `npm run template:build`. New sandboxes start at (say)
   patch version `030` and skip `001`–`030`.
3. Optionally delete the old patches from `scripts/patches/` —
   existing sandboxes already ran them, new ones skip them, so they
   carry no weight.

## Versioning

Each template carries a version. The `scripts/build-e2b-template.ts`
script writes this into `.template-version` inside the image; the
update pipeline reads it to decide which patches apply. Don't
hand-edit the file on a running sandbox.
