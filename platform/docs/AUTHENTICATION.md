# Authentication and authorization

This application uses Supabase Auth with Next.js App Router and the
`@supabase/ssr` package. Sessions are stored in cookies so that server-rendered
pages and server actions use the same verified identity.

## Components

- `app/sign-up/page.tsx`: collects the name, email and password.
- `lib/auth/actions.ts`: server actions call Supabase Auth for registration,
  password sign-in and local sign-out.
- `app/auth/confirm/route.ts`: exchanges the one-time PKCE authorization code
  from the email confirmation link for a session.
- `lib/supabase/client.ts`: browser client for future interactive client
  components. It uses only the public publishable key.
- `lib/supabase/server.ts`: server client reads/writes the request cookies.
- `lib/supabase/proxy.ts` and root `proxy.ts`: refresh an expiring token,
  verify claims, and write updated cookies back to the response.
- `lib/auth/guards.ts`: server-side route guards use `getClaims()` and the
  RLS-protected profile role to authorize access.
- `supabase/migrations/0001_auth_profiles.sql`: creates profiles, RLS policies,
  safe user bootstrap and the admin role lookup function.

## Request flow

### Registration

1. The browser submits the sign-up form to the Next.js Server Action.
2. The action validates the fields on the server and calls
   `supabase.auth.signUp()`.
3. Supabase Auth creates the identity and sends an email confirmation link.
4. A database trigger creates a profile with role `customer`. The trigger
   ignores any role in user metadata, so a visitor cannot register as admin.
5. The confirmation link returns to `/auth/confirm`. The route exchanges the
   one-time PKCE code with `exchangeCodeForSession()`.
6. Supabase sets the session cookies; the user can then sign in.

### Sign-in and protected requests

1. The browser posts email/password to a Server Action; credentials are not
   written to application logs or stored in a custom table.
2. The action calls `signInWithPassword()`. Supabase validates the password.
3. Supabase issues its access and refresh tokens. The SSR client stores the
   session in cookies, not JavaScript localStorage.
4. On subsequent requests, root `proxy.ts` calls `getClaims()`. This verifies
   the JWT and refreshes it when needed; refreshed cookies are returned to the
   browser.
5. A protected Server Component calls `requireUser()`, which independently
   verifies claims. `requireAdmin()` additionally reads the user's role from
   the database. A missing identity or role fails closed.

### Database authorization

RLS is the final access-control boundary. Hiding a button or redirecting from
a page is not enough. Every future table must have RLS enabled and explicit
least-privilege policies before the application can use it.

The initial `profiles` policies allow authenticated users to read their own
profile, allow admins to read profiles, and allow users to update only their
own `full_name`. There is no client INSERT, DELETE or role UPDATE permission.
The first admin role is assigned manually by the project owner in Supabase SQL
Editor after the account exists and its email is verified.

## Credentials and tokens

- `NEXT_PUBLIC_SUPABASE_URL`: project URL; public configuration.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: public/publishable key; safe to be
  present in browser code by design. It does not replace RLS.
- Passwords: sent to Supabase Auth over HTTPS by the server action; never saved
  in the app's own tables.
- Access token: short-lived JWT; verified with `getClaims()` before server
  authorization decisions.
- Refresh token: used by the Supabase Auth client to renew a session; handled
  by the SSR cookie adapter and proxy.
- Service-role/secret key: not required by this phase and must never be exposed
  to browser bundles, Git, `NEXT_PUBLIC_*` variables or client-side code.

Do not use `getSession()` as proof of identity in server-side authorization:
it reads stored session data and does not independently validate the user.
Use `getClaims()` for verified claims and `getUser()` when a fresh user record
from the Auth server is required.

## Local setup

1. Copy `.env.example` to `.env.local` in `platform/`.
2. Set the Supabase project URL and publishable key. Set `SITE_URL` to
   `http://localhost:3000`.
3. In Supabase Authentication > URL Configuration, add
   `http://localhost:3000/auth/confirm` to the allowed redirect URLs.
4. Run `supabase/migrations/0001_auth_profiles.sql` in the Supabase SQL Editor.
5. From `platform/`, run `npm install`, then `npm run dev`.
6. Register a user, open the confirmation email, and sign in.
7. Promote the first admin using the commented SQL statement at the bottom
   of the migration, replacing the placeholder email with the verified admin's
   email. Run it as the project owner.

For production, set `SITE_URL` to the exact HTTPS domain and add the matching
`/auth/confirm` callback URL to Supabase's allow list. Use a custom SMTP
provider, enable MFA for administrators, configure rate limits and CAPTCHA,
and deploy only after the RLS policies for every active data table have been
reviewed.

## Current boundary

This is the first authentication foundation, not a completed production
security certification. It does not yet implement password reset, MFA
enforcement, audit logging, rate-limit monitoring, CAPTCHA, billing or
project-specific authorization. The existing legacy app remains untouched
until the new platform is tested and migration is approved.
