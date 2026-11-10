# Emmanuel Ouko Digital Platform

A new Next.js application is being developed alongside the existing legacy
website. This keeps the current site intact while the secure platform is built.

## Stack

- Next.js App Router + TypeScript
- React
- Supabase Auth + PostgreSQL
- `@supabase/ssr` for cookie-based sessions

## Start locally

```bash
cd platform
cp .env.example .env.local
# Add your Supabase URL, publishable key and SITE_URL to .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## First setup

1. Run `supabase/migrations/0001_auth_profiles.sql` in the Supabase SQL Editor.
2. Add `http://localhost:3000/auth/confirm` to Supabase Auth's allowed redirect URLs.
3. Register a user and confirm its email.
4. Promote the first administrator with the SQL documented at the bottom of the
   migration. Do this manually as the project owner; never from the browser.

See [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) for the full request flow,
credentials, tokens, setup and security boundaries.

## Scripts

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript checks
- `npm run build` — production build

Do not add Supabase secret/service-role keys to this repository.
