# Araz.me

Production-oriented personal brand and content platform for **Araz Shahkarami / آراز شاه‌کرمی**. It is Persian-first, RTL-aware, English-enabled, and designed around geospatial backend engineering, GeoAI, open source, teaching, and Araz Cast.

The previous static HTML site remains in the repository for historical reference. The active application is the Next.js App Router project at the repository root.

## Architecture

- Next.js 16.3 App Router, React 19, strict TypeScript
- Server Components by default; small client islands for theme, navigation, forms, and admin interaction
- PostgreSQL with a normalized Prisma schema and checked-in SQL migration
- Signed HTTP-only admin sessions, bcrypt password hashing, ADMIN/EDITOR roles, server-side authorization, origin checks, rate limiting, and audit logs
- Persian `/fa` and English `/en` route trees with correct language and direction attributes
- Verified seed content provides a graceful public experience; database-backed editorial content is managed in `/admin`
- Local media storage at `public/uploads`; the `MediaAsset` model and environment boundary support an S3-compatible production adapter
- Standalone Docker build, PostgreSQL, Caddy TLS reverse proxy, health checks, persistent volumes, and GitHub Actions CI

## Public and admin features

Public routes: `/{locale}`, `/about`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/podcast`, `/podcast/[slug]`, `/resume`, `/services`, `/open-source`, `/media`, `/contact`, `/search`, `/privacy`, and `/terms`.

The platform also exposes `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/llms.txt`, custom 404/error states, JSON-LD Person data, locale alternates, canonical metadata, print styles, accessible navigation, theme switching, and responsive RTL/LTR layouts.

Admin features include a dashboard, secure login without public registration, article creation/editing with editorial states and revisions, project/podcast inventories, media upload validation, a private contact inbox, site settings, audit activity, and role-aware security views.

The normalized schema covers users, pages, posts, categories, tags, projects, technologies, podcasts, guests, experience, education, skills, services, talks/media, open-source entries, social links, navigation, media, contacts, settings, SEO, redirects, revisions, and audit logs.

## Requirements and local setup

- Node.js 22+, npm 11+, PostgreSQL 15+ (17 recommended)

```bash
cp .env.example .env
npm ci
docker compose up -d db
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The root redirects to Persian. Use `/en` for English and `/admin/login` for administration.

Before seeding, set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters. To create or rotate the administrator later:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-unique-long-password' npm run admin:create
```

Never pass a production password in shared shell history; use a protected environment file or secret manager.

## Environment variables

Required in production:

| Variable               | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string                           |
| `AUTH_SECRET`          | Random session-signing secret, minimum 32 characters   |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin, for example `https://araz.me` |

`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_NAME` are used only by seed/admin creation commands. Optional SMTP, Turnstile, S3, GitHub, podcast, and privacy-friendly analytics variables are documented in `.env.example`; integrations remain disabled when unset.

## Database lifecycle

```bash
npm run db:migrate              # apply checked-in migrations
npm run db:migrate:dev -- --name describe_change
npm run db:seed                 # install/update verified starter content
```

The initial migration is in `prisma/migrations/20260830000000_initial/`. Do not use `prisma db push` as a production migration strategy.

## Quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run format
npm run build
```

CI runs client generation, migrations against PostgreSQL, type checking, linting, unit tests, and a production build. Contact and admin integration boundaries fail closed if the database is unavailable.

## Production with Docker Compose

1. Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD`, a 32+ character `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
2. Build and start:

```bash
docker compose build --pull
docker compose up -d
```

The one-shot `migrate` service applies checked-in database migrations before the application starts.

3. Create the first administrator with a one-off application container and protected environment variables.
4. Route your platform proxy to the `app` service on port 3000, then verify `/api/health`, `/fa`, `/en`, and `/admin/login`.

On Coolify, assign the public domain to the `app` service on port 3000. Coolify provides the public reverse proxy and HTTPS, so this stack does not bind host ports 80 or 443.

## VPS operations, rollback, and logs

- Use a non-root deployment account, firewall SSH/80/443, and disable password SSH login.
- Keep PostgreSQL on the internal Docker network; never expose port 5432 publicly.
- Store secrets outside Git and restrict `.env` to the deployment user.
- Apply backward-compatible migrations before switching traffic to a new image. Keep the previous image tag for rollback.
- Health-check a new container before switching the reverse proxy. Roll back by pointing Compose to the previous immutable image tag; do not reverse a data migration without a tested down plan.
- Stream JSON Caddy/application logs to journald or a collector with rotation. Never log contact bodies, passwords, tokens, or secrets.

## Backup and restore

Create encrypted, off-host daily database and media backups and test restoration regularly.

```bash
docker compose exec -T db pg_dump -U araz -d araz_me -Fc > araz_me.dump
docker compose exec -T db pg_restore -U araz -d araz_me --clean --if-exists < araz_me.dump
docker run --rm -v arazme_media_data:/data -v "$PWD/backups:/backup" alpine tar czf /backup/media.tgz -C /data .
```

Pause application writes or use a consistent snapshot before a major restore. Back up `.env` separately in an encrypted secret store, never in this repository.

## Security checklist

- [ ] Replace every example secret; use 32+ random bytes for `AUTH_SECRET`
- [ ] Create named admin/editor accounts and deactivate unused accounts
- [ ] Keep HTTPS and Secure cookies enabled in production
- [ ] Restrict database/object storage to private networks and least privilege
- [ ] Configure Turnstile for sustained traffic; use Redis rate limiting at multiple replicas
- [ ] Configure SMTP with SPF, DKIM, and DMARC
- [ ] Run dependency audits and rebuild after framework security releases
- [ ] Review audit logs/contact spam and test backup restoration
- [ ] Keep SVG uploads disabled without an isolated sanitization pipeline

## Owner configuration still required

- Production database, auth secret, and initial administrator credentials
- Confirmation of social URLs, exact employment dates, degree titles, talks, certifications, and external project links before publication
- A larger authorized profile photo if high-resolution display is desired
- SMTP, CAPTCHA, analytics, S3, GitHub token, podcast RSS, and downloadable résumé PDF when those optional integrations are enabled

No unknown dates, degrees, awards, testimonials, metrics, client names, phone number, or secondary email are published.

## Optional enhancements

The architecture has extension points for TipTap editing, S3 image variants, Redis-backed distributed rate limiting/session revocation, TOTP enrollment, a scheduled publishing worker, RSS synchronization, GitHub caching, analytics dashboards, and broader Playwright browser coverage. Enable these only with the required services and owner-approved content.
