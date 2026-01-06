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

# --- Stage 2: Prod Deps (Instalar deps de produção separadamente) ---
FROM node:20-alpine AS prod-deps
WORKDIR /app
RUN npm install -g pnpm

# Copiar configs do workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/back-end/package.json ./apps/back-end/package.json
COPY apps/back-end/prisma ./apps/back-end/prisma

# Instalar apenas prod deps
RUN pnpm install --prod --frozen-lockfile --filter back-end...

# Gerar Prisma Client (Outputado na raiz node_modules/.prisma/client conforme schema)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" cd apps/back-end && npx prisma generate

# Limpeza de caches do pnpm para garantir que node_modules esteja limpo de lixo
RUN rm -rf /root/.local/share/pnpm /root/.npm

# --- Stage 3: Runner (Imagem Final Minimalista) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar node_modules da etapa prod-deps (já limpo e com prisma gerado)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/back-end/node_modules ./apps/back-end/node_modules

# Copiar o build compilado do stage builder
COPY --from=builder /app/apps/back-end/dist ./apps/back-end/dist

EXPOSE 3000

CMD ["node", "apps/back-end/dist/src/main"]