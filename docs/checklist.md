# Checklist

Ordem de trabalho do portfólio. Detalhes e decisões em
[`contexto.md`](contexto.md). Marque a caixa ao concluir e atualize a data.

Atualizado em 24/11/2026.

## Base do repositório

- [x] Padrão do `DESIGN-SYSTEM.md`, fases 0 a 5, na `main`
- [x] SocratiCode indexado
- [x] Higgsfield: MCP na conta do Rodrigo e chave da API no `.env.local`
- [x] Navegador do Orca com perfil próprio do projeto

## Redesenho: definição

- [x] Referências coletadas (12 do Instagram)
- [x] Propostas e exemplos gerados (18 imagens)
- [x] Estrutura de páginas proposta
- [x] Esboço do esqueleto (`docs/estetica/esboco.html`)
- [x] Opção escolhida para 8 seções do início
- [x] Opção da seção de certificados (B, 24/11)
- [x] Paleta: Grafite + vinho (`#121013`, `#8c1730`, `#f2e9dc`, 24/11)
- [x] Tipografia dos números: Anton (24/11)
- [x] Tipografia do texto: Geist e Geist Mono
- [x] Tipografia dos títulos: Geist; Bricolage Grotesque como alternativa (24/11)
- [x] Confirmar o modelo projeto com vários casos (24/11)
- [x] Decidir `/ideias` e `/sobre` separado: os dois existem (24/11)
- [x] Fotos do Rodrigo (6, em 24/11)
- [ ] Aprovar os textos de `docs/textos.md` (rascunho de 24/11)

## Redesenho: construção (tudo de uma vez)

- [x] Tokens novos em `packages/ui` (paleta em OKLCH e fontes, 24/11)
- [x] Tipo Caso em `packages/content` com schema e os primeiros casos (6, 24/11)
- [x] Imagens de referência por seção no Higgsfield (9, em 24/11)
- [x] Retrato de estúdio a partir das fotos (4, em 24/11)
- [x] Retrato aprovado para o repositório público (24/11)
- [x] Daisy e ELOS no conteúdo; datas pelo currículo atualizado (24/11)
- [x] Frase sobre IA no sobre: usa, mas não depende (24/11)
- [ ] Prints e vídeos dos projetos, feitos pelo agente (depois)
- [ ] Mídia final: vídeos e capas (cotar antes)
- [ ] Blocos visuais em `packages/ui`
- [ ] Todas as páginas e seções, no mesmo estilo
  - [x] Início, versão estática das 9 seções (branch `feat/redesenho`, 24/11)
  - [x] `/casos` e `/casos/[caso]` nos três idiomas (24/11)
  - [x] `/sobre`, `/ideias`, `/projetos` e páginas de projeto no visual novo (24/11)
- [x] Movimento do início: GSAP + Lenis, versão leve e sem movimento (24/11)
- [x] Movimento nas outras páginas (24/11)
- [x] Menu no celular, em tela cheia (24/11)
- [x] Redesenho junto na `main` (24/11)
- [ ] Três idiomas revisados
- [ ] Checagem final: `bun run check`, ponta a ponta, desempenho em máquina fraca
- [x] Remover o currículo antigo (seções, cabeçalho e rodapé velhos, React Bits e textos sem uso, 24/11)
- [x] Páginas de erro e cartão de compartilhamento no visual novo (25/11)
- [ ] Reescrever o que ainda está na lista de legado do lint (jogo e scripts)

## Redesenho: rodada interativa (25/11)

- [x] Hero interativo na branch `feat/hero-interativo`
- [x] Favicon "❯RV" (janela de terminal) em todos os formatos
- [x] Fase 6 do padrão: shadcn em `packages/ui` (radix-nova); botões, filtro
      dos certificados e cartões do site trocados pelos do shadcn
- [ ] Botões caseiros do jogo: ficam para o jogo novo (tema CS)
- [x] Rodrigo aprovou o hero (25/11) e ele entrou na `main`
- [x] Levar o mesmo nível de interação para as outras seções (branch
      `feat/secoes-interativas`)
- [x] Números reais com 8 métricas da carreira (27/11)
- [x] Rodrigo aprovou as 8 métricas e a passagem de 3,5 s (27/11)
- [x] Rodrigo aprovou as seções e elas entraram na `main` (27/11)
- [x] Trajetória vertical, alternando os lados, em ordem do git (27/11)
- [ ] Rodrigo revisar os textos dos certificados (o que aprendi em cada um)
- [ ] Rodrigo aprovar a busca da stack nas próprias faixas (giram, param e acendem)
- [ ] Rodrigo escolher a forma do contato (?contato=simples, laser, revelar, orbita
      ou lista) e apagar as outras de `contato-mocks.tsx`
- [ ] Fotos do CS2 Cortex, DB Store, DB Connect e Memoreba para os cartões de
      projeto (o Rodrigo manda as capturas ou autoriza capturar)
- [ ] Rodrigo confirmar se a DB Store foi freela ou já pela DBC, e atualizar o
      currículo com a DBC desde jul/2026

## Publicação

- [ ] Domínio
- [ ] Deploy na Vercel com `NEXT_PUBLIC_SITE_URL`

## Depois do site

- [x] Calendário dos posts do LinkedIn: três por semana, de 30/11 a 27/01
- [ ] Ficha do personagem no Higgsfield e vídeo do post 1 (sai em 30/11)
- [ ] Post 20 reescrito como abertura (sai em 02/12)
- [ ] Revisar os outros posts e gerar os vídeos, uma semana antes de cada data
- [ ] Jogo no tema CS, com modelos próprios
- [ ] Admin no `apps/api`
