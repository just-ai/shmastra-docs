# Running with Docker

Shmastra ships a multi-stage Dockerfile and a `docker-compose.yml` in
the `docker/` directory of the template. The image bakes in Node 22,
Python 3, Playwright (for the [headless browser](/shmastra/features/headless-browser)),
and `markitdown` (for the RAG pipeline on [uploaded files](/shmastra/features/working-with-files)).

## When to use it

- You don't want Node, Python, or Playwright's Chromium on your host.
- You want a reproducible dev environment to share with colleagues.
- You need to run Shmastra on a server without a full toolchain.

For production multi-tenant hosting on Vercel, use
[Shmastra Cloud](/cloud/) instead.

## Quick start

From your Shmastra project directory:

```shell
docker compose -f docker/docker-compose.yml up
```

The compose service mounts your project into the container, installs
dependencies on startup, and runs `npm run dev`. Mastra Studio then
listens on `http://localhost:4111` as usual.

## Environment

Pass your provider keys through Docker the same way you'd pass them to
any other process:

- Add them to `.env` in the project root (the compose file picks the
  env file up via the mounted project), or
- Export them in your shell before `docker compose up`.

The setup wizard still runs on first start inside the container — it's
interactive and asks the same questions as a host install.

## Rebuilding

If you bump Shmastra or add a native dependency and the install step
needs to re-run cleanly:

```shell
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up --build
```

## Notes

- The image includes Python 3 because the `markitdown` RAG pipeline
  runs Python under the hood.
- Playwright's Chromium Headless Shell is pre-installed; you don't
  need to run `npm run install-browsers` inside the container.
- Storage paths (`.storage/`, `files/`) live on the mounted volume, so
  your data survives container restarts.
