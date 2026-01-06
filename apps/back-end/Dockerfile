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

# DEBUG: Encontrar onde foi parar o main.js
RUN find /app -name "main.js"

# Limpar dependências de desenvolvimento
ENV CI=true
RUN pnpm prune --prod

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# Copiar os arquivos gerados do builder
# Correção: O build do NestJS gera em apps/back-end/dist (não dist/apps/back-end)
COPY --from=builder /app/apps/back-end/dist ./dist

# Copiar node_modules e package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/back-end/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]