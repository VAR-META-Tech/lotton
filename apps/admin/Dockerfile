FROM node:20-alpine AS base
RUN corepack enable 

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm install -g turbo
RUN turbo prune admin-lottery --docker

FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm --force
RUN pnpm install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo build --filter=admin-lottery...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/package.json /app/apps/admin/package.json
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/next.config.mjs /app/apps/admin/next.config.mjs
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next /app/apps/admin/.next
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/node_modules /app/apps/admin/node_modules
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/public /app/apps/admin/public
COPY --from=installer --chown=nextjs:nodejs /app/node_modules /app/node_modules

WORKDIR /app/apps/admin
EXPOSE 3000

CMD ["npm", "start"]