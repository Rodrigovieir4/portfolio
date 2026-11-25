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
  - [ ] `/sobre`, `/ideias` e páginas de projeto no visual novo
- [x] Movimento do início: GSAP + Lenis, versão leve e sem movimento (24/11)
- [ ] Movimento nas outras páginas (`/casos`, `/sobre`, projetos) ao redesenhá-las
- [ ] Três idiomas revisados
- [ ] Checagem final: `bun run check`, ponta a ponta, desempenho em máquina fraca
- [ ] Remover o currículo antigo e a lista de legado que ele deixar

## Publicação

- [ ] Domínio
- [ ] Deploy na Vercel com `NEXT_PUBLIC_SITE_URL`

## Depois do site

- [ ] Revisar os posts 2 a 20 e gerar os vídeos (ficha do personagem antes)
- [ ] Jogo no tema CS, com modelos próprios
- [ ] Admin no `apps/api`
