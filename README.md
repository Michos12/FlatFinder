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

## Estado

Reestructuracion en curso.

- [x] Historiales unificados en un monorepo
- [x] Build de produccion del frontend arreglado (se retiro el SSR)
- [x] API migrada a TypeScript, por modulos, con la autorizacion corregida
- [ ] Frontend conectado al API: hoy `apps/web` sigue leyendo de Firestore
- [ ] Guards de ruta e interceptor de token en el frontend
- [ ] Tests, CI y despliegue

## Creditos

Proyecto original de Michael Veliz, Asuka Fukuchi y Rodrigo Ticona.
