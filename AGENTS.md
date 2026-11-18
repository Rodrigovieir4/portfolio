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

## Regras próprias

- Escreva em português do Brasil: código, comentários, commits e docs.
- O site tem dois modos que convivem: o currículo na raiz de cada idioma e o
  jogo. O currículo é a porta de entrada e precisa abrir em qualquer máquina.
- Todo recurso novo do jogo cabe no orçamento de desempenho do README e tem
  caminho de degradação para máquina fraca.
- Todo texto visível tem `pt`, `en` e `es`.

## Higgsfield

- Use só o servidor `higgsfield` do `.mcp.json`. Ele entra por OAuth na
  conta do Rodrigo. O conector "claude.ai Videos" da conta Claude é de outra
  pessoa e fica bloqueado em `.claude/settings.json`.
- Toda geração gasta créditos. Cotar antes e pedir aprovação do Rodrigo.
- Scripts usam a API REST com `HF_API_KEY` e `HF_API_SECRET`, lidas do
  `.env.local`. Só no servidor; nunca com prefixo `NEXT_PUBLIC_`.

## Deploy

- Hospedagem: Vercel, configurada em `vercel.json`.
- Variáveis: `NEXT_PUBLIC_SITE_URL` (obrigatória em produção). As chaves ficam
  em `.env.example`; os valores, só no painel da Vercel.
- Voltar atrás: no painel da Vercel, promover o deploy anterior.
