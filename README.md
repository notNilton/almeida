# Almeida Monorepo

Bem-vindo ao repositório do projeto **Almeida**. Este é um monorepo gerenciado com `pnpm` que contém tanto o back-end quanto as interfaces de front-end do sistema.

## 📂 Estrutura do Projeto

O repositório está organizado na pasta `apps/`:

- **apps/back-end**: API do servidor construída com **NestJS** e **Prisma** (PostgreSQL).
- **apps/back-office**: Painel administrativo construído com **Vite + React**.
- **apps/front-end**: Website institucional e interface do usuário (Vite + React).

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 20 ou superior recomendada)
- **pnpm** (gerenciador de pacotes)
  - Instale globalmente: `npm install -g pnpm`
- **PostgreSQL** (Banco de dados)

## 🛠️ Instalação e Configuração

1. **Clone o repositório e instale as dependências:**

   ```bash
   pnpm install
   ```

2. **Configuração de Variáveis de Ambiente:**

   Na raiz do projeto, crie um arquivo `.env` baseado no exemplo:

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` e certifique-se de que a `DATABASE_URL` aponta para uma instância válida do PostgreSQL.

3. **Configuração do Banco de Dados (Prisma):**

   O projeto utiliza Prisma ORM. Você pode executar os comandos do Prisma diretamente da raiz usando os scripts configurados.

   - **Gerar tipagens do Prisma:**

     ```bash
     pnpm prisma:generate
     ```

   - **Rodar migrações (criar tabelas):**

     ```bash
     pnpm prisma:migrate
     ```

   - **Popular o banco com dados iniciais (Seed):**
     ```bash
     pnpm prisma:seed
     ```

## 💻 Rodando a Aplicação

### Modo de Desenvolvimento

Para rodar **todas** as aplicações simultaneamente:

```bash
pnpm dev
```

Isso iniciará:

- **API (Back-end):** http://localhost:3000
- **Back-office:** http://localhost:5173 (porta padrão do Vite)

### Rodando serviços individualmente

Se preferir rodar apenas uma parte do sistema:

- **Apenas Back-end:**
  ```bash
  pnpm dev:back-end
  ```
- **Apenas Back-office:**
  ```bash
  pnpm dev:back-office
  ```
- **Apenas Front-end:**
  ```bash
  pnpm dev:front-end
  ```

## 🧰 Comandos Úteis

Os seguintes comandos podem ser executados na raiz do projeto:

| Comando              | Descrição                                                                   |
| :------------------- | :-------------------------------------------------------------------------- |
| `pnpm build`         | Compila todos os projetos para produção.                                    |
| `pnpm lint`          | Executa a verificação de lint (ESLint) em todos os projetos.                |
| `pnpm prisma:studio` | Abre o Prisma Studio para visualizar e editar dados do banco via navegador. |
| `pnpm prisma:reset`  | Reseta o banco de dados (apaga tudo) e roda as migrações novamente.         |

## 🐳 Docker (Produção)

O arquivo `docker-compose.yml` na raiz está configurado para ambientes de produção. Ele espera:

1. Imagens Docker já construídas e hospedadas no registry configurado.
2. Uma rede externa chamada `nilbyte-prod`.
3. Variáveis de ambiente configuradas corretamente.

Para desenvolvimento local com Docker, recomenda-se criar um `docker-compose.override.yml` ou rodar apenas o banco de dados via Docker se não quiser instalar o PostgreSQL localmente.
