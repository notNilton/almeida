FROM node:20-alpine AS builder

WORKDIR /app

# MUDANÇA 1: Copiar TUDO antes do install para o pnpm ver os workspaces (apps/)
COPY . .

# Instalar dependências (agora ele vê o apps/back-end/package.json e instala o Nest CLI)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Buildar
RUN pnpm build

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# MUDANÇA 2: Em monorepo, o dist geralmente fica dentro da pasta do app
# Ajustei para pegar de /app/apps/back-end/dist
COPY --from=builder /app/apps/back-end/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/back-end/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]