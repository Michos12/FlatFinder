# @flatfinder/web

Frontend de FlatFinder. Angular 20, standalone, sin zonas y con rutas
diferidas.

## Puesta en marcha

Desde la raiz del monorepo:

```bash
npm run dev:web      # http://localhost:4200
```

Necesita el API en marcha (`npm run dev:api`). La URL se configura en
`src/environments/`: en desarrollo apunta a `http://localhost:3000/api` y
en produccion a `/api`, servido por un redireccionamiento del mismo origen.

## Estructura

```
src/app/
├── core/
│   ├── api/          ApiService y los servicios de dominio
│   ├── guards/       authGuard · adminGuard
│   └── interceptors/ token saliente · manejo de 401
├── features/         auth · flats · users · profile
└── shared/           header · flat-card
```

Cada ruta se carga bajo demanda, asi que el bundle inicial solo contiene
el armazon y lo comun.

## Estilos

`src/styles.css` define los tokens (color, forma, sombra) y un puñado de
clases de uso general: `.page`, `.grid`, `.card`, `.btn`, `.field`,
`.alert`, `.empty-state`. Los componentes solo declaran lo que es suyo y
consumen los tokens; no hay colores sueltos repartidos por los archivos.
