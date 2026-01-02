# almeida Roadmap & Critical TODOs

Este documento centraliza as pendências técnicas, melhorias de UX e novas funcionalidades planejadas para o ecossistema almeida.

---

## 🚀 Funcionalidades do Painel (Back-office)

### 📁 Projetos & Conteúdo
- [x] **Relational Uploads:** Integração de imagens e documentos via relations no Prisma.
- [x] **Filtros Avançados:** Filtragem por categoria e status (Rascunho/Publicado).
- [x] **Busca Global:** Busca textual debounced em títulos e descrições.
- [x] **Drafts (Rascunhos):** Sistema de salvamento parcial.
- [x] **Agendamento:** Publicação datada para o futuro.
- [x] **SEO Editor:** Preview visual de meta-tags (Google Preview).
- [ ] **Galeria de Mídia:** Um gerenciador central de arquivos para reutilizar imagens em diferentes projetos.
- [ ] **Versionamento:** Histórico de edições para cada projeto, permitindo "rollback".

### 👥 Equipe & Usuários
- [x] **Gestão de Perfil:** Upload de foto, alteração de senha e bio.
- [x] **RBAC (Níveis de Acesso):**
    - `ADMIN`: Acesso total.
    - `EDITOR`: Gerencia conteúdo mas não altera configurações de sistema.
    - `VIEWER`: Acesso apenas leitura para auditoria.
- [x] **Logs de Auditoria:** Rastreabilidade de quem alterou o quê e quando.

### 📄 Documentos & Transparência
- [x] **Categorias Estáticas:** Implementar enum/tabela para categorias (Atas, Editais, Balanços).
- [ ] **Upload Massivo:** Arrastar vários arquivos simultaneamente (Drag & Drop).
- [ ] **OCR Automático:** Processamento de PDFs para tornar o conteúdo textual buscável.

---

## 🌐 Site Público (Front-end)

- [ ] **Portal de Transparência:** Página dedicada para listagem e filtros de documentos oficiais.
- [ ] **Página de Detalhes:** Renderização de projetos com MDX ou Markdown estilizado.
- [ ] **Filtros de Projetos:** Interface pública para cidadãos filtrarem por categoria (Educação, Saúde, etc).
- [ ] **Otimização de Imagens:** Pipeline para converter uploads em WebP/AVIF dinamicamente.
- [ ] **PWA:** Suporte para instalação no celular e cache offline básico.

---

## 📊 Análise de Dados & Inteligência

- [x] **Dashboard Principal:** Resumo visual de impacto (ex: total de projetos ativos, documentos publicados).
- [ ] **Relatórios PDF/CSV:** Exportação de dados para prestação de contas.
- [x] **Métricas de Engajamento:** Integração com Analytics ou tracker interno de visualizações.

---

## 🔐 Segurança & Privacidade

- [x] **Recuperação de Senha:** Fluxo completo via e-mail com token temporário.
- [x] **Sanitização (XSS):** Implementar `isomorphic-dompurify` no back-end para limpar inputs de Markdown.
- [x] **Rate Limiting:** Proteção contra ataques de força bruta no login e abuse nos uploads.
- [x] **LGPD:** Página de termos de uso e política de privacidade editável.

---

## 🎨 UX & Interface (Refinamentos)

- [x] **Toasts:** Implementação de `sonner` para feedback de ações (sucesso/erro).
- [x] **Modais de Confirmação:** Substituir `confirm()` por um componente React estilizado.
- [x] **Skeleton Loaders:** Para melhorar a percepção de carregamento em todas as listagens.
- [x] **Dark/Light Mode:** Suporte a temas com persistência no LocalStorage.
- [x] **Análise & Inteligência:** Resumo visual do impacto (ex: total de visualizações, projetos por categoria) no Dashboard.
- [x] **Error Pages:** Páginas customizadas para 404 (Não Encontrado) e 500 (Erro Interno).

---

## 🛠️ Engenharia & DevOps

- [ ] **CI/CD Pipeline:** Deploy automático via GitHub Actions para Staging e Produção.
- [ ] **Monitoramento de Saúde:** हेल्थचेक das APIs e alertas via Telegram/Slack em caso de queda.
- [ ] **Cleanup de Media:** Script para deletar arquivos órfãos (sem referência no banco).
- [ ] **Ambiente de Homologação:** Separar totalmente dados de teste de dados reais.
- [ ] **Testes E2E:** Implementar Cypress ou Playwright para fluxos críticos de salvamento.