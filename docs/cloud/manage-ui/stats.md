# Stats

The **Stats** panel shows live resource usage for the selected sandbox.

## Opening it

Click on any sandbox row in the [Sandbox table](/cloud/manage-ui/sandbox-table)
to open the slide panel, then choose the **Stats** tab.

## What you see

| Metric | Description |
|---|---|
| **CPU** | Current CPU load as a percentage, plotted as a rolling sparkline. |
| **Memory** | RSS memory used by the `shmastra` pm2 process, plotted as a sparkline. |
| **Disk** | Filesystem usage for the sandbox root partition. |

All three are polled every few seconds while the panel is open.

## When to use it

- **Diagnosing slow responses** — an agent stuck in a loop often shows
  CPU pegged at 100 %.
- **Checking memory pressure** — if memory climbs toward the cgroup
  limit the [healer](/cloud/day-2/healer-agent) will eventually
  trigger an emergency restart. You can pre-empt it by restarting
  from the Terminal tab.
- **Verifying a sandbox restarted** — after an update, confirm the
  process came back online and memory settled to a baseline.

## Automatic healer threshold

The healer agent monitors the same signals in the background:

- **Memory > 90 %** of the cgroup limit, sustained for ≈ 1 minute → emergency heal.
- **Load average > 2.5 per CPU core**, sustained for ≈ 1 minute → emergency heal.

See [Healer agent](/cloud/day-2/healer-agent) for details.
