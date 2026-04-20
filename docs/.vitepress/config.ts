import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Shmastra',
  description: 'Vibe-code AI agents and workflows',
  lang: 'en-US',
  base: '/shmastra-docs/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Shmastra', link: '/shmastra/', activeMatch: '^/shmastra/' },
      { text: 'Shmastra Cloud', link: '/cloud/', activeMatch: '^/cloud/' },
      { text: 'GitHub', link: 'https://github.com/just-ai/shmastra' },
    ],

    sidebar: {
      '/shmastra/': [
        {
          text: 'Shmastra',
          items: [
            { text: 'What is Shmastra', link: '/shmastra/' },
            { text: 'Getting started', link: '/shmastra/getting-started' },
            { text: 'Setup wizard', link: '/shmastra/setup-wizard' },
            { text: 'Configuration', link: '/shmastra/configuration' },
            { text: 'The chat widget', link: '/shmastra/the-chat-widget' },
          ],
        },
        {
          text: 'Features',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/shmastra/features/' },
            { text: 'Creating agents', link: '/shmastra/features/creating-agents' },
            { text: 'Creating workflows', link: '/shmastra/features/creating-workflows' },
            { text: 'Inspect & fix', link: '/shmastra/features/inspect-and-fix' },
            { text: 'Working with files', link: '/shmastra/features/working-with-files' },
            { text: 'Web search', link: '/shmastra/features/web-search' },
            { text: 'Headless browser', link: '/shmastra/features/headless-browser' },
            { text: 'Web apps', link: '/shmastra/features/web-apps' },
            { text: 'Rich chat replies', link: '/shmastra/features/rich-chat' },
            { text: 'Connecting to channels', link: '/shmastra/features/connecting-channels' },
            { text: '— Telegram', link: '/shmastra/features/channel-telegram' },
            { text: '— Slack', link: '/shmastra/features/channel-slack' },
            { text: '— Discord', link: '/shmastra/features/channel-discord' },
            { text: '— WhatsApp', link: '/shmastra/features/channel-whatsapp' },
            { text: '— Microsoft Teams', link: '/shmastra/features/channel-teams' },
            { text: '— Email (Resend)', link: '/shmastra/features/channel-email' },
            { text: 'MCP servers', link: '/shmastra/features/mcp-servers' },
            { text: 'Composio toolkits', link: '/shmastra/features/composio-toolkits' },
            { text: 'One-click OAuth', link: '/shmastra/features/one-click-oauth' },
            { text: 'Environment variables', link: '/shmastra/features/environment-variables' },
          ],
        },
        {
          text: 'Operating',
          items: [
            { text: 'Running with Docker', link: '/shmastra/running-with-docker' },
            { text: 'Troubleshooting', link: '/shmastra/troubleshooting' },
          ],
        },
      ],

      '/cloud/': [
        {
          text: 'Shmastra Cloud',
          items: [
            { text: 'For your team', link: '/cloud/' },
            { text: 'What is Shmastra Cloud', link: '/cloud/what-is-shmastra-cloud' },
            { text: 'Architecture', link: '/cloud/architecture' },
            { text: 'Prerequisites', link: '/cloud/prerequisites' },
          ],
        },
        {
          text: 'Setup',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/cloud/setup/' },
            { text: 'Supabase', link: '/cloud/setup/supabase' },
            { text: 'WorkOS', link: '/cloud/setup/workos' },
            { text: 'E2B', link: '/cloud/setup/e2b' },
            { text: 'AI providers', link: '/cloud/setup/ai-providers' },
            { text: 'Build the E2B template', link: '/cloud/setup/build-e2b-template' },
            { text: 'Environment variables', link: '/cloud/setup/env-vars' },
            { text: 'Deploy to Vercel', link: '/cloud/setup/deploy-to-vercel' },
          ],
        },
        {
          text: 'Running Cloud',
          items: [
            { text: 'Local development', link: '/cloud/local-development' },
            { text: 'Onboarding your team', link: '/cloud/onboarding-your-team' },
          ],
        },
        {
          text: 'Manage UI',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/cloud/manage-ui/' },
            { text: 'Sandbox table', link: '/cloud/manage-ui/sandbox-table' },
            { text: 'Applying updates', link: '/cloud/manage-ui/applying-updates' },
            { text: 'Chat with agent', link: '/cloud/manage-ui/chat-with-agent' },
            { text: 'Logs', link: '/cloud/manage-ui/logs' },
            { text: 'Files', link: '/cloud/manage-ui/files' },
            { text: 'Terminal', link: '/cloud/manage-ui/terminal' },
          ],
        },
        {
          text: 'Day 2',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/cloud/day-2/' },
            { text: 'Patches', link: '/cloud/day-2/patches' },
            { text: 'Healer agent', link: '/cloud/day-2/healer-agent' },
            { text: 'Rebuilding the template', link: '/cloud/day-2/rebuilding-template' },
          ],
        },
        {
          text: 'Operating',
          items: [
            { text: 'Troubleshooting', link: '/cloud/troubleshooting' },
          ],
        },
      ],
    },

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/just-ai/shmastra-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/just-ai/shmastra' },
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025–present just-ai',
    },
  },
})
