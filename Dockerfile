FROM node:22-alpine AS base

RUN apk add --no-cache openssl
RUN corepack enable pnpm

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1536"

RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
