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
  web/   Angular 20 (SPA + SSR)
  api/   Express 5 + MongoDB/Mongoose + JWT
```

## Estado

Reestructuracion en curso. El frontend y el backend todavia no estan
conectados entre si: `apps/web` lee de Firestore y `apps/api` sirve una
API REST sobre MongoDB. Unificarlos sobre `apps/api` es el siguiente paso.
