FROM node:20-alpine AS builder

WORKDIR /app

# MUDANÇA 1: Copiar TUDO antes do install
COPY . .

# Instalar dependências (agora ele vê o apps/back-office/package.json e instala o TypeScript/Vite)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Buildar
RUN pnpm build

# --- Stage Final ---
FROM nginx:alpine

# MUDANÇA 2: Ajuste do caminho do dist no monorepo
# O Vite geralmente gera o build em apps/back-office/dist
COPY --from=builder /app/apps/back-office/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]