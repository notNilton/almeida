FROM node:20-alpine AS builder

WORKDIR /app

# Copiar tudo
COPY . .

# Instalar dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Gerar Prisma Client (com variável dummy para não quebrar)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate

# Buildar o projeto
RUN pnpm build

# Limpar dependências de desenvolvimento
ENV CI=true
RUN pnpm prune --prod

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# Copiar estrutura do monorepo para preservar symlinks do pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiar artefatos do Backend mantendo a estrutura original
COPY --from=builder /app/apps/back-end/node_modules ./apps/back-end/node_modules
COPY --from=builder /app/apps/back-end/package.json ./apps/back-end/package.json
COPY --from=builder /app/apps/back-end/dist ./apps/back-end/dist

EXPOSE 3000

CMD ["node", "apps/back-end/dist/src/main"]