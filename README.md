# FlatFinder

A marketplace for rental housing: list your flats, browse what other owners
have published, and message them about it.

This monorepo unifies the project's two original repositories, preserving the
history and authorship of both.

| Origin | Destination |
| --- | --- |
| `FED-104-6/Michael--Rodrigo` (Angular) | `apps/web` |
| `Michos12/FlatFinder-BackEnd` (Express) | `apps/api` |

## Layout

```
apps/
  web/        Angular 20 (SPA)
    src/app/
      core/       API services, guards and interceptors
      features/   auth · flats · users · profile
      shared/     header and flat card
  api/        Express 5 + MongoDB/Mongoose + JWT, in TypeScript
    src/
      config/     validated environment and Mongo connection
      middleware/ auth, validation and error handling
      modules/    users · flats · messages
packages/
  types/      the data contract shared by both apps
```

`packages/types` is what keeps the two halves aligned: the field names for
`Flat`, `User` and `Message` are declared once, and the compiler catches any
drift between them.

## Getting started

```bash
npm install
docker compose up -d                      # MongoDB on localhost:27017
cp apps/api/.env.example apps/api/.env     # fill in SECRET_KEY
npm run dev:api                            # http://localhost:3000
npm run dev:web                            # http://localhost:4200
```

Without Docker, point `MONGO_URL` at a MongoDB Atlas cluster.

## Checks

```bash
npm run typecheck   # API types, tests included
npm test            # API and frontend tests
npm run test:api    # API integration tests only
npm run test:web    # frontend unit tests only
npm run build       # types + api + web
```

All three run on every push and every pull request
(`.github/workflows/ci.yml`).

## Deployment

The frontend is served from Vercel and the API from Render, with the database
on MongoDB Atlas.

**API (Render).** `render.yaml` describes the service; it builds
`apps/api/Dockerfile` from the root of the monorepo. `SECRET_KEY` is generated
for you; `MONGO_URL` is filled in by hand with the Atlas connection string.

**Frontend (Vercel).** `vercel.json` serves the SPA and rewrites `/api/*` to
the API. Keeping a single origin means production needs no CORS at all.

> Before the first deploy, replace the placeholder host in `vercel.json` with
> the real URL of the API service, keeping the `/api/:path*` suffix so the
> path survives the rewrite.

## Status

- [x] Both histories unified into one monorepo
- [x] Frontend production build fixed (SSR removed)
- [x] API migrated to TypeScript, split into modules, authorisation corrected
- [x] Frontend wired to the API; Firestore removed
- [x] Route guards, token interceptor and lazily loaded routes
- [x] API integration tests (28 cases, in-memory MongoDB)
- [x] CI on GitHub Actions and deployment configuration
- [x] Interface design pass
- [x] Frontend tests (63 cases, Vitest on jsdom)
- [ ] Live deployment

## Credits

Originally built by Michael Veliz, Asuka Fukuchi and Rodrigo Ticona.
