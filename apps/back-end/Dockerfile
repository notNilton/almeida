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

# --- DEBUG DE SEGURANÇA ---
# Se o build falhar novamente, verifique no log do Gitea o resultado deste comando
# para saber exatamente onde o Nest colocou a pasta dist
RUN ls -R /app/dist

# Limpar dependências de desenvolvimento
ENV CI=true
RUN pnpm prune --prod

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# --- A CORREÇÃO PRINCIPAL ESTÁ AQUI ---
# Em vez de copiar de /app/apps/back-end/dist (que é errado no monorepo),
# copiamos da raiz de saida do build: /app/dist/apps/back-end
COPY --from=builder /app/dist/apps/back-end ./dist

# Copiar node_modules e package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/back-end/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]