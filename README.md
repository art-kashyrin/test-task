# users-by-city

A pnpm workspace with two packages — `@app/server` (NestJS + TypeORM + Postgres) and
`@app/client` (React + Vite + TanStack Query) — implementing registration/login and a
paginated "users per city" aggregate behind a JWT-guarded API.

## Quickstart

```bash
docker compose up
```

Then open **http://localhost:8080**. No `.env` file and no manual steps are required on a
clean checkout: Postgres starts, a one-shot `migrate` service applies the schema and the
100-city seed, the API waits for both, and the client (nginx, proxying `/api` to the API
internally) waits for the API. Add `--build` to force an image rebuild.

To reset to a clean state (drops the Postgres volume):

```bash
docker compose down -v
```

## Local (non-Docker) development

```bash
pnpm install
pnpm --filter @app/server start:dev   # API on http://localhost:3000/api (needs Postgres — see docker-compose.yml)
pnpm --filter @app/client dev         # client on http://localhost:5173
```

**Vite dev-proxy limitation.** `client/vite.config.ts` proxies `/api` to
`http://localhost:3000`. The composed stack does **not** publish the API's port to the
host (it is reachable only over the Compose network, via the client's nginx `/api`
proxy — see `client/nginx.conf`), so `vite dev`'s proxy only works against a
locally-run `pnpm --filter @app/server start:dev`, never against `docker compose up`'s
`api` service. This is intentional: the API is not meant to be a public surface.

## Environment variables and the declared credential exception

`.env.example` documents every variable consumed by `server/src/config/env.ts` and by
`docker-compose.yml`. Copy it to `.env` to override any default; a clean checkout does
not need one.

**Application source has no credential defaults.** `server/src/config/env.ts` throws
`Missing required environment variable: <NAME>` at startup if `DATABASE_USER`,
`DATABASE_PASSWORD`, `DATABASE_NAME`, or `JWT_SECRET` is unset or empty. Verify:

```bash
docker compose run --rm --no-deps -e JWT_SECRET="" api node dist/main.js
# exits non-zero: "Missing required environment variable: JWT_SECRET"
```

**`docker-compose.yml` is a deployment descriptor, not application source, and it does
contain three literal dev-only credential values**, declared here as a deliberate,
enumerated exception rather than something a reviewer should have to discover:

- `app` (the dev Postgres user)
- `app_dev_password` (the dev Postgres/DB password)
- `dev-only-insecure-secret-change-me` (the dev JWT signing secret)

This exists solely so `docker compose up` can satisfy "no manual steps on a clean
checkout" without shipping a real secret in source. All three are `${VAR:-default}`
substitutions — any real deployment overrides them via `.env` or the host environment.
The DB and JWT defaults are defined once, in the `x-app-env` anchor at the top of
`docker-compose.yml`, and reused by both `migrate` and `api` via `<<: *app-env`, so each
value appears exactly once in that anchor plus once more in `postgres`'s own
`POSTGRES_PASSWORD` default.

`.env.example` additionally documents `app_dev_password` twice, as the example value for
`POSTGRES_PASSWORD` and `DATABASE_PASSWORD` — the same dev default, spelled out for local
override convenience. It is not itself scanned by the check below (see "why" in the check
itself).

Two checks together prove the exception is exactly as large as declared and no larger:

```bash
# (i) positive control: the deployment descriptor contains exactly the declared defaults
grep -nE "app_dev_password|dev-only-insecure-secret-change-me" docker-compose.yml
# -> exactly 3 hits, all in docker-compose.yml

# (ii) leak scan: application source contains no hardcoded secret/password/token
grep -rniE "(secret|password|passwd|token)[[:space:]]*[:=][[:space:]]*['\"][^'\"]{6,}['\"]" server/src client/src
# -> zero hits
```

## Contract freshness

`server/openapi.json` and `client/src/api/schema.d.ts` are **committed, generated
artifacts**, not built at runtime — this is what lets `docker compose up` boot the client
image without the API or a database.

**`pnpm check:api` is required after any controller or DTO change**, and there is no CI
to enforce it (CI is a stated non-goal of this project). It regenerates both artifacts
and fails (`git diff --exit-code`) if the committed files would change:

```bash
pnpm check:api
```

Treat a failing `check:api` as a merge blocker in review, since nothing else catches
drift between the served and the committed OpenAPI contract.
