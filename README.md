# LifeVault

A multi-user wealth-tracking app — registration, login, and a dashboard where each
person picks which tabs (Insurance, Property, Bank Accounts, Other Assets, Savings &
Investments) they want to track for themselves.

This is the SaaS successor to the Yeoh family's single-family Claude artifact dashboard
(`G:\My Drive\Personal\WEALTH-DATABASE-README.md`) — same idea, rebuilt as a real
multi-tenant app since an artifact can't do accounts or per-user data.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Clerk** for registration/login/sessions (nothing homegrown touches passwords)
- **Prisma + PostgreSQL** for everything else (profile, DOB, which tabs are enabled)
- **Railway** for hosting (app + managed Postgres)

## What's built so far

- Landing page → Sign up / Sign in (Clerk)
- Onboarding: collects Name + DOB, lets the person pick their tabs, creates their profile row
- Dashboard: shows Name / DOB / Age, a card per enabled tab (placeholder content for now)
- Settings: edit Name/DOB, turn tabs on/off
- Each `/dashboard/<tab>` route is gated — only reachable if that user enabled it

## What's NOT built yet

The actual category trackers (the Insurance/Property/etc. tables, totals, what-if
toggles that exist on the family dashboard) are placeholders right now
(`src/app/dashboard/[tab]/page.tsx`). Porting those over, per category, with a proper
per-user Postgres schema instead of Claude-maintained JSON, is the next phase.
Subscription billing (Stripe) isn't wired up yet either — right now every signed-up
user has full access.

## Local setup

1. **Install dependencies** (already done if you're reading this right after I built it):
   ```bash
   npm install
   ```

2. **Get Clerk keys.** Sign up at [clerk.com](https://clerk.com), create an application,
   and copy its API keys (Dashboard → API Keys).

3. **Get a Postgres database.** Easiest: install Postgres locally, or spin up a free one
   on Railway and copy its connection string.

4. **Fill in `.env.local`** (already scaffolded with placeholder/fake values — replace
   every one):
   ```
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

5. **Create the database tables:**
   ```bash
   npm run db:migrate
   ```

6. **Run it:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploying to Railway

1. Push this folder to a GitHub repo (Railway deploys from git).
2. In Railway: **New Project → Deploy from GitHub repo**, pick this repo.
3. **Add a Postgres database**: New → Database → PostgreSQL, in the same Railway project.
4. On the Next.js service, set these **environment variables** (Settings → Variables):
   - `DATABASE_URL` — reference the Postgres service's own variable
     (`${{Postgres.DATABASE_URL}}` in Railway's variable picker)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — your **live** Clerk keys
     for production (a separate pair from your local/test ones, from the same Clerk
     dashboard once you flip it to production, or a second Clerk app)
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding`
5. Railway auto-detects Next.js (Nixpacks) and runs `npm install` (which also runs
   `prisma generate` via the `postinstall` script) then `npm run build` / `npm run start`.
6. **Run the database migration against production** once, from your machine, pointed at
   Railway's Postgres (copy its public `DATABASE_URL` temporarily):
   ```bash
   DATABASE_URL="<railway-postgres-url>" npm run db:deploy
   ```
7. In your Clerk dashboard, add the Railway domain (or your custom domain) under
   **Paths/Domains** so Clerk allows sign-in from it.

## Project structure

```
src/
  app/
    page.tsx                  landing page
    sign-in/[[...sign-in]]/   Clerk sign-in
    sign-up/[[...sign-up]]/   Clerk sign-up
    onboarding/               first-time profile + tab setup
    dashboard/
      layout.tsx              nav shell, tab links filtered to user's enabledTabs
      page.tsx                overview: Name/DOB/Age + tab cards
      [tab]/page.tsx           placeholder per-category page
      settings/                edit profile + tabs
  lib/
    prisma.ts                 Prisma client singleton
    getCurrentUser.ts         Clerk userId -> this app's User row
    tabs.ts                   the list of available tabs (single source of truth)
    age.ts                    DOB -> age
  proxy.ts                    Clerk route protection (Next.js 16 renamed "middleware")
prisma/
  schema.prisma                User model: clerkId, email, name, dob, enabledTabs
```

## Notes for whoever picks this up next (including future-Claude)

- `cacheComponents`/`partialPrefetching` are deliberately **off** in `next.config.ts` —
  every route here is personalized and auth-gated, so Next 16's static-first caching
  model fights the app more than it helps. Don't re-enable without re-checking every
  route still renders.
- Clerk's `createRouteMatcher`-based `proxy.ts` is what Clerk currently calls
  "deprecated but working" — it still works fine, but Clerk's newer guidance is to put
  auth checks in each page/layout instead. Not urgent to change.
- The theme (cream background, forest-green hero, sage/rose/clay/tan/stone pastel
  accents) is lifted directly from the family dashboard's "Minimal Financial Reset"
  look — see the CSS variables in `src/app/globals.css`.
