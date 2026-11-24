# Portfólio — Rodrigo Vieira de Sousa

Monorepo Turborepo com Bun: `apps/web` (Next.js, site e jogo), `apps/api`
(Elysia, onde o admin vai morar) e pacotes em `packages/*`. O conteúdo
profissional vive em `packages/content` e é a única coisa que se edita para
atualizar o currículo.

## Padrão do projeto

Siga o `DESIGN-SYSTEM.md` da raiz: stack, tokens, componentes e checklist.
As exceções deste projeto estão na seção 11 dele.
Antes de concluir uma tarefa, rode `bun run check`.
Use o SocratiCode para localizar código e medir impacto (seção 9.3).

## Contexto e checklist

Antes de qualquer tarefa, leia `docs/contexto.md` (decisões, preferências do
Rodrigo e estado do trabalho) e `docs/checklist.md` (ordem do que falta). Ao
fechar uma etapa ou tomar uma decisão com ele, atualize os dois no mesmo
commit. É o que permite retomar em outra conta sem perder o fio.

## Regras próprias

- Escreva em português do Brasil: código, comentários, commits e docs.
- O site tem dois modos que convivem: o currículo na raiz de cada idioma e o
  jogo. O currículo é a porta de entrada e precisa abrir em qualquer máquina.
- Todo recurso novo do jogo cabe no orçamento de desempenho do README e tem
  caminho de degradação para máquina fraca.
- Todo texto visível tem `pt`, `en` e `es`.

## Higgsfield

- Use só o servidor MCP `higgsfield`, registrado no escopo local desta pasta
  e autenticado por OAuth na conta do Rodrigo. Para refazer numa máquina nova,
  num terminal interativo:

  ```bash
  claude mcp add --transport http --scope local higgsfield https://mcp.higgsfield.ai/mcp
  claude mcp login higgsfield
  ```

  O conector
  "claude.ai Videos" da conta Claude é de outra pessoa e fica bloqueado em
  `.claude/settings.json`.

- Toda geração gasta créditos. Cotar antes e pedir aprovação do Rodrigo.
- Scripts usam a API REST com `HF_API_KEY` e `HF_API_SECRET`, lidas do
  `.env.local`. Só no servidor; nunca com prefixo `NEXT_PUBLIC_`.

## Navegador

Use o navegador embutido do Orca (`orca tab ...`, skill `orca-cli`). Este
repositório abre as abas no perfil isolado "Portfólio (Rodrigo)", onde ficam os
logins da conta do Rodrigo, separados do perfil padrão. Login e senha quem
digita é ele; o agente só usa a sessão já aberta.

## Deploy

- Hospedagem: Vercel, configurada em `vercel.json`.
- Variáveis: `NEXT_PUBLIC_SITE_URL` (obrigatória em produção). As chaves ficam
  em `.env.example`; os valores, só no painel da Vercel.
- Voltar atrás: no painel da Vercel, promover o deploy anterior.
