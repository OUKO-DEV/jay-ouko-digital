# Vercel deployment guide

The Next.js app lives in the repository subdirectory `platform/`. Deploy that
directory as the Vercel project root; do not deploy the repository root as a
static site.

## Vercel project settings

- Framework preset: Next.js
- Root directory: `platform`
- Build command: `npm run build` (default)
- Install command: `npm install` (default)
- Output directory: leave the Next.js default
- Node.js: 22.x

Connect the GitHub repository `OUKO-DEV/jay-ouko-digital`. Use
`feat/global-platform-foundation` for a preview deployment. Only make it the
production branch after the database migrations, production environment,
authentication callback and end-to-end tests have passed and the pull request
has been reviewed and merged.

## Required environment variables

Configure these in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the Supabase publishable key.
- `SITE_URL`: the exact deployed HTTPS origin, without a trailing slash.

Set the three variables for Preview and Production as appropriate. Do not add
a Supabase secret/service-role key to any `NEXT_PUBLIC_*` variable, source
file or GitHub repository. A publishable key is designed to be public, but it
does not replace database Row Level Security.

## Supabase prerequisites

Before exposing the application to real users:

1. Apply migrations in this order:
   - `supabase/migrations/0001_auth_profiles.sql`
   - `supabase/migrations/0002_client_workflows.sql`
   - `supabase/migrations/0003_learning_bookings_payments.sql`
2. In Supabase Authentication > URL Configuration, set the production Site URL
   to the Vercel domain and add `https://YOUR_DOMAIN/auth/confirm` to allowed
   redirect URLs. Keep the localhost callback for development if needed.
3. Enable email confirmation and configure reliable production SMTP delivery.
4. Register an owner account, verify its email, then assign its administrator
   role using the SQL documented at the end of migration 0001.
5. Test signup, email confirmation, login, session refresh, logout, customer
   isolation, admin-only access, project requests, bookings, course enrolment
   and payment-reference review.
6. Enable MFA for administrator accounts, configure CAPTCHA/rate limits,
   review backups and inspect RLS policies before public production use.

## Important scope notes

The M-Pesa page currently stores transaction references for manual review.
It does not initiate STK Push, query Safaricom Daraja, or independently verify
payments. Do not treat a user-submitted receipt/reference as confirmed money.

The learning catalogue ships with unpublished draft courses; an admin must
review their lessons and pricing before publishing them. Do not advertise a
course as available until its actual lesson content has been prepared.

The Forex learning material is educational only. Do not present it as
investment advice, trade signals or guaranteed returns.

## Release checklist

- [ ] GitHub Actions TypeScript, ESLint and production build checks pass on the
      exact release commit.
- [ ] Supabase migrations are applied and verified on the intended project.
- [ ] Production environment variables and callback URLs are set.
- [ ] The first admin account is verified and MFA is enabled.
- [ ] End-to-end authentication and RLS tests pass.
- [ ] M-Pesa wording clearly says manual reconciliation until Daraja is built.
- [ ] Course content and pricing are reviewed before publication.
- [ ] Production domain, HTTPS, privacy notice and terms are configured.
