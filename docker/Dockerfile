# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --production

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs server.js ./
COPY --chown=nodejs:nodejs views ./views
COPY --chown=nodejs:nodejs public ./public
COPY --chown=nodejs:nodejs data ./data

USER nodejs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
