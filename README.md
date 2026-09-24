# Portfolio — Rodrigo Vieira de Sousa

Monorepo Turborepo do portfolio profissional. Next.js 16 no App Router, cena WebGL
com shaders próprios, conteúdo tipado e validado, e três idiomas em rotas estáticas.

Produção: a definir · Antecessor: [portfolio v1](https://portfolio-rodrigo-vieira.netlify.app)

---

## Como rodar

```bash
pnpm install
pnpm dev            # http://localhost:3000 (redireciona para /pt)
```

Requer Node 20.11 ou superior e pnpm 10. A versão exata do Node está em `.nvmrc`.

| Comando                | O que faz                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `pnpm dev`             | Sobe o app em modo de desenvolvimento com Turbopack        |
| `pnpm build`           | Build de produção de todo o monorepo                       |
| `pnpm check`           | Lint, checagem de tipos e build, na ordem                  |
| `pnpm test`            | Testes de consistência do conteúdo                         |
| `pnpm format`          | Aplica o Prettier no repositório inteiro                   |
| `pnpm assets:importar` | Baixa currículo, foto e certificados do repositório antigo |

## Portfólio jogável

Em `/pt/jogo`, `/en/play` e `/es/jugar` o currículo vira um quarto isométrico em React Three
Fiber, com física própria escrita para a geometria do quarto. O visitante anda com WASD ou
joystick e descobre o conteúdo chegando perto dos objetos.

| Objeto                 | O que abre                                                |
| ---------------------- | --------------------------------------------------------- |
| Tapete da entrada      | Sobre mim                                                 |
| PC gamer               | RodrigoOS: projetos em janelas e um terminal com comandos |
| Lousa                  | Stack                                                     |
| Mapa-múndi             | Onde os produtos rodam                                    |
| Parede de quadros      | Certificados                                              |
| Estante de troféus     | Trajetória                                                |
| Estante de livros      | Formação e idiomas                                        |
| Celular no criado-mudo | Contato                                                   |

Além disso: doze commits escondidos para coletar, uma bola com física e uma trave onde o gol
abre o contato, um abajur que apaga a luz, sete conquistas, cronômetro do tour, placar na tecla
P e som sintetizado no navegador, desligado por padrão.

Todo texto vem de `packages/content`, então atualizar o currículo atualiza o quarto junto. O
pacote `packages/game` tem duas entradas: `@portfolio/game` traz o motor e entra por import
dinâmico; `@portfolio/game/state` traz só estado, sem three, para o HUD não pesar.

Os testes de ponta a ponta em `apps/web/e2e` jogam de verdade, pelo teclado, lendo o estado do
jogo por `window.__game`, que só existe com `?debug` na URL:

```bash
pnpm --filter @portfolio/web build
pnpm --filter @portfolio/web test:e2e
```

O pôster do quarto que aparece no alto do currículo é um quadro do jogo de verdade, gerado pelo
mesmo caminho: com o servidor de produção no ar, `pnpm --filter @portfolio/web poster` dirige o
personagem até o meio do quarto, esconde o HUD e grava `public/images/quarto.webp`. Mudou o
quarto, roda de novo.

### Rodar em máquina fraca

O jogo foi feito para abrir no celular de quem clicou no link, não para exigir placa de vídeo.
Três decisões respondem por quase todo o ganho:

**Física própria, no lugar de um motor.** O quarto é um chão plano e vinte e cinco caixas
alinhadas aos eixos. Para isso, cem linhas de teste de caixa contra caixa e esfera contra caixa
dão o mesmo resultado que um motor completo — e o motor custava 811 kB, metade do peso da
página, porque embute WebAssembly. Está em `packages/game/src/physics.ts`, e o mundo de
colisão sai do mesmo arquivo que desenha os móveis, então não existe o bug clássico de mover
um móvel na tela e esquecer o colisor.

**Uma geometria e um material por forma, não por objeto.** Tudo passa por
`scene/resources.ts`. Os doze commits do chão viraram uma malha instanciada, e sombra só fica
em peça grande o bastante para a sombra aparecer, porque quem projeta sombra é desenhado duas
vezes por quadro.

**Três níveis de qualidade, escolhidos medindo.** `packages/game/src/quality.ts` define o que
cada nível liga. No automático, o jogo começa no alto e cai de nível se ficar abaixo de 40
quadros por segundo por dois segundos; subir de novo é mais lento e acontece no máximo uma vez,
porque alternar entre bonito e travado é pior que assumir que o aparelho é modesto. O brilho e
a vinheta só são baixados quando o nível alto está em vigor. Quem quiser travar um nível tem o
seletor na tecla `H`, e a escolha fica lembrada no navegador.

Medido no mesmo aparelho, em renderização por software (SwiftShader, que é o pior caso
plausível), 1366×820:

|                              | antes   | depois (alto) | depois (baixo) |
| ---------------------------- | ------- | ------------- | -------------- |
| JavaScript na rede           | 1596 kB | 790 kB        | 685 kB         |
| Chamadas de desenho          | 356     | 258           | 176            |
| Geometrias na GPU            | 197     | 19            | 17             |
| Quadros por segundo, andando | 16      | 17            | 47             |
| Memória JS                   | 30 MB   | 22 MB         | 20 MB          |

No automático, esse mesmo aparelho termina em 40 quadros por segundo sozinho, sem ninguém
mexer em ajuste.

---

## Arquitetura

```
apps/
  web/                  Next.js 16 — App Router, i18n em /pt /en /es
    components/ui/      shadcn/ui, gerado pelo CLI oficial
    components/reactbits/ React Bits, vendorizado pelo mesmo CLI
packages/
  content/              Dados profissionais tipados e validados com Zod
  game/                 Protótipo do portfólio jogável: quarto 3D com física
  gl/                   Cena WebGL, shaders GLSL, detecção de capacidade
  ui/                   Design system e componentes de movimento
  config-tailwind/      Design tokens, em CSS e espelhados em TypeScript
  config-eslint/        Configuração de lint compartilhada
  config-typescript/    Bases de tsconfig compartilhadas
```

Três decisões explicam o resto do repositório.

**O conteúdo é uma dependência, não um punhado de arquivos soltos.** Tudo que aparece
no site vive em `packages/content` e passa por um schema Zod na hora em que o módulo
carrega. Errar uma data ou esquecer a tradução em espanhol quebra o build com a
mensagem exata do campo, em vez de publicar um buraco. É também o único pacote que
você edita para atualizar o portfólio ao longo do tempo.

**O WebGL é isolado e opcional.** `packages/gl` não é importado diretamente: entra por
import dinâmico com renderização no servidor desligada, porque o three.js toca em
`window` ao criar o contexto. Antes de montar, o pacote mede a máquina do visitante e
escolhe entre quatro perfis, de 48 mil partículas a nenhuma. Sem WebGL2, em celular
modesto, ou com `prefers-reduced-motion` ligado, a cena vira um gradiente estático e a
página continua íntegra.

**As versões vivem em um catálogo só.** `pnpm-workspace.yaml` centraliza todas as
versões de dependência. Subir o React é uma linha, não sete arquivos, e não há risco
de duas cópias de `three` no bundle.

---

## Atualizar o conteúdo

Todos os caminhos abaixo são dentro de `packages/content/src/data`.

| Quero                              | Arquivo             |
| ---------------------------------- | ------------------- |
| Trocar bio, foto, contato ou redes | `profile.ts`        |
| Adicionar emprego, curso ou marco  | `experience.ts`     |
| Publicar um projeto novo           | `projects.ts`       |
| Ajustar tecnologia ou nível        | `skills.ts`         |
| Somar um certificado               | `certifications.ts` |

Cada campo de texto é um objeto com `pt`, `en` e `es`. O tipo obriga os três, então
não dá para publicar uma tradução pela metade sem o compilador reclamar.

Para um emprego novo, `experience.ts` traz um bloco modelo comentado no fim do
arquivo. Copie, preencha e use `end: null` enquanto estiver no cargo. A ordenação e os
contadores da home se atualizam sozinhos.

### Pendências de conteúdo

Alguns meses na linha do tempo são estimativas, porque o currículo trazia só o ano.
Estão marcados com `// CONFIRMAR` em `experience.ts`:

- mês de início do MBA na USP
- meses de início e fim da graduação na São Judas
- meses de início e fim do período como atleta profissional

Todo o resto de data veio do histórico git dos repositórios em `D:workspace`.

O currículo em inglês e em espanhol ainda não existe. Enquanto isso, os três idiomas
apontam para o PDF em português, conforme a nota em `profile.ts`.

---

## Design

O tema se chama Obsidiana e Sinal. Fundo quase preto que empurra o conteúdo para a
frente, um verde-limão ácido como único sinal de ação, e violeta e brasa apenas para
dar profundidade. Os tokens ficam em `packages/config-tailwind/theme.css` e são
espelhados em `tokens.ts`, porque WebGL não lê CSS: o three.js precisa de hexadecimal
e de vetores normalizados, e manter os dois lados no mesmo lugar evita que a cena 3D
e a interface saiam de sintonia.

A nuvem de partículas do topo guarda duas posições por partícula, uma em cada forma
geométrica, e interpola entre elas conforme a página rola. Um campo de curl noise
mantém tudo em movimento contínuo, e o ponteiro do mouse abre um vazio ao redor do
cursor. Tudo acontece no shader, por vértice: a CPU só envia uniforms e nunca toca no
buffer de posições, que é o que permite dezenas de milhares de partículas sem perder
quadro.

---

## Deploy

Feito para a Vercel. `vercel.json` já traz o comando de build filtrado para o app,
o diretório de saída e os cabeçalhos de segurança.

Ao conectar o repositório, defina a variável de ambiente:

```
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

Ela alimenta as URLs canônicas, o sitemap, o robots e as tags Open Graph. Sem ela, o
site cai em `localhost` e os links compartilhados apontam para lugar nenhum.

O CI em `.github/workflows/ci.yml` roda formatação, lint, tipos e build a cada push e
pull request na `main`.

---

## Licença

MIT. O código é livre; o conteúdo profissional, os certificados e a fotografia não.
