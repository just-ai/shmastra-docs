# Setup: WorkOS

WorkOS handles sign-in and organisation membership. Shmastra Cloud
uses the [AuthKit Next.js SDK](https://workos.com/docs/user-management/nextjs)
— users see a hosted sign-in page, and the middleware in `middleware.ts`
verifies each request.

## Steps

### 1. Create a WorkOS account

At <https://dashboard.workos.com> → sign up. Create a new project.

### 2. Enable AuthKit

In the dashboard navigate to **AuthKit → Configuration**. Turn on
AuthKit. Pick the authentication methods your team will use (email +
password, magic link, Google, Microsoft, SSO — your call).

### 3. Set the redirect URI

Still in AuthKit Configuration, under **Redirect URIs**, add the
callback URL for your Vercel deployment:

```
https://<your-cloud-domain>/callback
```

…and, while you're iterating locally, also add:

```
http://localhost:3000/callback
```

### 4. Create (or pick) an organisation

In **Organizations** create one named after your company. The
Cloud middleware only lets members of a specific organisation through
— you'll paste its id into `WORKOS_ORGANIZATION_ID`. You can invite
members now, or wait until the app is live (see
[Onboarding your team](/cloud/onboarding-your-team)).

### 5. Collect the env vars

From **API Keys** and **Organizations**:

- **API key** (starts with `sk_`) → `WORKOS_API_KEY`
- **Client ID** (starts with `client_`) → `WORKOS_CLIENT_ID`
- **Organization ID** (starts with `org_`) → `WORKOS_ORGANIZATION_ID`

### 6. Generate a cookie password

AuthKit needs a cookie-encryption secret at least 32 characters long.
Generate one:

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use the output as `WORKOS_COOKIE_PASSWORD`.

## Where the variables go

| Variable | `.env.local` | Vercel |
|---|---|---|
| `WORKOS_API_KEY` | ✓ | ✓ |
| `WORKOS_CLIENT_ID` | ✓ | ✓ |
| `WORKOS_ORGANIZATION_ID` | ✓ | ✓ |
| `WORKOS_COOKIE_PASSWORD` | ✓ | ✓ |

## Tips

- **Rotate `WORKOS_COOKIE_PASSWORD` carefully.** Changing it
  invalidates every active session. Coordinate with your team.
- **One organisation ID per deployment.** If you want separate
  "staging" and "production" sets of sandboxes, make two WorkOS
  organisations and deploy twice.
- **Custom domain on Vercel.** Remember to add
  `https://your-custom-domain/callback` to WorkOS redirect URIs when
  you switch off the default `*.vercel.app` URL.

## Next

Continue to [E2B](/cloud/setup/e2b).
