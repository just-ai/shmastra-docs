# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies (Node 22+ required)
npm run docs:dev     # dev server at http://localhost:5173/shmastra-docs/
npm run docs:build   # static build → docs/.vitepress/dist
npm run docs:preview # preview the built site locally
```

## Architecture

This is a [VitePress](https://vitepress.dev/) documentation site for two products:

- **Shmastra** — a self-hosted AI agent/workflow template that developers deploy themselves
- **Shmastra Cloud** — a managed multi-tenant deployment of Shmastra for teams

All content lives under `docs/` as Markdown files. The VitePress config at `docs/.vitepress/config.ts` defines the full sidebar navigation and must be updated whenever pages are added, removed, or renamed. The `base` is `/shmastra-docs/` (matches the GitHub Pages path).

The two documentation sections are structurally independent:
- `docs/shmastra/` — developer-facing: getting started, configuration, chat widget, features, Docker, troubleshooting
- `docs/cloud/` — ops-facing: architecture, setup steps (Supabase, WorkOS, E2B, AI providers, Vercel), manage UI reference, day-2 operations

## Styling

The site uses a custom Mastra-inspired dark theme defined in `docs/.vitepress/theme/`:

- `index.ts` — extends the default VitePress theme and imports `custom.css`
- `custom.css` — all CSS variable overrides and component-level styles

**Design tokens:**
- Fonts: **Inter** (body), **Geist Mono** (code) — loaded from Google Fonts via `@import` in `custom.css`
- Background: `#050505` (body), `#171717` (soft/cards), `#242424` (muted)
- Text: `#e6e6e6` (primary), `#b0b0b0` (secondary), `#666666` (tertiary)
- Accent: `#46f488` (bright green) — used for active sidebar items, links, inline code, hero gradient, buttons
- Borders: `#343434` (border), `#2a2a2a` (dividers)
- Default appearance: dark (`appearance: 'dark'` in `config.ts`)

When adding new styles, override VitePress CSS variables (`--vp-c-*`, `--vp-font-family-*`) inside `.dark {}` in `custom.css` rather than writing component-specific rules where possible. Do not add a light-mode equivalent unless explicitly asked.

**Home page (`docs/index.md`):** uses `layout: home` with a hero (name + text + tagline, no action buttons) and two feature cards linking to `/shmastra/` and `/cloud/`. Feature card `linkText` must not include a trailing `→` — VitePress adds one automatically.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds with `npm run docs:build` and deploys `docs/.vitepress/dist` to GitHub Pages. The live site is at <https://just-ai.github.io/shmastra-docs/>.

One-time repo setup required: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
