# Yournextfit Next Medusa

Local development setup for an independent snowboard and sports ecommerce store powered by Next.js, Medusa v2, PostgreSQL, Redis, Docker Compose, and pnpm.

Phase 2A focuses the catalog around selected snowboard brands: Cloud Suntt, Maibk, and Cosone. Products are modeled as one snowboard model or series per product, with Graphic/Color and Size represented as options and sellable combinations represented as variants.

This repo is intentionally isolated from other local Drupal/Lando/Docker projects. Docker services use project-specific names, a project-specific network, named volumes, and safer non-default host ports.

## Prerequisites

- Node.js 20 or newer
- pnpm 11 or newer
- Docker Desktop

## Local Setup

1. Clone the repo:

```bash
git clone git@github.com:jimyu0414/yournextfit-next-medusa.git
cd yournextfit-next-medusa
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy local env files:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/storefront/.env.example apps/storefront/.env.local
```

4. Start PostgreSQL and Redis:

```bash
docker compose up -d
```

5. Run Medusa migrations:

```bash
pnpm backend:db:migrate
```

6. Seed local store data:

```bash
pnpm backend:seed
```

Copy the printed publishable API key into `apps/storefront/.env.local`:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

7. Start the Medusa backend and built-in admin:

```bash
pnpm backend:dev
```

8. In another terminal, start the storefront:

```bash
pnpm storefront:dev
```

## Local URLs

- Medusa backend: [http://localhost:9000](http://localhost:9000)
- Medusa Admin: [http://localhost:9000/app](http://localhost:9000/app)
- Storefront: [http://localhost:3000](http://localhost:3000)
- PostgreSQL host port: `15432` mapped to container port `5432`
- Redis host port: `16379` mapped to container port `6379`

If ports `9000` or `3000` are already in use, choose the next safe available port and update the matching scripts and env values:

- Backend: `apps/backend/.env`, `MEDUSA_BACKEND_URL`, CORS values, and storefront `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- Storefront: `apps/storefront/package.json` dev/start port and backend CORS values

## Environment

Only `.env.example` files are committed. Real `.env` files and `.env.local` files are ignored.

Backend defaults:

```bash
DATABASE_URL=postgres://medusa:medusa@localhost:15432/yournextfit_medusa
REDIS_URL=redis://localhost:16379
EVENTS_REDIS_URL=redis://localhost:16379
WE_REDIS_URL=redis://localhost:16379
```

Storefront defaults:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
```

## Useful Commands

```bash
pnpm backend:db:migrate
pnpm backend:seed
pnpm backend:dev
pnpm storefront:dev
pnpm storefront:build
docker compose config
docker compose up -d
docker compose down
```

## Troubleshooting

### Docker is not running

Start Docker Desktop, then run:

```bash
docker compose up -d
```

### PostgreSQL port 15432 is already in use

Find the process:

```bash
lsof -nP -iTCP:15432 -sTCP:LISTEN
```

Either stop that process or change the host port in `docker-compose.yml` and update `DATABASE_URL` in `apps/backend/.env`.

### Redis port 16379 is already in use

Find the process:

```bash
lsof -nP -iTCP:16379 -sTCP:LISTEN
```

Either stop that process or change the host port in `docker-compose.yml` and update Redis URLs in `apps/backend/.env`.

### Medusa port 9000 is already in use

Find the process:

```bash
lsof -nP -iTCP:9000 -sTCP:LISTEN
```

Use the next safe available port, then update backend URL and CORS values in `apps/backend/.env` and `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in `apps/storefront/.env.local`.

### Next.js port 3000 is already in use

Find the process:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Use the next safe available port, update the storefront dev/start scripts, and add that URL to backend CORS values.

### pnpm install issues

Confirm Node and pnpm versions:

```bash
node --version
pnpm --version
```

Use Node.js 20 or newer. If pnpm is missing, enable Corepack:

```bash
corepack enable
corepack prepare pnpm@11.7.0 --activate
```

### Missing publishable API key after seed

Run the seed again on a fresh local database, or open Medusa Admin at `http://localhost:9000/app` and retrieve the key from Settings > Publishable API keys. Copy it into `apps/storefront/.env.local`.
