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

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de configuração do workspace
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copiar package.json do backend
COPY --from=builder /app/apps/back-end/package.json ./apps/back-end/package.json
# Copiar schema do Prisma (necessário para o generate)
COPY --from=builder /app/apps/back-end/prisma ./apps/back-end/prisma

# 1. Instalar TODAS as dependências (incluindo dev para ter o CLI do Prisma)
RUN pnpm install --frozen-lockfile --filter back-end...

# 2. Gerar o Prisma Client
RUN cd apps/back-end && npx prisma generate

# 3. Remover dependências de desenvolvimento (Reinstalar apenas prod)
# Preservar o @prisma/client gerado explicitamente
RUN cp -r node_modules/@prisma/client /tmp/prisma-client && \
    rm -rf node_modules apps/back-end/node_modules && \
    pnpm install --prod --frozen-lockfile --filter back-end... && \
    mkdir -p node_modules/@prisma && \
    cp -r /tmp/prisma-client node_modules/@prisma/client

# Copiar o build (código compilado)
COPY --from=builder /app/apps/back-end/dist ./apps/back-end/dist

EXPOSE 3000

CMD ["node", "apps/back-end/dist/src/main"]