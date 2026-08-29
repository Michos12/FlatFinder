# API image. Build it from the root of the monorepo:
#   docker build -f apps/api/Dockerfile -t flatfinder-api .

FROM node:22-alpine AS build
WORKDIR /app

# Manifests first, so the dependency layer is reused while they do not change.
# Filtered by workspace to keep Angular out of a server image, and with scripts
# ignored because packages/types would otherwise try to compile before its
# source has been copied in.
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --ignore-scripts \
      --workspace @flatfinder/api \
      --workspace @flatfinder/types \
      --include-workspace-root

COPY packages/types ./packages/types
COPY apps/api ./apps/api
RUN npm run build -w @flatfinder/types \
 && npm run build -w @flatfinder/api

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --omit=dev --ignore-scripts \
      --workspace @flatfinder/api \
      --workspace @flatfinder/types \
      --include-workspace-root \
 && npm cache clean --force

COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/apps/api/dist ./apps/api/dist

USER node
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
