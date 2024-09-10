FROM node:20-alpine AS base
RUN corepack enable 

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm install -g turbo
RUN turbo prune lottery --docker

FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm --force
RUN pnpm install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo build --filter=lottery...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/game/package.json /app/apps/game/package.json
COPY --from=installer --chown=nextjs:nodejs /app/apps/game/next.config.js /app/apps/game/next.config.js
COPY --from=installer --chown=nextjs:nodejs /app/apps/game/.next /app/apps/game/.next
COPY --from=installer --chown=nextjs:nodejs /app/apps/game/node_modules /app/apps/game/node_modules
COPY --from=installer --chown=nextjs:nodejs /app/apps/game/public /app/apps/game/public
COPY --from=installer --chown=nextjs:nodejs /app/node_modules /app/node_modules

WORKDIR /app/apps/game
EXPOSE 3000

CMD ["npm", "start"]