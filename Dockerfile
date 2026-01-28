## Multi-stage production Dockerfile for Next.js (npm)
## - Always installs with npm using --legacy-peer-deps (per project requirement)
## - Builds once, runs with next start
## - Runs as a non-root user

# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---- runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
