# FlatFinder

Marketplace de alquiler de viviendas: publica tus pisos, consulta los de
otros propietarios y contacta con ellos.

Monorepo que unifica los dos repositorios originales del proyecto,
conservando el historial y la autoria de ambos.

| Origen | Destino |
| --- | --- |
| `FED-104-6/Michael--Rodrigo` (Angular) | `apps/web` |
| `Michos12/FlatFinder-BackEnd` (Express) | `apps/api` |

## Estructura

```
apps/
  web/        Angular 20 (SPA)
  api/        Express 5 + MongoDB/Mongoose + JWT, en TypeScript
packages/
  types/      contrato de datos compartido por las dos apps
```

## Puesta en marcha

```bash
npm install
cp apps/api/.env.example apps/api/.env   # rellena MONGO_URL y SECRET_KEY
npm run build:types
npm run dev:api    # http://localhost:3000
npm run dev:web    # http://localhost:4200
```

## Comprobaciones

```bash
npm run typecheck   # tipos del API, incluidos los tests
npm test            # tests de integracion del API
npm run build       # types + api + web
```

## Estado

Reestructuracion en curso.

- [x] Historiales unificados en un monorepo
- [x] Build de produccion del frontend arreglado (se retiro el SSR)
- [x] API migrada a TypeScript, por modulos, con la autorizacion corregida
- [x] Frontend conectado al API; Firestore eliminado
- [x] Guards de ruta, interceptor de token y rutas diferidas
- [x] Tests de integracion del API (22 casos, MongoDB en memoria)
- [ ] Pasada de diseno de la interfaz
- [ ] CI y despliegue

## Creditos

Proyecto original de Michael Veliz, Asuka Fukuchi y Rodrigo Ticona.
