# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN corepack enable && pnpm install --frozen-lockfile --filter @app/client

COPY tsconfig.base.json ./
COPY client ./client
RUN pnpm --filter @app/client build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
