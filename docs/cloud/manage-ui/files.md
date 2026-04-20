# Files

A full file manager for each sandbox. Browse, read, edit, upload,
download, rename, delete — anything you'd expect from a desktop file
app, but against the sandbox's filesystem over E2B.

## Where to find it

[Sandbox table](/cloud/manage-ui/sandbox-table) → row → **Files** tab.

## What you can do

| Action | How |
|---|---|
| **Browse folders** | Click directories in the tree. |
| **View a file** | Click the filename — the viewer has syntax highlighting for common languages. |
| **Edit a file** | Click **Edit**, make changes, save. Writes immediately. |
| **Create a folder** | **New folder** button in the toolbar. |
| **Upload files** | Drag into the browser, or use the **Upload** button. |
| **Download a file** | Right-click → **Download**. |
| **Download a folder** | Right-click a folder → **Download as zip**. |
| **Rename / delete** | Right-click → action. |

## Behind the scenes

Each action maps to a route in `manage/routes/files.mts`:
`list`, `read`, `write`, `download`, `mkdir`, `delete`, `rename`.
Everything runs through the E2B SDK connection opened by
`connectSandbox()` in `routes/helpers.mts`.

## Good uses

- **Patch a broken agent.** Someone's `src/mastra/agents/foo.ts`
  has a syntax error the healer can't fix. Open it, fix it, save.
  Then restart pm2 from the [terminal](/cloud/manage-ui/terminal) or
  ask [chat](/cloud/manage-ui/chat-with-agent) to.
- **Grab a user's config.** Download `package.json`, `.env` (take
  extra care with secrets), `tsconfig.json` for offline inspection.
- **Seed a demo.** Upload a preset `files/` directory so a user
  has sample PDFs ready for RAG.

## Be careful

- **`.env` contains secrets.** Don't download it and paste it
  anywhere; don't upload production keys by mistake. The file
  shows real values in the editor.
- **Writes are immediate.** No staging, no diff-then-commit. If
  you edit `src/mastra/agents/foo.ts` live, it hot-reloads.
- **Huge files.** The viewer tries to render them; giant logs
  will freeze the tab. Use **Download** + a desktop editor for
  anything above a few MB.
