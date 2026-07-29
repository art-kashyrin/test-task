# CLAUDE.md

Registered-users-per-city dashboard. pnpm-workspace monorepo: NestJS + TypeORM + PostgreSQL API, React SPA, Docker Compose.

## Commands

### Run the whole thing

```bash
docker compose up          # postgres -> migrate -> api -> client, no .env needed
```

App at <http://localhost:8080>, Swagger UI at <http://localhost:8080/api/docs>.

### Quality gates — both must exit 0 before any change is done

```bash
pnpm lint                  # eslint . --max-warnings=0
pnpm typecheck             # tsc --noEmit across both packages
```

### Contract

```bash
pnpm generate:api          # emit server/openapi.json, then regenerate client/src/api/schema.d.ts
pnpm check:api             # regenerate + `git diff --exit-code` — fails if the committed contract is stale
```

Run `pnpm check:api` after **any** controller or DTO change. Nothing enforces this — there is no CI.

### Local development (outside Docker)

```bash
docker compose up -d postgres
pnpm --filter @app/server migration:run
pnpm --filter @app/server start:dev     # http://localhost:3000/api
pnpm --filter @app/client dev           # http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:3000`. Under Compose there is no dev server — nginx serves the built bundle and proxies `/api` to the `api` container, so both modes are same-origin and neither needs CORS.

### Other

```bash
pnpm format                             # prettier --write .
pnpm --filter @app/server migration:revert
git clean -xdf -e .omc                  # NEVER omit -e .omc — see below
```

## Architecture

```
client (nginx :8080) ──/api/*──> api (nest :3000) ──> postgres
                                      ^
                                      └── migrate (one-shot, runs then exits)
```

Compose ordering is enforced, not assumed: `api` waits on `postgres: service_healthy` (a `pg_isready` healthcheck) **and** `migrate: service_completed_successfully`. The API cannot start before migrations and the city seed have finished.

### Server (`server/src`)

| Path                          | Role                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `bootstrap.ts`                | `configureApp()` — global `/api` prefix + `ValidationPipe`. Called by both `main.ts` and the OpenAPI emitter. |
| `openapi/document.ts`         | Builds the Swagger document. Single source for the served doc and the emitted file.                           |
| `openapi/generate-openapi.ts` | Writes `server/openapi.json` without listening on a port or touching the database.                            |
| `openapi/codegen-env.ts`      | Side-effect module that seeds dummy env for codegen.                                                          |
| `config/env.ts`               | Eager typed env reader. Throws on a missing required variable.                                                |
| `database/`                   | Data source, migrations, `seeds/us-cities.ts` (the frozen 100-city list).                                     |
| `auth/`, `cities/`, `users/`  | Feature modules.                                                                                              |

Auth is **opt-in**: there is no global guard. Routes are public by default, and protection is applied per controller with `@UseGuards(JwtAuthGuard)`. Only `UsersController` is guarded; `auth` and `cities` are public.

### Client (`client/src`)

`api/` (generated + wrapper) · `components/` · `hooks/` · `pages/` · `shared/`. Filenames are **kebab-case**.

React Router v7 data mode (`createBrowserRouter` + `RouterProvider`) with **no loaders** — all fetching is TanStack Query. Route tree:

- `AuthLayout` (centered form, **no header**) → `/login`, `/register`
- `RequireAuth` → `AppLayout` (**header + Logout**) → `/users`

The data layer is [`openapi-react-query`](https://openapi-ts.dev/openapi-react-query/) over `openapi-fetch`. `api/client.ts` builds the fetch client (auth + 401 middleware) and exports `$api`; hooks are thin wrappers:

```ts
export function useCityStats(limit: number, offset: number, enabled: boolean) {
  return $api.useQuery('get', '/users', { params: { query: { limit, offset } } }, { enabled })
}
```

Method and path are checked against the generated `paths`, and `data`/`error` are inferred from the schema — so hooks and components never index `components['schemas'][...]` directly. Where a domain type is needed, derive it from the hook:

```ts
export type CityStatsPage = NonNullable<ReturnType<typeof useCityStats>['data']>
export type CityStat = CityStatsPage['items'][number]
```

`openapi-react-query`'s `queryFn` throws the parsed error body on a non-2xx, so there is no `ApiError` wrapper and no response-unwrapping helper. Handle errors through the typed `onError` callback, where `error` is the declared error schema:

```ts
registerMutation.mutate(
  { body },
  {
    onError: (error) => {
      if (error.statusCode === 409) setError('name', { message: error.message })
    },
  },
)
```

An endpoint only gets a useful error type if the controller declares it — `@ApiResponse({ status: 401, type: ErrorResponseDto })`. Undeclared means `error` is `never`.

`isApiErrorBody()` in `api/client.ts` exists for the one place the error arrives untyped: the global `retry` predicate in `query-client.ts`, where TanStack Query hands back `Error`.

Every API call goes through `api/client.ts`. No component, page, or hook may contain a URL literal or a hand-written `fetch`.

## Conventions

### No comments — the code documents itself

Source files contain **no comments**. Express intent through names, types, and structure instead. If a line seems to need a comment, that is a signal to rename something, extract a function, or make the type stricter.

The only exceptions are compiler directives, which are semantics rather than prose: `/// <reference types="..." />`, `@ts-expect-error`.

Rationale and history belong here in CLAUDE.md, in `README.md`, or in `.omc/` — not in the source.

### Other conventions

- `// eslint-disable` is **banned**. Resolve a lint conflict by: a named rule option in `eslint.config.mjs` → a different code shape → narrowing a preset. In that order.
- `pnpm lint` and `pnpm typecheck` must exit 0 with zero warnings. `--max-warnings=0` is deliberate: `react-hooks/exhaustive-deps` ships at `warn`, and without the flag ESLint would exit 0 while warnings existed.
- Generated files are committed and never hand-edited: `server/openapi.json`, `client/src/api/schema.d.ts`.

## Invariants that are easy to break

These are load-bearing and not obvious from reading the code. Breaking one usually produces a **silent** failure — a green typecheck and a wrong runtime result.

**`import './codegen-env'` must remain the first import in `generate-openapi.ts`.**
Static imports evaluate before any statement in the module body, and importing `AppModule` reaches `config/env.ts`, which throws on a missing `JWT_SECRET`. The side-effect import seeds the environment first. An IDE "Organize Imports" will happily reorder it and break `pnpm generate:api` on any machine without a `.env`.

**The Refresh button must be the only thing that mutates the `city-stats` cache entry.**
`shared/query-client.ts` disables `refetchOnWindowFocus`, `refetchOnMount` and `refetchOnReconnect`, and sets `staleTime: Infinity`. Re-enable any of them and the "no changes to update" behaviour inverts: returning to the tab refetches, so the grid is already current by the time the user clicks, and the app reports "no changes" precisely when data _did_ change.

**In `users-page.tsx`, capture `query.data` before refetching.**
`const before = query.data` must be read _before_ `await query.refetch()` — it is the page currently rendered, and refetch replaces it. The comparison is gated on `result.isSuccess`; without that, a failed refetch returns stale data and the app reports "no changes to update" on a network error.

This used to go through `queryClient.getQueryData(cityStatsKey(...))`, which required the page and the hook to share an exported key factory — re-declaring the key inline silently returned `undefined` and the message never appeared. Reading `query.data` removes the key from the picture entirely, so that failure mode no longer exists. Do not reintroduce a hand-rolled key; if you ever need the cache entry directly, use `$api.queryOptions('get', '/users', init).queryKey`.

**The users table renders from `data` regardless of `isFetching`.**
A refetch-driven skeleton would visually replace the grid even when the payload is unchanged, violating "leaves the grid as-is".

**`auth-storage.ts` exposes `getToken()`, not a captured value.**
The request middleware calls `getToken()` per request. A value captured once at import sends an empty bearer token after login until a full page reload.

**`GET /users` returns only cities that have at least one user — this is deliberate.**
`users.service.ts` uses an **inner** join, and `total` counts distinct cities appearing in `users`, not all seeded cities. A fresh database therefore yields an empty grid with `total: 0`, and the 100 seeded cities are a vocabulary for the register form, not rows in the table. The original spec (`.omc/specs/`) called for a LEFT JOIN with zero-count rows; that was reversed later by the user. Switching the join back also requires changing `total`, or pagination will advertise pages of nothing.

**`ORDER BY name, state` — never by count.**
Counts change as users register; alphabetical order does not. Count-ordering makes pages unstable and moves the row a user is watching off the page.

**`@ApiProperty` / `@ApiBody` / `@ApiQuery` must state `type` explicitly.**
`tsx`/esbuild does not emit `emitDecoratorMetadata`, so reflection-derived types are missing when the emitter runs, producing an `openapi.json` that silently lacks `requestBody` and `parameters` while the `tsc`-built server has them. `pnpm check:api` catches the divergence.

**Route protection is opt-in, so a new endpoint is public until you guard it.**
There is no global `APP_GUARD`. Adding a controller that serves user data without `@UseGuards(JwtAuthGuard)` exposes it, and nothing fails — no test, no lint rule, no type error. This is a deliberate trade: with four endpoints, one `@UseGuards` beats three `@Public()` decorators. It stops being the right trade once protected routes outnumber public ones; at that point invert it back to a global guard with a `@Public()` opt-out.

**`git clean -xdf` requires `-e .omc`.**
`.omc/` holds the spec and plan and is untracked. A bare `git clean -xdf` deletes them.
