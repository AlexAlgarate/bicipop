FROM node:22-alpine AS base

RUN apk add --no-cache openssl
RUN corepack enable pnpm

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
ARG JWT_SECRET

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY}
ENV JWT_SECRET=${JWT_SECRET}

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1536"

RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
