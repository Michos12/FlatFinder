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

## Styling

`src/styles.css` defines the design tokens (colour, shape, shadow) and a small
set of general-purpose classes: `.page`, `.grid`, `.card`, `.btn`, `.field`,
`.alert`, `.empty-state`. Components declare only what belongs to them and
consume the tokens; there are no loose colours scattered across the files.

The palette is a warm marketplace one, built so the photograph of the flat
leads and colour is reserved for guiding action.
