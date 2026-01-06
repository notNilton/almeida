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

# Instalar apenas prod deps usando node-linker=hoisted para garantir node_modules "flat" e copiável (sem symlinks quebrados)
RUN pnpm install --prod --frozen-lockfile --filter back-end... --config.node-linker=hoisted

# Gerar Prisma Client (Outputado na raiz node_modules/.prisma/client conforme schema)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" cd apps/back-end && npx prisma generate

# Baixar e rodar node-prune APÓS o generate (para não apagar arquivos necessários para a geração)
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Remover CLI do Prisma e engines desnecessárias para economizar espaço
RUN rm -rf apps/back-end/node_modules/prisma && \
    rm -rf node_modules/prisma && \
    find . -name "*.node" -not -name "*musl*" -delete

# --- Stage 3: Runner (Imagem Final Minimalista) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar node_modules da etapa prod-deps (agora com arquivos reais)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/back-end/node_modules ./apps/back-end/node_modules

# Copiar o build compilado do stage builder
COPY --from=builder /app/apps/back-end/dist ./apps/back-end/dist

EXPOSE 3000

CMD ["node", "apps/back-end/dist/src/main"]