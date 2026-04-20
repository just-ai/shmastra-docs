# Onboarding your team

Cloud uses WorkOS as the identity provider. Anyone who's a member of
your configured `WORKOS_ORGANIZATION_ID` can sign in and get a
sandbox.

## Invite users

Open the [WorkOS dashboard](https://dashboard.workos.com) →
**Organizations** → your org → **Members** → **Add member**.

For each person:

- Enter their email.
- Pick their authentication method (email + password, magic link,
  SSO — whatever your AuthKit config allows).
- Click **Send invite**.

WorkOS emails them a link. Signing in for the first time creates a row
in Supabase's `users` table; `/workspace` provisions their sandbox on
demand.

## First-run experience for a new user

1. They click the invite email, sign in, land on your Cloud URL.
2. `/workspace` spins up an E2B sandbox from the `shmastra` template.
   They see a "provisioning → ready" status indicator while pm2 boots
   Shmastra on port 4111.
3. Mastra Studio loads with the Shmastra chat widget attached.
4. They start typing. No wizard to run — the sandbox already has a
   virtual key and all the provider plumbing.

Expect the first sandbox to take ~30–60 seconds. Subsequent
sign-ins resume the paused sandbox, which is much faster.

## Removing a user

In WorkOS → **Organizations → Members** → remove. They immediately
lose the ability to sign in. Their sandbox on E2B stays around until
you either delete it manually via the Manage UI or from the E2B
dashboard.

## How many sandboxes can I run?

Bounded by your E2B plan's concurrent-sandbox limit. Paused sandboxes
don't count against concurrency — only `ready`/`healing` ones. Since
Cloud pauses idle sandboxes after ~10 minutes, you can usually
support many more named users than concurrent ones.

## Tips

- **Staging vs production.** Create two WorkOS organisations and
  deploy Cloud twice — one to a staging Vercel project pointing at
  one `WORKOS_ORGANIZATION_ID`, one to production pointing at the
  other. Members of only the staging org can see staging.
- **Custom domains.** Add the domain in Vercel, then update WorkOS
  redirect URIs.
- **Billing transparency.** Consider giving your team a rough-usage
  dashboard (a small app fed by your own Composio/E2B billing APIs)
  so nobody accidentally burns a month's budget.
