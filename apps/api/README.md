# @flatfinder/api

FlatFinder's REST API. Express 5 + MongoDB (Mongoose) + JWT, in TypeScript.

## Getting started

```bash
cp .env.example .env      # fill in MONGO_URL and SECRET_KEY
npm install               # from the root of the monorepo
npm run dev -w @flatfinder/api
```

## Layout

```
src/
├── config/     environment (validated with Zod) and the Mongo connection
├── lib/        ApiError, asyncHandler, request helpers
├── middleware/ auth, validate, errorHandler
├── modules/    users · flats · messages
│   └── <module>/  model · schema · service · controller · routes
├── app.ts      the Express app, without opening a port (testable)
└── server.ts   startup, database connection and graceful shutdown
```

`app.ts` and `server.ts` are deliberately separate: it lets the integration
tests mount the application without occupying a port.

## Endpoints

Every response uses the same envelope: `{ success, data }` on success and
`{ success, error: { code, message, details? } }` on failure.

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/api/users/register` | public |
| `POST` | `/api/users/login` | public |
| `GET` | `/api/users/me` | authenticated |
| `GET` | `/api/users` | admin |
| `GET` | `/api/users/:id` | the user themselves, or an admin |
| `PATCH` | `/api/users/:id` | the user themselves, or an admin |
| `PATCH` | `/api/users/:id/role` | admin |
| `DELETE` | `/api/users/:id` | the user themselves, or an admin |
| `GET` | `/api/users/me/favorites` | authenticated |
| `PUT` | `/api/users/me/favorites/:flatId` | authenticated |
| `DELETE` | `/api/users/me/favorites/:flatId` | authenticated |
| `GET` | `/api/flats` | authenticated (filters and pagination) |
| `GET` | `/api/flats/mine` | authenticated |
| `POST` | `/api/flats` | authenticated |
| `GET` | `/api/flats/:id` | authenticated |
| `PATCH` | `/api/flats/:id` | owner or admin |
| `DELETE` | `/api/flats/:id` | owner or admin |
| `GET` | `/api/flats/:id/messages` | the owner sees all; everyone else sees their own |
| `POST` | `/api/flats/:id/messages` | authenticated, except the owner |

Authentication travels in `Authorization: Bearer <token>`.

## Security

- Passwords hashed with bcrypt (12 rounds) in a single `pre('save')` hook, and
  excluded from every query by default (`select: false`).
- The role is never accepted from the request body: registration always
  creates a `guest`, and only an admin can change roles.
- Input validated with Zod, on both body and query.
- `helmet`, CORS restricted to the origins in `CORS_ORIGIN`, and rate limiting
  that is much stricter on login and registration.
- Authorisation failures answer 403, and login returns a generic message so
  accounts cannot be enumerated.

## Tests

```bash
npm test -w @flatfinder/api
```

Integration tests against the real app and an in-memory MongoDB, covering
registration, login, permissions by role and by ownership, filters, favourites
and messages. They need no external database.

## History

This directory comes from the `Michos12/FlatFinder-BackEnd` repository, with
the `MichaelBranch` and `asuka` branches unified. The original API was built
by Michael Veliz (users and authentication) and Asuka Fukuchi (flats and
messages).
