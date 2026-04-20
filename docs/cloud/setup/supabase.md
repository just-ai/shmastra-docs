# Setup: Supabase

Supabase stores two small tables: `users` (with a `virtual_key`
column) and `sandboxes`. The `user_sandboxes` view joins them for
admin queries.

## Steps

### 1. Create a project

At <https://supabase.com/dashboard> → **New Project**. Pick a region
close to your Vercel deployment. Save the database password.

### 2. Grab the env vars

In **Project Settings → API**:

- **Project URL** → `SUPABASE_URL`
- **`service_role` secret** → `SUPABASE_SERVICE_ROLE_KEY`

Cloud uses the service-role key to bypass row-level security from the
Next.js app. Treat it like the root password — it never leaves the
server and never ships to the browser.

### 3. Run the initial migration

Open **SQL Editor** → **New query**. Paste the contents of
`supabase/migrations/001_init.sql` from your `shmastra-cloud` checkout.
Click **Run**.

This creates:

- The `users` and `sandboxes` tables.
- The `user_sandboxes` view.
- The indexes and triggers used by the sandbox-manager.

### 4. Verify

In **Table Editor** you should now see three objects: `users`,
`sandboxes`, `user_sandboxes`. The tables are empty; they'll populate
the first time someone signs in.

## Where the variables go

| Variable | `.env.local` | Vercel |
|---|---|---|
| `SUPABASE_URL` | ✓ | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✓ |

## Next

Continue to [WorkOS](/cloud/setup/workos).
