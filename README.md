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
    src/app/
      core/       servicios de API, guardas e interceptores
      features/   auth · flats · users · profile
      shared/     cabecera y tarjeta de piso
  api/        Express 5 + MongoDB/Mongoose + JWT, en TypeScript
    src/
      config/     entorno validado y conexion a Mongo
      middleware/ auth, validacion y manejo de errores
      modules/    users · flats · messages
packages/
  types/      contrato de datos compartido por las dos apps
```

`packages/types` es la pieza que mantiene alineadas las dos mitades: los
nombres de campo de `Flat`, `User` y `Message` se declaran una sola vez y
el compilador detecta cualquier divergencia.

## Puesta en marcha

```bash
npm install
docker compose up -d                     # MongoDB en localhost:27017
cp apps/api/.env.example apps/api/.env    # rellena SECRET_KEY
npm run dev:api                           # http://localhost:3000
npm run dev:web                           # http://localhost:4200
```

Sin Docker, apunta `MONGO_URL` a un cluster de MongoDB Atlas.

## Comprobaciones

```bash
npm run typecheck   # tipos del API, incluidos los tests
npm test            # tests de integracion del API
npm run build       # types + api + web
```

Las tres se ejecutan en cada push y cada pull request
(`.github/workflows/ci.yml`).

## Despliegue

El frontend se sirve desde Vercel y el API desde Render, con la base de
datos en MongoDB Atlas.

**API (Render).** `render.yaml` describe el servicio; usa
`apps/api/Dockerfile`, construido desde la raiz del monorepo. `SECRET_KEY`
se genera sola; `MONGO_URL` se rellena a mano con la cadena de Atlas.

**Frontend (Vercel).** `vercel.json` sirve la SPA y redirige `/api/*` al
API. Al mantener un solo origen no hace falta CORS en produccion.

> Antes del primer despliegue hay que sustituir en `vercel.json` el
> `flatfinder-api.onrender.com` de ejemplo por la URL real del servicio.

## Estado

- [x] Historiales unificados en un monorepo
- [x] Build de produccion del frontend arreglado (se retiro el SSR)
- [x] API migrada a TypeScript, por modulos, con la autorizacion corregida
- [x] Frontend conectado al API; Firestore eliminado
- [x] Guards de ruta, interceptor de token y rutas diferidas
- [x] Tests de integracion del API (22 casos, MongoDB en memoria)
- [x] CI en GitHub Actions y configuracion de despliegue
- [ ] Pasada de diseno de la interfaz
- [ ] Tests del frontend

## Creditos

Proyecto original de Michael Veliz, Asuka Fukuchi y Rodrigo Ticona.
