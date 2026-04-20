# Terminal

Run arbitrary shell commands inside any sandbox.

## Where to find it

[Sandbox table](/cloud/manage-ui/sandbox-table) → row → **Terminal**
tab.

## What it is

A thin wrapper around E2B's command execution. You type a command,
the UI ships it to the sandbox, and streams stdout + stderr back.
It's not an interactive PTY — think `ssh user@host 'some command'`
rather than a full shell.

## Commands you'll actually run

```shell
pm2 status                      # which processes are up?
pm2 restart shmastra            # restart the dev server
pm2 restart healer              # restart the healer agent
pm2 logs shmastra --lines 100   # tail server logs
ls .logs                        # where log files live
cat .env                        # inspect env (handle with care)
pnpm install                    # re-install after a messy merge
pnpm dry-run                    # run the Shmastra dry-run build manually
git status                      # see uncommitted changes
git log --oneline -n 20         # recent commits (includes healer's)
du -sh node_modules files .storage   # disk usage
```

## Combining with other tabs

- [Chat with agent](/cloud/manage-ui/chat-with-agent) is a friendlier
  way to do investigations — the Claude session narrates as it goes.
- [Logs](/cloud/manage-ui/logs) shows pm2 output live; use the
  terminal when you want to run things between log reads.
- [Files](/cloud/manage-ui/files) is easier for edits than piping
  through `sed`.

## When a sandbox is `broken`

A typical rescue loop:

1. Terminal: `pm2 logs shmastra --lines 200` — capture the last
   error.
2. Files: find and fix the offending file.
3. Terminal: `pm2 restart shmastra && sleep 5 && pm2 status`.
4. Sandbox table: confirm status flips back to `ready`.

If it doesn't, hand off to chat: *"Here's the error, have a go."*

## Be careful

- **Destructive commands are unprotected.** `rm -rf` works. Don't
  `rm -rf /`.
- **Secrets are readable.** `cat .env` shows real values; a shoulder
  surfer can see them on your screen.
- **No history between tabs.** Each terminal request is independent
  — environment variable exports don't carry across.
