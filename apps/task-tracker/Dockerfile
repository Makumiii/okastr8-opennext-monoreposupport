FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY . .
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app ./
RUN if [ ! -f apps/task-tracker/open-next.config.mjs ] && [ ! -f apps/task-tracker/open-next.config.ts ]; then printf '%s\n' 'import nodeWrapper from "@opennextjs/aws/overrides/wrappers/node.js";' 'import nodeConverter from "@opennextjs/aws/overrides/converters/node.js";' 'import dummyQueue from "@opennextjs/aws/overrides/queue/dummy.js";' 'import dummyIncrementalCache from "@opennextjs/aws/overrides/incrementalCache/dummy.js";' 'import dummyTagCache from "@opennextjs/aws/overrides/tagCache/dummy.js";' 'import dummyImageLoader from "@opennextjs/aws/overrides/imageLoader/dummy.js";' '' 'const config = {' '  default: {' '    override: {' '      wrapper: async () => nodeWrapper,' '      converter: async () => nodeConverter,' '      queue: async () => dummyQueue,' '      incrementalCache: async () => dummyIncrementalCache,' '      tagCache: async () => dummyTagCache' '    }' '  },' '  imageOptimization: {' '    override: {' '      imageLoader: async () => dummyImageLoader' '    }' '  }' '};' '' 'export default config;' > apps/task-tracker/open-next.config.ts; fi
RUN cd apps/task-tracker && npx open-next build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3101
ENV SQLITE_PATH=/data/task-tracker.db
RUN apk add --no-cache wget
COPY --from=builder /app ./
EXPOSE 3101
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --spider -q http://127.0.0.1:3101/ || exit 1
CMD ["sh", "-c", "cd apps/task-tracker/.open-next/server-functions/default && node index.mjs"]
