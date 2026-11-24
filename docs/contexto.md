# Contexto do projeto

Documento para retomar o trabalho em qualquer conta ou máquina sem perder o
fio. Atualizado em 24/11/2026. O passo a passo do que falta está em
[`checklist.md`](checklist.md).

## Como retomar

1. Ler este arquivo inteiro e o `checklist.md`.
2. Ler o `AGENTS.md` (regras do repositório) e a seção 11 do
   `DESIGN-SYSTEM.md` (exceções ao padrão).
3. Abrir `docs/estetica/esboco.html` no navegador para ver o esqueleto do site
   e `docs/estetica/LEIA-ME.md` para o índice das imagens.
4. Continuar pela primeira caixa não marcada do checklist.

## Como o Rodrigo quer trabalhar

- Respostas em português, no chat, com um resumo completo no fim de cada
  tarefa: o que foi feito, o que muda, o que falta e as decisões em aberto,
  explicadas do zero com opções e recomendação.
- Nada de link externo para ele ler, nem caixa de pergunta com opções: as
  perguntas vão escritas no texto.
- Enviar direto na `main`, sem pull request. Antes: `bun run check` e os
  testes de ponta a ponta. Depois: acompanhar o CI.
- No redesenho, falar de **estética** (o que é bonito e atual), não de
  conceito narrativo. A história dele entra no texto do site, não na direção
  visual.
- Toda geração no Higgsfield gasta créditos: cotar antes e pedir aprovação.
- Prefere decidir vendo: imagens de referência e esboços antes de construir.

## Estado do repositório

- Monorepo Turborepo com Bun. `apps/web` (Next.js 16.4, React 19.3, currículo
  em `/pt`, `/en`, `/es` e o jogo do quarto em `/jogo`), `apps/api` (Elysia,
  só `/health`, onde o admin vai morar) e `packages/*`.
- Segue o `DESIGN-SYSTEM.md` (fases 0 a 5 feitas em 18/11/2026): lint
  completo, formatação, TypeScript 6, ESLint 10, tokens em
  `packages/ui/src/styles/globals.css`. Código antigo fica numa lista de
  legado do lint até ser reescrito.
- SocratiCode indexado (`.socraticode.json`).
- Ainda não publicado: o deploy na Vercel espera o domínio.
- Servidores de desenvolvimento: site na porta 3300 e API na 3001 (as portas
  3000 e 3100 costumam estar ocupadas por outros projetos).

## Higgsfield

- MCP `higgsfield` no escopo local desta pasta, com OAuth na conta do Rodrigo
  (plano Ultra). O conector "claude.ai Videos" é da conta do Davi e está
  bloqueado em `.claude/settings.json`. Comandos para refazer numa máquina
  nova estão no `AGENTS.md`.
- Chave da API REST em `HF_API_KEY` no `.env.local` (formato `ID:SEGREDO`,
  testada).
- Saldo em 18/11/2026: cerca de 2960 créditos (gastos cerca de 50 em imagens
  de referência).
- Promoção de 3 dias ilimitados: só para quem ainda não assina. A conta dele
  não é elegível; pelo MCP tudo desconta créditos.
- Custos de referência: imagem GPT Image 2.6 em 2K alta qualidade, 2,75;
  vídeo Kling 3.0 de 7 s, 14; Seedance 2.5 de 7 s em 1080p, 112; filme de 15 s
  Seedance 2.5, 105.
- O website builder do Higgsfield foi descartado como hospedagem (gera outro
  stack, fora deste repositório). O método dele serve de guia de qualidade:
  imagem de referência por seção antes do código, um único destaque de cor,
  título com até 8 palavras, sem travessão longo no texto, um botão com estilo
  próprio por intenção, e nada esperando escondido para aparecer.

## Navegador

O navegador embutido do Orca abre as abas deste repositório no perfil isolado
"Portfólio (Rodrigo)". O Rodrigo digita os logins; o agente usa a sessão.

## Redesenho do site estático

### Decisões tomadas

- **Prioridade:** primeiro o site estático; jogo, posts e admin depois.
- **Objetivo:** vaga e freela, com a vaga em primeiro plano.
- **Direção:** sem enredo ou conceito narrativo. Uma estética muito bonita,
  seguindo o que está em alta nos sites premiados.
- **Esporte:** só sugerido. O texto fala de engenharia.
- **Lançamento:** o site novo substitui o atual quando estiver pronto.
- **Hospedagem:** o site final mora neste repositório (Next.js, Vercel). O
  Higgsfield entra como estúdio de imagem e vídeo.
- **Construção:** tudo de uma vez, com cores, fontes e componentes fixados
  antes, para todas as seções saírem no mesmo estilo.
- **Seções do início e opção escolhida** (ver `docs/estetica/esboco.html`):

  | #   | Seção             | Escolha                                                                |
  | --- | ----------------- | ---------------------------------------------------------------------- |
  | 1   | Abertura          | B: retrato à direita, título grande à esquerda (ref.: exemplos 10 e 7) |
  | 2   | Sobre curto       | A: só texto grande, link para `/sobre`                                 |
  | 3   | Casos em destaque | A: carrossel 3D em arco (ref.: exemplo 3)                              |
  | 4   | Números reais     | A: grade suíça com números enormes (ref.: exemplo 4)                   |
  | 5   | Stack             | A: faixa rolando                                                       |
  | 6   | Trajetória        | B: linha horizontal que se desenha com a rolagem                       |
  | 7   | Certificados      | B: grade com filtro por categoria e miniatura do PDF (24/11)           |
  | 8   | Projetos          | A: blocos (bento)                                                      |
  | 9   | Contato           | A: bloco grande na cor de destaque                                     |

### Estrutura proposta

- Páginas: início, `/casos`, `/casos/[caso]`, `/projetos`,
  `/projetos/[projeto]`, `/sobre`, currículo em PDF por idioma, `/jogo`
  depois. Opcional: `/ideias` para posts de opinião.
- Conteúdo em `packages/content`. Tipo novo **Caso**, vindo dos posts do
  LinkedIn: título, resumo, problema, decisão, resultado, números, stack,
  vídeo, capa, link do post, data de publicação e projeto. Um projeto tem
  vários casos. Os números do início saem dos casos.
- Escalabilidade: publicação por data com rebuild diário; páginas leem por uma
  porta única (`getCasos()` e afins), para trocar arquivo por banco quando o
  admin existir; cada estilo visual vira um bloco em `packages/ui`.
- Bibliotecas para o efeito cinema: GSAP (ScrollTrigger, SplitText, Flip),
  Lenis, React Three Fiber, Theatre.js, OGL. Rolagem sem sequestro: um ou
  dois momentos fixos, o resto rola normal; versão leve no celular e para quem
  pede menos movimento.

### Paleta: Grafite + vinho (escolhida em 24/11)

**Escolha: opção 7, Grafite + vinho.** Fundo `#121013`, tom `#8c1730`,
texto `#f2e9dc`. O vinho aparece só onde importa: degradê do fundo, blocos de
destaque, cartão ativo dos casos e o bloco de contato.

Em 24/11 o Rodrigo trouxe como referência uma peça de moda ("Aureon") com
paleta **monocromática profunda**: campo vinho em degradê (mais claro no
centro, quase preto nas bordas), texto creme e nenhuma cor competindo. As
opções nessa família estão aplicadas no esboço e em `docs/estetica/paletas.html`:

| Opção                 | Fundo     | Tom       | Texto     |
| --------------------- | --------- | --------- | --------- |
| Vinho (a referência)  | `#3d0913` | `#8c1730` | `#f2e6d3` |
| Verde-garrafa         | `#0b241b` | `#1f5a43` | `#efe7d6` |
| Marinho               | `#08132b` | `#22408a` | `#ece6da` |
| Ameixa                | `#26092a` | `#64206b` | `#f3e6ee` |
| Terracota             | `#3a1209` | `#a8401f` | `#f6e9dc` |
| Petróleo              | `#05232a` | `#0f5f66` | `#eef1ea` |
| Grafite + vinho       | `#121013` | `#8c1730` | `#f2e9dc` |
| Creme + vinho (clara) | `#f2e9dc` | `#8c1730` | `#2a0810` |

Na família monocromática, o "tom" faz o degradê do fundo e os blocos de
destaque; os botões usam o texto claro como preenchimento. As paletas da
rodada anterior (preto + vermelho, grafite + limão, roxo + violeta,
azul-noite + ciano, papel + laranja) ficaram para trás.

### Material de referência

- `docs/estetica/`: cópias leves das 8 propostas, 12 referências do Instagram,
  10 exemplos e o esboço. Índice em `docs/estetica/LEIA-ME.md`.
- Originais em 2K e quadros soltos: `D:/workspace/Claude outputs/portfolio-estetica/`.

### Pendências do redesenho

- Tipografia.
- 3 a 5 fotos do Rodrigo (frente, 3/4, perfil, boa luz). As aberturas
  escolhidas dependem do retrato recortado.
- Confirmar: projeto com vários casos; tipo "Ideias" para posts de opinião;
  página `/sobre` separada.
- Texto do post 20 (cargo, senioridade, o que busca), que também serve para a
  abertura.

## Posts do LinkedIn e vídeos (depois do site)

- 20 posts de 17/11/2026 a 04/02/2027 em
  `D:/workspace/Claude outputs/20-posts-linkedin-com-videos.docx` (cópia de
  11/11; a versão viva está no OneDrive dele) e prompts em
  `prompts-higgsfield-20-posts.docx` na mesma pasta.
- Só o post 1 está como ele quer; os demais precisam de revisão.
- Antes do primeiro vídeo: ficha do personagem a partir de 3 a 5 fotos dele.
- Modelo sugerido: Kling 3.0 (cerca de 64 créditos o post 1; cerca de 1.400 os
  20). Seedance 2.5 em 1080p só em cena especial.
- Para editar o Word online: login Microsoft no perfil do Orca ou o app do
  OneDrive sincronizando a pasta (a decidir).

## Depois do site

- Jogo no tema CS: modelos próprios em low-poly. Os do `D:/workspace/cs2cortex`
  são da Valve e pesam cerca de 612 MB por visita; não servem para o site.
- Admin no `apps/api` com banco e armazenamento de mídia.
- Deploy na Vercel com domínio próprio.
