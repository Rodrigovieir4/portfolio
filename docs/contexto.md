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
- Servidores de desenvolvimento: site na porta 3400 e API na 3001 (as portas
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
- **Tipografia** (24/11): Títulos e texto em Geist, rótulos em Geist
  Mono, números grandes em Anton. Alternativa guardada para os títulos:
  Bricolage Grotesque (ele gostou; pode entrar depois). Recusadas: serifas
  (Cormorant, Bodoni) e Anton nos títulos.
- **Estrutura confirmada** (24/11): um projeto tem vários casos; existe
  `/ideias` para posts de opinião; `/sobre` é página separada.
- **Fotos** (24/11): 6 fotos dele (frente, 3/4, perfil, meio corpo, camiseta
  branca, luz do quarto). Originais em `C:/Users/RoDfps/Downloads/New folder`,
  convertidas para JPEG em `D:/workspace/Claude outputs/portfolio-estetica/fotos/`.
  Fora do git. Servem de referência para o retrato de estúdio no Higgsfield.
- **Abertura** (24/11): título "Sistemas que rodam no mundo real.", sem números
  (ele não gostou dos três propostos).
- **Referência visual final** (24/11): 4 retratos de estúdio gerados a partir
  das fotos (o 3, braços cruzados, vai na abertura) e uma imagem por seção com
  paleta, fontes e textos fixos. Índice em `docs/estetica/LEIA-ME.md`;
  rosto fora do git porque o repositório é público.
- **Construção** (24/11): branch `feat/redesenho`, que só vai para a `main`
  inteiro e testado. Primeira etapa feita: tokens Grafite + vinho em OKLCH,
  fontes Geist, Geist Mono e Anton, e as 9 seções do início em versão estática
  (componentes em `apps/web/src/components/inicio/`). Os casos ainda vêm das
  mensagens; o tipo Caso entra na próxima etapa. O retrato está em
  `apps/web/public/images/retrato.webp` e entra no git: o Rodrigo aprovou o
  rosto no repositório público (24/11).
- **Casos** (24/11): tipo `Case` em `packages/content/src/data/cases.ts`, com 6
  casos tirados dos posts 2, 3, 8, 11, 12 e 14, nos três idiomas. Páginas
  `/casos` e `/casos/[caso]` (`/en/cases`), no sitemap. Mostram todos, inclusive
  os de data futura (decisão B do Rodrigo, 24/11).
- **Servidor de desenvolvimento** (24/11): site na porta 3400 (a 3300 passou a
  ser do Daisy), API na 3001.
- **Currículo e projetos** (24/11): vale o currículo atualizado (DBC desde
  out/2025; freela de out/2025 a jul/2026). Daisy e ELOS Imobiliária entraram
  em `projects.ts`. Prints e vídeos dos projetos: o agente tira e monta
  depois, não agora.
- **IA** (24/11): o site diz que ele trabalha com IA no dia a dia, mas sem
  depender dela (frase no sobre, nos três idiomas).
- **Movimento** (24/11): GSAP 3.15 (ScrollTrigger e SplitText) num componente
  só, `apps/web/src/components/inicio/movimento.tsx`, montado no layout do
  site. As seções marcam elementos com `data-mov` e continuam de servidor.
  Abertura: título sobe palavra por palavra, retrato entra e desce mais
  devagar. Sobre: texto acende com a leitura. Casos: carrossel em arco fixo na
  tela a partir de 1024 px (no celular, arrasta). Números sobem de trás de uma
  máscara. Trajetória: linha se desenha e acende os marcos. Contato: bloco
  cresce. Sem movimento pedido no sistema: tudo parado; máquina com até 2
  núcleos ou 2 GB: só entradas simples. O GSAP fixa um div interno de
  `#casos`, nunca um filho direto do `<main>` (o React perde o nó ao trocar
  de página).
- **Páginas novas** (24/11): `/projetos` (lista em linhas, clientes e
  próprios), `/projetos/[projeto]` (com os casos do projeto), `/sobre`
  (bio, como trabalho, trajetória completa, stack, idiomas e contato) e
  `/ideias` com a primeira ideia, tirada do post 4 ("Programo com IA: as
  regras"). O post 20 fica de fora até ele preencher os trechos
  `[RODRIGO: ...]`. Toda página declara canonical e versões de idioma por
  `src/i18n/caminho.ts`; a troca de idioma mantém a página. Nome curto do
  site passou a ser "Rodrigo Vieira", como ele assina.
- **Limpeza** (24/11): saíram as seções, o cabeçalho e o rodapé do currículo
  antigo, os componentes do React Bits e os textos sem uso. O seletor de
  idioma do jogo foi para `components/game/locale-switcher.tsx`.
- **Menu do celular e main** (24/11): abaixo de 768 px o cabeçalho mostra
  "Menu", que abre a navegação em tela cheia com os idiomas. O redesenho foi
  junto na `main` no mesmo dia, depois do check e dos testes.
- **404 e compartilhamento** (25/11): 404 traduzida (rota pega-tudo
  `[locale]/[...resto]`; antes todo caminho errado caía na 404 global), 404
  global nas cores novas e cartão de compartilhamento com título, subtítulo e
  retrato (`public/images/retrato-og.jpg`, porque o gerador não lê WebP).
  Título e descrição do site sem travessão, com o subtítulo da abertura.
- **Foto do LinkedIn** (25/11): 4 retratos sérios gerados no Higgsfield (8
  créditos), em `D:/workspace/Claude outputs/linkedin-perfil/`, fora do git.
  Ele já trocou a foto do perfil.
- **Hero interativo** (25/11, branch `feat/hero-interativo`): o Rodrigo achou
  a abertura fraca e mandou uma referência do Instagram (post DbwBRpLTWYw,
  portfólio "JISHNU"). Hoje: ao carregar, o LaserFlow do React Bits
  (`components/reactbits/laser-flow.tsx`, com a prop `onImpact` nossa) desce
  e, quando bate no fim do hero (cerca de 1 s), o conteúdo aparece. O nome
  gigante "RODRIGO VIEIRA" engrossa perto do mouse (Geist variável) e fica
  atrás do retrato; a fumaça vinho segue o cursor, também atrás.
  Em 25/11: feixe no centro exato da página, nascendo logo abaixo da barra do
  topo (com a borda esfumada, para não passar por trás dos links), links do
  menu centralizados em grade de três colunas, e entrada coreografada no
  impacto (foto sobe com a luz de baixo para cima, nome abre do centro saindo
  do desfoque, depois título e textos; cerca de 1,6 s).
  Ainda em 25/11: as letras do nome saem de dentro do feixe e se espalham, o
  título gira de leve ao subir e o botão principal dá um pulso de brilho.
  Corrigidos dois bugs antigos: a revelação procurava os blocos por um
  atributo errado (só a reserva de 2,5 s mostrava o conteúdo) e as palavras
  do título não se mexiam (elemento em linha ignora transform).
  Ainda em 25/11: o nome gigante passou a usar o TextPressure do React Bits
  (`components/reactbits/text-pressure.tsx`), com a fonte Roboto Flex pelo
  next/font (eixos de peso e largura): perto do mouse as letras engrossam,
  alargam e ficam vinho; parado, uma onda passa; clique solta uma onda. No
  celular o nome ocupa 2/3 da largura para as letras alargadas não saírem da
  tela. Retrato da abertura em resolução cheia (WebP 95, servido em qualidade
  92); ampliação 4K no Higgsfield cotada em 2 créditos, esperando o ok.
- **Regra do retrato** (25/11, pedido do Rodrigo): nada pode ficar por cima da
  foto dele, nem efeito de mouse, nem texto. O hero usa o retrato recortado
  (`public/images/retrato-recorte.webp`, fundo removido localmente com a
  biblioteca da IMG.LY, sem gastar crédito); laser, fumaça e nome ficam atrás.
  O contador de 0 a 100 saiu, trocado pelo laser.
- **Twin Falls descartado** (25/11): testados o laser "Twin Falls" do React
  Bits caindo sobre o retrato (em arco e contornando a silhueta) e a foto
  aparecendo antes do laser. O Rodrigo preferiu voltar ao laser atrás dele,
  batendo no fim do hero, sem nada por cima da foto. Os commits foram
  desfeitos com git revert; o código voltou ao estado do commit 6f45516.
- **Nome da abertura** (25/11): o Rodrigo achou que o TextPressure (letras
  que incham, alargam e ficam rosa, com onda) não combinava com o hero.
  Comparou quatro estilos e escolheu o "luz": nome fino e parado em Geist,
  aceso no centro como se o feixe o iluminasse, apagando para as pontas; no
  impacto a luz se abre do feixe para as pontas e depois segue o mouse. Peso
  fino (300) e letras um pouco separadas, a pedido dele
  (`components/inicio/nome-abertura.tsx`, utilitário `nome-luz`). Saíram o
  TextPressure e a fonte Roboto Flex.
- **Efeito do mouse** (25/11): depois de recusar fumaça, holofote, poeira,
  anel e Glow, e de achar o Splash simples, o Rodrigo escolheu o Ghost Cursor
  do React Bits (`components/reactbits/ghost-cursor.tsx`, montado em
  `components/inicio/efeito-mouse.tsx`). Otimizado: metade da resolução,
  menos pixels no sombreamento, sem granulado, posição da área guardada, só
  com mouse e fora de máquina fraca. Segue o cursor sem abertura própria nem
  deriva, soma luz ao laser (blend screen) e tem fiapos nas bordas.
- **Cabeçalho e laser** (25/11): no início o cabeçalho nasce escondido e desce
  junto com o resto no impacto; o feixe desce desde o topo da página. O
  cabeçalho inteiro é preto fosco (translúcido e desfocado), em todas as
  páginas: o feixe aparece borrado atrás e os links continuam legíveis.
  A marca à esquerda é um prompt de terminal: "❯ rodrigo-vieira" em Geist
  Mono, a seta em vinho e um cursor em barra fina. Ao aparecer, o nome é
  digitado letra por letra (uma vez por carregamento); o cursor pisca devagar
  quatro vezes e fica parado. Clicar no nome leva ao início; já no início, sobe ao topo.
- **Barra de rolagem** (25/11): o Rodrigo pediu o ScrollArea do shadcn na página.
  Na página inteira ele quebraria o Lenis, o GSAP, o cabeçalho fixo e as
  âncoras; ficou a barra nativa com o mesmo visual (fina, alça vinho que
  acende no hover, trilho grafite), e o componente ScrollArea com o mesmo
  estilo para áreas internas.
- **Convite para rolar** (25/11): 5 s depois da abertura, se ninguém rolou, um
  botão "Role para baixo" aparece centralizado embaixo do hero (só no
  computador); some ao rolar e leva à seção seguinte. O título da abertura entra
  com desfoque letra por letra.
- **Logo e favicon** (25/11): 8 propostas em SVG geradas no Higgsfield (6
  créditos aprovados), em `D:/workspace/Claude outputs/portfolio-estetica/logos/`
  (folha.png compara A1 a D2) e 8 propostas "de dev" desenhadas em código
  (folha-dev.png). Ele recusou todas como ícone; escolheu o prompt para o
  cabeçalho. Favicon ainda em aberto: 10 ideias em linguagem de terminal em
  `folha-favicons.png`, na mesma pasta.
  O cabeçalho é fixo (acompanha a rolagem), sem borda embaixo; âncoras param
  logo abaixo dele (scroll-padding-top de 4rem).
- **Qualidade da foto** (25/11): a ampliação 4K no Higgsfield (2 créditos,
  aprovada) saiu menos nítida que o original no tamanho de tela (o ampliador
  alisou pele e cabelo) e foi descartada; o arquivo está em
  `D:/workspace/Claude outputs/portfolio-estetica/retratos/retrato-3-4k.png`.
  O site já entregava a foto inteira; o que melhorou foi um realce de
  nitidez leve no arquivo (sharp, sigma 0,9): `retrato-nitido.webp` na
  abertura e `retrato-sobre.webp` (1792 × 2400, qualidade 92) no /sobre.
- **Higgsfield** (24/11): não gerar os vídeos dos casos por enquanto; avisar e
  esperar o ok antes de qualquer gasto de crédito.
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

- Aprovar os textos de `docs/textos.md` (escritos em 24/11 a partir do
  currículo; o título da abertura já foi escolhido).
- Prints e vídeos dos projetos para o bento e as páginas de projeto (depois).

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
