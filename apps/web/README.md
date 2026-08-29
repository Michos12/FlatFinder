# @flatfinder/web

FlatFinder's frontend. Angular 20, standalone, zoneless, with lazily loaded
routes.

## Getting started

From the root of the monorepo:

```bash
npm run dev:web      # http://localhost:4200
```

It needs the API running (`npm run dev:api`). The URL is configured in
`src/environments/`: in development it points at `http://localhost:3000/api`,
and in production at `/api`, served by a same-origin rewrite.

## Layout

```
src/app/
├── core/
│   ├── api/          ApiService and the domain services
│   ├── guards/       authGuard · adminGuard
│   └── interceptors/ outgoing token · 401 handling
├── features/         auth · flats · users · profile
└── shared/           header · flat-card
```

Every route is loaded on demand, so the initial bundle carries only the shell
and what is common to all of it.

## Tests

```bash
npm run test:web      # from the root of the monorepo
```

Vitest on jsdom, through Angular's `@angular/build:unit-test` builder, so the
suite needs no browser installed — locally or in CI. Karma was dropped: it is
deprecated in Angular 20 and would have meant depending on a Chrome binary.

`src/test-providers.ts` gives every spec the same wiring as the real
application (zoneless change detection, the router, and HttpClient with both
interceptors) backed by `HttpTestingController`, so nothing can reach the
network. `src/test-setup.ts` installs an in-memory `localStorage`, which Node
does not expose by default.

Covered: AuthService, both route guards, both interceptors, ApiService,
FlatCard, ImageCarousel, the login screen and the profile screen.

## Styling

`src/styles.css` defines the design tokens (colour, shape, shadow) and a small
set of general-purpose classes: `.page`, `.grid`, `.card`, `.btn`, `.field`,
`.alert`, `.empty-state`. Components declare only what belongs to them and
consume the tokens; there are no loose colours scattered across the files.

The palette is a warm marketplace one, built so the photograph of the flat
leads and colour is reserved for guiding action.
