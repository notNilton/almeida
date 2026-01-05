FROM node:20-alpine AS builder

WORKDIR /app

# Copiar tudo (Monorepo precisa disso)
COPY . .

# Instalar dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# --- A CORREÇÃO ESTÁ AQUI ---
# Passamos a variável APENAS para este comando. 
# O Prisma vai achar que existe um banco, vai gerar os tipos e ficar feliz.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate

# Buildar o projeto
RUN pnpm build

# Limpar dependências de desenvolvimento para reduzir o tamanho da imagem final
RUN pnpm prune --prod

# --- Stage Final ---
FROM node:20-alpine

WORKDIR /app

# Copiar os arquivos gerados do builder
COPY --from=builder /app/apps/back-end/dist ./dist
# O node_modules agora contém o Prisma Client gerado no passo anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/back-end/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]