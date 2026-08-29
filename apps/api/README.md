# @flatfinder/api

API REST de FlatFinder. Express 5 + MongoDB (Mongoose) + JWT, en TypeScript.

## Puesta en marcha

```bash
cp .env.example .env      # y rellena MONGO_URL y SECRET_KEY
npm install               # desde la raiz del monorepo
npm run dev -w @flatfinder/api
```

## Estructura

```
src/
├── config/     env (validada con Zod) y conexion a Mongo
├── lib/        ApiError, asyncHandler, helpers de request
├── middleware/ auth, validate, errorHandler
├── modules/    users · flats · messages
│   └── <modulo>/  model · schema · service · controller · routes
├── app.ts      la app de Express, sin abrir puerto (testeable)
└── server.ts   arranque, conexion a BD y cierre ordenado
```

`app.ts` y `server.ts` estan separados a proposito: permite montar la
aplicacion en tests de integracion sin ocupar un puerto.

## Endpoints

Todas las respuestas siguen el mismo envoltorio: `{ success, data }` en
exito y `{ success, error: { code, message, details? } }` en error.

| Metodo | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/users/register` | publico |
| `POST` | `/api/users/login` | publico |
| `GET` | `/api/users/me` | autenticado |
| `GET` | `/api/users` | admin |
| `GET` | `/api/users/:id` | el propio usuario o admin |
| `PATCH` | `/api/users/:id` | el propio usuario o admin |
| `PATCH` | `/api/users/:id/role` | admin |
| `DELETE` | `/api/users/:id` | el propio usuario o admin |
| `GET` | `/api/users/me/favorites` | autenticado |
| `PUT` | `/api/users/me/favorites/:flatId` | autenticado |
| `DELETE` | `/api/users/me/favorites/:flatId` | autenticado |
| `GET` | `/api/flats` | autenticado (filtros y paginacion) |
| `GET` | `/api/flats/mine` | autenticado |
| `POST` | `/api/flats` | autenticado |
| `GET` | `/api/flats/:id` | autenticado |
| `PATCH` | `/api/flats/:id` | propietario o admin |
| `DELETE` | `/api/flats/:id` | propietario o admin |
| `GET` | `/api/flats/:id/messages` | el propietario ve todos; el resto, los suyos |
| `POST` | `/api/flats/:id/messages` | autenticado, salvo el propietario |

La autenticacion viaja en `Authorization: Bearer <token>`.

## Seguridad

- Contrasenas con bcrypt (12 rondas), hasheadas en un unico hook `pre('save')`
  y excluidas por defecto de toda consulta (`select: false`).
- El rol nunca se acepta desde el cuerpo de la peticion: el registro siempre
  crea un `guest` y solo un admin puede cambiar roles.
- Validacion de entrada con Zod en cuerpo y query.
- `helmet`, CORS restringido a los origenes de `CORS_ORIGIN`, y limitacion de
  peticiones (mas estricta en login y registro).
- Los errores de autorizacion devuelven 403, y el login da un mensaje generico
  para no permitir enumerar cuentas.

## Tests

```bash
npm test -w @flatfinder/api
```

Tests de integracion sobre la app real y una MongoDB en memoria: cubren
registro, login, permisos por rol y propiedad, filtros, favoritos y
mensajes. No necesitan ninguna base de datos externa.

## Historial

Este directorio proviene del repositorio `Michos12/FlatFinder-BackEnd`, con
las ramas `MichaelBranch` y `asuka` unificadas. El API original la
construimos Michael Veliz (usuarios y autenticacion) y Asuka Fukuchi (pisos
y mensajes).
