# FlatFinder

A rental housing marketplace where owners publish their flats and prospective
tenants browse listings, save favourites and message the owner directly.

![Angular](https://img.shields.io/badge/Angular-20-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)
![Express](https://img.shields.io/badge/Express-5-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248)
![Tests](https://img.shields.io/badge/tests-91%20passing-success)

**[Live demo](https://flat-finder-api-jlsg-seven.vercel.app)** ·
[API health check](https://flatfinder-api.onrender.com/api/health)

> The API runs on Render's free tier and sleeps after a period of inactivity.
> The first request after that waits roughly a minute for the cold start.

---

## Project Overview

FlatFinder is a full-stack marketplace for rental listings, in the spirit of a
classifieds site narrowed to housing. An authenticated user can publish flats
with photos, price, floor area and availability date; anyone signed in can
filter the catalogue, save listings to a favourites list, and open a
conversation with the owner about a specific flat.

The project is a monorepo holding an Angular single-page application, an
Express REST API, and a package of TypeScript types that both consume. That
shared package is the point: the frontend and the backend were originally two
separate repositories whose data models had drifted apart, and a single
compiled contract is what keeps them from drifting again.

Authorisation carries most of the weight in this domain. A flat can only be
edited or deleted by the account that published it; the owner of a flat sees
every message sent about it, while any other user sees only the messages they
wrote themselves; and administrative screens are restricted by role. All of it
is enforced server-side, with the client's guards acting only as a navigation
convenience.

## Features

- **JWT authentication** — registration and login, with bcrypt-hashed
  passwords excluded from every query by default.
- **Role-based access** — `guest`, `owner` and `admin`; only an administrator
  can list users or change someone's role.
- **Ownership-based authorisation** — a flat is editable and deletable only by
  the account that created it, or by an administrator.
- **Flat listings with filtering, sorting and pagination** — by city, price
  range and floor area.
- **Multiple photos per flat**, shown as a cover on the listing card and as a
  carousel on the detail page.
- **Favourites** — per-user, stored on the server.
- **Messaging per flat** — the owner reads the whole conversation; everyone
  else reads only their own messages, and owners cannot message themselves.
- **Profile management** — editable details, optional password change, and a
  profile picture.
- **Input validation** with Zod on both request bodies and query strings,
  returning per-field errors.
- **Rate limiting**, `helmet` security headers and a CORS allow-list.
- **Lazily loaded routes** with route guards on the client.

## Tech Stack

**Frontend**

| Technology | Version | Notes |
| --- | --- | --- |
| Angular | 20 | Standalone components, zoneless change detection, signals |
| TypeScript | 5.8 | |
| RxJS | 7.8 | |
| CSS | — | Hand-written, built on design tokens in `styles.css` |

**Backend**

| Technology | Version | Notes |
| --- | --- | --- |
| Node.js | ≥ 20 | Declared in `engines` |
| Express | 5 | |
| TypeScript | 5.8 | |
| Mongoose | 8 | |
| Zod | 3 | Request and environment validation |
| jsonwebtoken | 9 | |
| bcryptjs | 3 | 12 salt rounds |
| helmet · cors · express-rate-limit | — | Security middleware |

**Database**

- MongoDB — MongoDB Atlas in production, Docker locally

**Testing**

| Tool | Scope |
| --- | --- |
| `node:test` + supertest + mongodb-memory-server | API integration tests |
| Vitest on jsdom, via `@angular/build:unit-test` | Frontend unit tests |

**Tooling and deployment**

- npm workspaces
- Docker and Docker Compose
- GitHub Actions — type check, tests, production build
- Vercel (frontend), Render (API)

## Architecture / Project Structure

```text
flatfinder/
├── apps/
│   ├── api/                    Express REST API
│   │   ├── src/
│   │   │   ├── config/         Validated environment, Mongo connection
│   │   │   ├── lib/            ApiError, asyncHandler, request helpers
│   │   │   ├── middleware/     auth, validate, errorHandler
│   │   │   ├── modules/        users · flats · messages
│   │   │   ├── app.ts          Express app, no port bound
│   │   │   └── server.ts       Startup and graceful shutdown
│   │   ├── test/               Integration tests
│   │   └── Dockerfile
│   └── web/                    Angular SPA
│       └── src/app/
│           ├── core/           API services, guards, interceptors, avatar
│           ├── features/       auth · flats · users · profile
│           └── shared/         header · flat-card · image-carousel · avatar-picker
├── packages/
│   └── types/                  Data contract shared by both apps
├── .github/workflows/ci.yml
├── docker-compose.yml
├── render.yaml
└── vercel.json
```

Each API module owns its `model`, `schema`, `service`, `controller` and
`routes`, so a feature is one directory rather than five parallel folders.
`app.ts` is deliberately separate from `server.ts`: the Express application is
exported without binding a port, which is what lets the integration tests mount
it with supertest.

On the client, `core/` holds everything cross-cutting — one HTTP wrapper, the
domain services, the route guards and the interceptors — while `features/`
holds the screens and `shared/` the components used by more than one of them.

`packages/types` declares `User`, `Flat`, `Message` and their input types once.
Both applications import from it, so a field renamed on one side fails to
compile on the other.

## Installation

```bash
git clone https://github.com/Michos12/FlatFinder.git
cd FlatFinder
npm install
```

A single install at the root covers both applications and links the shared
types package.

Start MongoDB:

```bash
docker compose up -d
```

Without Docker, point `MONGO_URL` at a MongoDB Atlas cluster instead.

## Environment Variables

The API reads its configuration from `apps/api/.env`. Copy the template and
fill it in:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development`, `test` or `production` |
| `PORT` | Port the API listens on (default `3000`) |
| `MONGO_URL` | MongoDB connection string. **Must end in a database name** — without one the driver silently writes to a database called `test` |
| `SECRET_KEY` | JWT signing secret, at least 32 characters |
| `JWT_EXPIRES_IN` | Token lifetime (default `2h`) |
| `CORS_ORIGIN` | Comma-separated list of allowed origins |

The configuration is validated with Zod at startup, so a missing or malformed
value fails immediately with a readable message rather than on the first
request.

The frontend uses no `.env`. Its API URL lives in
`apps/web/src/environments/`: `http://localhost:3000/api` in development, and
`/api` in production, served through a same-origin rewrite.

## Running the Application

Two processes, from the repository root:

```bash
npm run dev:api    # http://localhost:3000
npm run dev:web    # http://localhost:4200
```

Production build of everything:

```bash
npm run build
```

Other available scripts:

| Command | Description |
| --- | --- |
| `npm run typecheck` | Type-checks the API, tests included |
| `npm test` | Runs both test suites |
| `npm run test:api` | API integration tests only |
| `npm run test:web` | Frontend unit tests only |
| `npm run build:types` | Compiles the shared types package |

## Usage

1. Create an account, or log in. Registration always creates a `guest`; roles
   are assigned server-side and can only be changed by an administrator.
2. Browse the catalogue and narrow it by city, maximum price or minimum floor
   area, sorting by date, price, area or city.
3. Save a listing to your favourites from the card or from its detail page.
4. Publish a flat from **List a flat**, adding up to ten photo URLs; the first
   becomes the cover shown on the listing card.
5. Open a flat you do not own and message its owner. The owner sees every
   conversation about the flat; you see only your own messages.
6. Manage your listings from **My flats**, and your details and profile picture
   from your profile.

## API Documentation

All responses share one envelope: `{ success, data }` on success and
`{ success, error: { code, message, details? } }` on failure. Authentication
travels in `Authorization: Bearer <token>`.

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/health` | Public |
| `POST` | `/api/users/register` | Public |
| `POST` | `/api/users/login` | Public |
| `GET` | `/api/users/me` | Authenticated |
| `GET` | `/api/users` | Admin |
| `GET` | `/api/users/:id` | Self or admin |
| `PATCH` | `/api/users/:id` | Self or admin |
| `PATCH` | `/api/users/:id/role` | Admin |
| `DELETE` | `/api/users/:id` | Self or admin |
| `GET` | `/api/users/me/favorites` | Authenticated |
| `PUT` | `/api/users/me/favorites/:flatId` | Authenticated |
| `DELETE` | `/api/users/me/favorites/:flatId` | Authenticated |
| `GET` | `/api/flats` | Authenticated — filters and pagination |
| `GET` | `/api/flats/mine` | Authenticated |
| `POST` | `/api/flats` | Authenticated |
| `GET` | `/api/flats/:id` | Authenticated |
| `PATCH` | `/api/flats/:id` | Owner or admin |
| `DELETE` | `/api/flats/:id` | Owner or admin |
| `GET` | `/api/flats/:id/messages` | Owner sees all; others see their own |
| `POST` | `/api/flats/:id/messages` | Authenticated, except the flat's owner |

`GET /api/flats` accepts `city`, `minPrice`, `maxPrice`, `minArea`, `maxArea`,
`hasAC`, `sortBy` (`city`, `rentPrice`, `areaSize`, `createdAt`), `order`
(`asc`, `desc`), `page` and `limit`, and answers with
`{ items, total, page, limit }`.

<details>
<summary>Example — publishing a flat</summary>

```http
POST /api/flats
Authorization: Bearer <token>
Content-Type: application/json

{
  "city": "Vancouver",
  "streetName": "Robson St",
  "streetNumber": 1200,
  "areaSize": 48,
  "hasAC": true,
  "yearBuilt": 2012,
  "rentPrice": 2300,
  "dateAvailable": "2027-04-01",
  "description": "Bright one-bedroom a block from the seawall.",
  "imageUrls": ["https://example.com/photo-1.jpg"]
}
```

</details>

## Database

MongoDB through Mongoose. Three collections:

| Entity | Fields |
| --- | --- |
| **User** | `email`, `password`, `firstName`, `lastName`, `birthDate`, `role`, `avatarUrl`, `favoriteFlatIds`, timestamps |
| **Flat** | `city`, `streetName`, `streetNumber`, `areaSize`, `hasAC`, `yearBuilt`, `rentPrice`, `dateAvailable`, `description`, `imageUrls`, `ownerId`, timestamps |
| **Message** | `content`, `flatId`, `senderId`, timestamps |

A flat references its author through `ownerId`; a message references both the
flat and its sender; and a user's favourites are an array of flat identifiers.
Indexes cover the fields the queries actually filter and sort on: `city` and
`rentPrice` on flats, and a compound `flatId + createdAt` on messages.

Mongoose creates the collections on first write, so there is no migration step.
There are no seeders.

## Testing

```bash
npm test          # both suites
npm run test:api  # 28 integration tests
npm run test:web  # 63 unit tests
```

**API — integration tests.** `node:test` with supertest, exercising the real
Express application against an in-memory MongoDB, so no external database is
needed. They cover registration and login, permissions by role and by
ownership, filtering, favourites, messaging, and profile updates.

**Frontend — unit tests.** Vitest on jsdom through Angular's
`@angular/build:unit-test` builder, so the suite needs no browser installed.
`src/test-providers.ts` gives every spec the same wiring as the real
application — zoneless change detection, the router, and `HttpClient` carrying
both interceptors — backed by `HttpTestingController`, so no spec can reach the
network. Covered: `AuthService`, both route guards, both interceptors,
`ApiService`, `FlatCard`, `ImageCarousel`, and the login and profile screens.

Both suites, plus a type check and a production build, run on every push and
pull request through `.github/workflows/ci.yml`.

## Technical Decisions

**A shared types package.** The two halves of this project began as separate
repositories and their models had diverged: the backend stored `stName`,
`stNum`, `size`, `hasAc` and `availDate` while the frontend read `streetName`,
`streetNumber`, `areaSize`, `ac` and `date`. `packages/types` declares the
contract once and the compiler enforces it on both sides.

**Feature modules over layer folders.** The API groups files by feature rather
than by kind, so working on flats means opening one directory instead of
touching five.

**`app.ts` separate from `server.ts`.** The Express app is exported without
binding a port, which is what makes the integration tests possible without
occupying one.

**Authorisation enforced server-side.** Route guards on the client exist to
avoid rendering a screen the user cannot use; every rule is checked again in
the API, which is what actually enforces it.

**Password handling in one place.** Hashing lives in a single `pre('save')`
hook, and the field is `select: false`, so it never leaves the database
accidentally. Services load and save documents rather than using
`findByIdAndUpdate`, which would bypass that hook.

**Calendar dates formatted in UTC.** `dateAvailable` is a calendar date, not an
instant. It is stored at UTC midnight and rendered in UTC, so a user in a
negative offset does not see the previous day.

**URL scheme pinned to http(s).** Zod's `.url()` accepts anything `new URL()`
can parse, including `javascript:` and `data:`. Every URL this API stores ends
up in an `<img src>`, so a shared helper restricts the scheme.

**Zoneless Angular with signals.** Component state is held in signals and the
application runs without Zone.js, with routes loaded lazily so the initial
bundle carries only the shell.

**No SSR.** Server-side rendering was removed: this is a CRUD application
behind a login, where it added no SEO or performance benefit while requiring
platform checks throughout the services.

## Future Improvements

Not implemented; derived from the current state of the codebase.

- **File upload for profile pictures.** Pictures are stored as URLs today. The
  migration path is documented in
  `apps/web/src/app/core/avatar/avatar.service.ts`, and the feature is confined
  to that file and `shared/avatar-picker` so it can be swapped without touching
  the rest of the application.
- **Editing an existing flat.** The API supports `PATCH /api/flats/:id`, but
  the client currently offers only creation and deletion.
- **Linting.** `npm run lint` is wired up, but no workspace defines a `lint`
  script yet and ESLint is not configured.
- **End-to-end tests.** Both existing suites stop below the browser.
- **Message notifications.** Messages are only visible by opening a flat.

## Contributing

```bash
git checkout -b feature/your-feature
npm run typecheck && npm test
git commit -m "Describe the change"
git push origin feature/your-feature
```

Open a pull request from there. CI runs the type check, both test suites and a
production build on every pull request; please keep them green and add tests
alongside behavioural changes.

## Deployment

The frontend is served from Vercel and the API from Render, with the database
on MongoDB Atlas.

**API.** `render.yaml` describes the service, built from `apps/api/Dockerfile`
with the repository root as its build context. `SECRET_KEY` is generated by
Render; `MONGO_URL` is supplied from the dashboard and never stored in the
repository.

**Frontend.** `vercel.json` builds the shared types and then the Angular
application, serves the result statically, and rewrites `/api/*` to the API.
Because both share an origin in production, the browser never makes a
cross-origin request.

## License

The root `package.json` declares the MIT license, but the repository does not
yet contain a `LICENSE` file.

## Authors

Originally built by Michael Veliz, Asuka Fukuchi and Rodrigo Ticona. The
monorepo preserves the commit history and authorship of both original
repositories, which `git shortlog -sne` reflects.
