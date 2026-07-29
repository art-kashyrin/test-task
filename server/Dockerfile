# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN corepack enable && pnpm install --frozen-lockfile --filter @app/server

COPY tsconfig.base.json ./
COPY server ./server
RUN pnpm --filter @app/server build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN corepack enable && pnpm install --frozen-lockfile --filter @app/server --prod

COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server
EXPOSE 3000
CMD ["node", "dist/main.js"]
