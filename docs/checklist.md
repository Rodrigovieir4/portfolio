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
- [ ] Tipografia: título e texto
- [ ] Confirmar o modelo projeto com vários casos
- [ ] Decidir `/ideias` e `/sobre` separado
- [ ] Fotos do Rodrigo (3 a 5)
- [ ] Texto da abertura (cargo, senioridade, o que busca)

## Redesenho: construção (tudo de uma vez)

- [ ] Tokens novos em `packages/ui` (paleta em OKLCH, fontes, raio, espaçamento)
- [ ] Tipo Caso em `packages/content` com schema e os primeiros casos
- [ ] Imagens de referência por seção no Higgsfield (cotar antes)
- [ ] Mídia final: retrato tratado, vídeos e capas (cotar antes)
- [ ] Blocos visuais em `packages/ui`
- [ ] Todas as páginas e seções, no mesmo estilo
- [ ] Movimento: GSAP, Lenis, 3D onde couber, versão leve e sem movimento
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
