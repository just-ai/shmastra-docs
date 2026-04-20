# shmastra-docs

Documentation site for **Shmastra** and **Shmastra Cloud**, published at
<https://just-ai.github.io/shmastra-docs/>.

Built with [VitePress](https://vitepress.dev/) and deployed to GitHub
Pages via GitHub Actions.

## Local development

```bash
npm install
npm run docs:dev      # http://localhost:5173/shmastra-docs/
npm run docs:build    # static build into docs/.vitepress/dist
npm run docs:preview  # preview the built site
```

Node 22 or newer is recommended (the GitHub Actions workflow pins 22).

## Structure

```
docs/
├── index.md                  # landing page (hero + two audience cards)
├── shmastra/                 # for developers using the Shmastra template
│   ├── index.md
│   ├── getting-started.md
│   ├── setup-wizard.md
│   ├── configuration.md
│   ├── the-chat-widget.md
│   ├── features/             # one page per chat-widget feature
│   ├── running-with-docker.md
│   └── troubleshooting.md
└── cloud/                    # for engineers deploying Shmastra Cloud
    ├── index.md
    ├── what-is-shmastra-cloud.md
    ├── architecture.md
    ├── prerequisites.md
    ├── setup/                # step-by-step first-time setup
    ├── local-development.md
    ├── onboarding-your-team.md
    ├── manage-ui/            # admin UI reference
    ├── day-2/                # patches, healer, template rebuilds
    └── troubleshooting.md
```

## Publishing

`main` → GitHub Actions builds the site and deploys it to Pages.

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.
