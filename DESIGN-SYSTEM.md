# Design System e Padrão de Projetos

Documento único de padrão para todos os projetos (novos e existentes).
Um agente deve ler este arquivo **uma vez**, aplicar o que couber no projeto e
terminar pela **Checklist de verificação** (seção 10).

Testado do zero em 03/11/2026, no Windows, com: Bun 1.3.14, shadcn CLI 4.23,
Next 16.4, React 19.3, Tailwind 4.3, TypeScript 6.0, ESLint 10.14,
typescript-eslint 8.72, Elysia 1.4, Eden 1.4, Turbo 2.11, Prettier 3.9.
Se uma versão mais nova quebrar algo, fixe a versão que funciona e atualize
esta lista e a regra afetada.

---

## 0. Instruções para o agente

1. Descubra se o projeto é **novo** (seção 3) ou **existente** (seção 4).
2. **Projeto novo:** instale e configure **exatamente** o que está aqui. Não
   troque ferramentas nem adicione bibliotecas equivalentes às da seção 1.
3. **Projeto existente:** comece pela auditoria, sem editar nada (seção 4). Nunca
   aplique tudo de uma vez em um repositório que já tem código.
4. O que não puder seguir o padrão vira **exceção registrada** (seção 11), com o
   motivo. Exceção sem registro é erro.
5. Copie este arquivo para a raiz do projeto e aponte para ele no `CLAUDE.md`
   (seção 9.4). Sem isso, a próxima sessão não fica sabendo do padrão.
6. No fim, rode a checklist da seção 10. Só considere concluído com tudo ✅ ou
   com a exceção registrada.

---

## 1. Stack obrigatória

| Camada | Ferramenta | Observação |
|---|---|---|
| Runtime e gerenciador de pacotes | **Bun** | No monorepo inteiro. Nada de npm/pnpm/yarn no projeto. |
| Monorepo | **Turborepo** | `apps/*` e `packages/*`, mesmo com um app só. |
| Frontend | **Next.js** (App Router) | |
| Backend | **Elysia** | Em `apps/api`, roda no Bun. |
| Cliente da API | **Eden** (`@elysia/eden`) | Front tipado a partir da API, sem gerar código. |
| Estilo | **Tailwind CSS v4** | Tokens em CSS (`@theme`), sem `tailwind.config`. |
| Componentes | **shadcn/ui** (`radix-nova`, base `neutral`) | Sempre via CLI, nunca escritos à mão do zero. |
| Ícones | **Lucide** (`lucide-react`) | Única biblioteca de ícones permitida. |
| Fontes | **Geist** e **Geist Mono** | Vêm do preset `nova`. No máximo 2 famílias; outra só se a marca exigir. |
| Tema | `next-themes` (classe `.dark`) | Claro e escuro desde o primeiro dia. |
| Toast | `sonner` | Pelo componente do shadcn. |
| Formulários | `react-hook-form` + `zod` | O schema é a fonte da verdade. |
| Datas | `date-fns` | |
| Animação | `tw-animate-css` | `motion` só quando precisar de física ou gestos. |
| Linguagem | **TypeScript 6** | Fixar `typescript@~6.0`. O `typescript-eslint` só aceita abaixo de 6.1 e o TS 7 quebra o lint. |
| Lint | **ESLint 10** (flat config) | Seção 5. |
| Formatação | **Prettier** + `prettier-plugin-tailwindcss` | Seção 6. |
| Testes | **`bun test`** | Playwright para fluxos críticos no navegador (seção 7.3). |
| Integração contínua | **GitHub Actions** | Seção 7.1. |
| Revisão de código | **CodeRabbit** | Seção 9.1. |
| Contexto do agente | **SocratiCode** + skills | Seções 9.2 e 9.3. |

---

## 2. Estrutura do monorepo

```
.
├── apps/
│   ├── web/                     # Next.js
│   │   ├── app/                 # rotas
│   │   ├── components/          # componentes do app (blocos, seções)
│   │   ├── hooks/
│   │   ├── lib/                 # utilitários, cliente Eden
│   │   ├── components.json
│   │   └── eslint.config.js
│   └── api/                     # Elysia
│       ├── src/index.ts         # exporta `app` e `type App`
│       ├── src/server.ts        # app.listen()
│       ├── src/index.test.ts
│       ├── tsconfig.json
│       └── eslint.config.js
├── packages/
│   ├── ui/                      # shadcn compartilhado
│   │   ├── src/components/      # componentes shadcn
│   │   ├── src/hooks/
│   │   ├── src/lib/utils.ts
│   │   ├── src/styles/globals.css   # ÚNICA fonte de tokens
│   │   ├── components.json
│   │   └── eslint.config.js
│   ├── eslint-config/           # config de lint compartilhada
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── elysia.js
│   │   └── eslint.config.js
│   └── typescript-config/       # gerado pelo template
├── .claude/                     # settings.json e hook de lint (seção 9.2)
├── .github/workflows/ci.yml
├── .coderabbit.yaml
├── .gitattributes
├── CLAUDE.md
├── DESIGN-SYSTEM.md
├── prettier.config.js
├── turbo.json
└── package.json
```

**Regra de dependência no Bun:** um app só enxerga um pacote do workspace se
declarar a dependência no `package.json` com `"workspace:*"`. Sem isso, o
import não resolve.

**Regra do Tailwind no lint:** todo workspace que usa `better-tailwindcss`
precisa declarar `tailwindcss` nas próprias `devDependencies`. Sem isso, o lint
só imprime um aviso e **desliga as regras de Tailwind**.

---

## 3. Projeto novo

Siga na ordem. Os comandos assumem a raiz do projeto, salvo indicação.

### 3.1 Criar o monorepo com Next + shadcn

```bash
bunx --bun shadcn@latest init -t next --monorepo -n <nome-do-projeto> -b radix -p nova --yes
cd <nome-do-projeto>
rm -f .prettierrc .eslintrc.js packages/eslint-config/react-internal.js
```

- `-t next`: template Next.js.
- `--monorepo`: cria a estrutura Turborepo com `apps/web` e `packages/ui`.
- `-b radix`: base de componentes Radix.
- `-p nova`: preset que já usa **Lucide** e a fonte **Geist**.
- O `rm` tira sobras do template. O `.prettierrc` teria prioridade sobre o
  `prettier.config.js` da seção 6, e os outros dois não são mais usados.

Confirme que os dois `components.json` (`apps/web` e `packages/ui`) têm o
mesmo `style`, `iconLibrary: "lucide"` e `baseColor`.

Troque `lang="en"` em `apps/web/app/layout.tsx` pelo idioma do projeto.

### 3.2 Adicionar a API Elysia

Crie os arquivos abaixo em `apps/api` e depois instale:

```bash
cd apps/api
bun add elysia @elysiajs/cors
bun add -d @types/bun typescript@~6.0
```

`apps/api/package.json`:

```json
{
  "name": "@workspace/api",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "start": "bun src/server.ts",
    "test": "bun test",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@workspace/eslint-config": "workspace:*",
    "@workspace/typescript-config": "workspace:*"
  }
}
```

`apps/api/tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "declaration": false,
    "declarationMap": false,
    "noEmit": true,
    "types": ["bun"]
  },
  "include": ["src"]
}
```

`apps/api/src/index.ts`:

```ts
import { cors } from "@elysiajs/cors"
import { Elysia, t } from "elysia"

const origin = process.env.WEB_URL ?? "http://localhost:3000"

export const app = new Elysia()
  .use(cors({ origin }))
  .get("/health", () => ({ ok: true }))
  .post("/users", ({ body }) => body, {
    body: t.Object({ name: t.String() }),
  })

export type App = typeof app
```

O CORS é obrigatório: front e API rodam em origens diferentes e, sem ele, o
navegador bloqueia as chamadas. Se a sessão usar cookie, ligue
`credentials: true` aqui e `fetch: { credentials: "include" }` no Eden.

`apps/api/src/server.ts`:

```ts
import { app } from "./index"

const port = Number(process.env.PORT ?? 3001)

app.listen(port)
console.warn(`api on ${port}`)
```

`apps/api/src/index.test.ts`:

```ts
import { expect, test } from "bun:test"

import { app } from "./index"

test("GET /health responde ok", async () => {
  const res = await app.handle(new Request("http://localhost/health"))

  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})
```

### 3.3 Cliente Eden no front

```bash
cd apps/web
bun add @elysia/eden
bun add -d tailwindcss typescript@~6.0
```

Adicione `"@workspace/api": "workspace:*"` às `dependencies` de `apps/web`.

Em `apps/web/tsconfig.json`, dentro de `compilerOptions`, adicione as linhas
abaixo. Sem elas, o `next build` falha com `TS2883` no cliente Eden:

```json
"declaration": false,
"declarationMap": false
```

`apps/web/lib/eden.ts`:

```ts
import type { App } from "@workspace/api"

import { treaty } from "@elysia/eden"

const url = process.env.NEXT_PUBLIC_API_URL ?? "localhost:3001"

export const api = treaty<App>(url)
```

O front importa **apenas tipos** da API (`import type`). O lint bloqueia
import de valor (seção 5.3).

### 3.4 Lint, Prettier, raiz, tokens e ferramentas

Siga as seções 5, 6, 7, 8.2 e 9, nessa ordem.

### 3.5 Primeira passada

O código gerado pelo template não vem na ordem que o lint exige. Rode uma vez,
na raiz, depois de tudo instalado:

```bash
bun install
bunx turbo lint -- --fix
bun run format
bun run check
```

---

## 4. Projeto existente

Regra de ouro: **auditar, reportar e migrar por fases**. Nunca tudo de uma vez,
e nunca mudar o visual sem a pessoa ver.

### 4.1 Auditoria (sem editar nada)

Entregue um relatório com ✅ cumpre, ⚠️ faz diferente ou ⏳ falta para cada linha
da seção 1, e também:

- versão do Tailwind e do Next; se existe `tailwind.config.*` (Tailwind v3);
- `components.json`: `style`, `baseColor` e `iconLibrary`;
- onde ficam os tokens, e quantas cores soltas há (`bg-red-500`, `#333`, `rgb(`);
- componentes caseiros que repetem um do shadcn;
- outras bibliotecas de UI ou de ícones;
- quantos erros as regras da seção 5 dariam, **regra por regra**;
- trabalho em andamento no repositório (outros branches, worktrees, sessões).

### 4.2 Fases

Cada fase é um commit próprio (ou poucos), testado, e não muda o visual sem
aviso. Pule o que já estiver cumprido.

| Fase | O quê | Cuidado |
|---|---|---|
| 0. Ferramentas | `CLAUDE.md`, `.claude/`, SocratiCode, CodeRabbit, CI | Risco zero: não toca em código de produto. |
| 1. Bun e Turborepo | `bun install` e apagar os outros lockfiles; mover para `apps/*` e `packages/*` | É a fase que mais afeta caminhos e deploy. Combine antes. |
| 2. Lint de correção | Plugins da seção 5, com as regras de correção como erro | Veja "regra com muitas ocorrências" abaixo. |
| 3. Formatação | Seção 6 e `perfectionist --fix` | Commit **só de formatação**, sem trabalho em andamento em outras sessões. |
| 4. Versões | Tailwind v4 (`bunx @tailwindcss/upgrade`), TypeScript 6, ESLint 10 | Uma de cada vez. |
| 5. Tokens | Seção 8.2, preenchendo com as cores **atuais** | A aparência não muda. |
| 6. Componentes | Trocar caseiros por shadcn, **um tipo por vez**. Trocar ícones por Lucide, com mapeamento revisto | Visual aprovado é preservado. |
| 7. Cores soltas | Trocar por tokens, começando pelo que é compartilhado | Arquivo a arquivo. |
| 8. Tamanhos | `max-len`, `max-params`, `max-lines-per-function` | Contínuo: corrige ao mexer em cada arquivo. |

**Regra com muitas ocorrências** (por exemplo, nomes de arquivo ou 80 colunas em
um repositório grande): não desligue em silêncio e não use `eslint-disable` para
"passar". Escolha uma destas opções e registre na seção 11:

- rebaixar para `warn` até corrigir;
- aplicar só em arquivos novos, listando os antigos em um bloco `files`;
- usar outro limite, quando o padrão não fizer sentido para o projeto;
- congelar a contagem atual no CI, para só barrar erros **novos**.

### 4.3 Cuidados

- **Antes de formatar, rode os testes.** Teste que lê o código-fonte como texto quebra
  quando a formatação muda aspas ou linhas. Não reescreva o teste às pressas: rode
  os testes depois de formatar, deixe em `.prettierignore` só os arquivos que os
  quebram e registre na seção 11.
- Formatar também pode afastar um `eslint-disable-next-line` da linha dele. Confira no
  lint e leve o comentário para junto dela.
- Havendo trabalho em andamento em outro worktree, deixe os arquivos dele fora da
  formatação até esse trabalho entrar no `main`.
- Não mude o `style` do shadcn de um projeto que já tem um: isso regenera todos
  os componentes. Fica como exceção.
- Antes de `shadcn add --overwrite`, veja o diff do componente. Componentes
  antigos costumam ter correções locais.
- Não converta fins de linha nem renomeie arquivos junto de uma mudança de código.

---

## 5. ESLint

### 5.1 Instalação (em `packages/eslint-config`)

`packages/eslint-config/package.json`:

```json
{
  "name": "@workspace/eslint-config",
  "private": true,
  "type": "module",
  "exports": {
    "./base": "./base.js",
    "./next": "./next.js",
    "./elysia": "./elysia.js"
  },
  "scripts": {
    "lint": "eslint ."
  }
}
```

```bash
cd packages/eslint-config
bun add -d eslint @eslint/js @stylistic/eslint-plugin eslint-config-prettier \
  eslint-plugin-check-file eslint-plugin-no-secrets eslint-plugin-no-unsanitized \
  eslint-plugin-perfectionist eslint-plugin-turbo globals typescript-eslint \
  typescript@~6.0 eslint-plugin-better-tailwindcss eslint-plugin-react-hooks \
  @next/eslint-plugin-next eslint-plugin-boundaries \
  eslint-import-resolver-typescript eslint-plugin-jsx-a11y
```

O `eslint-plugin-jsx-a11y` 6.10 ainda declara suporte só até o ESLint 9. Ele
funcionou no ESLint 10 nos testes deste padrão. Se quebrar em uma versão futura,
registre e desligue só esse plugin.

Em cada app/pacote que roda lint: `bun add -d eslint typescript@~6.0` e
`"@workspace/eslint-config": "workspace:*"` nas `devDependencies`.

`packages/eslint-config/eslint.config.js`:

```js
import { config } from "./base.js"

export default config
```

### 5.2 `packages/eslint-config/base.js` (todos os projetos)

> `eslintConfigPrettier` fica **logo depois** de `js.configs.recommended`, e
> isso é intencional. Ele desliga `@stylistic/max-len`; se for movido para o
> fim do array, a regra de 80 colunas abaixo deixa de funcionar sem erro.

```js
import js from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier"
import checkFile from "eslint-plugin-check-file"
import noSecrets from "eslint-plugin-no-secrets"
import noUnsanitized from "eslint-plugin-no-unsanitized"
import perfectionist from "eslint-plugin-perfectionist"
import turboPlugin from "eslint-plugin-turbo"
import globals from "globals"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  noUnsanitized.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
  },
  {
    plugins: {
      turbo: turboPlugin,
      perfectionist,
      "check-file": checkFile,
      "no-secrets": noSecrets,
      "@stylistic": stylistic,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "max-params": "off",
      "@typescript-eslint/max-params": ["error", { max: 2 }],
      "no-console": ["error", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      "no-nested-ternary": "error",
      "no-param-reassign": ["error", { props: true }],
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx,js,jsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "no-secrets/no-secrets": ["error", { tolerance: 4.2 }],
      "max-lines-per-function": [
        "error",
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
      "max-len": "off",
      "@stylistic/max-len": [
        "error",
        {
          code: 80,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: false,
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          groups: ["type-import", "unknown"],
        },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-union-types": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-enums": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
    },
  },
  {
    // Teste tem bloco longo e texto que parece segredo.
    files: ["**/*.test.{ts,tsx}", "**/e2e/**"],
    rules: {
      "max-lines-per-function": "off",
      "no-secrets/no-secrets": "off",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.open-next/**",
      "**/.wrangler/**",
      "**/.expo/**",
      "**/.check*/**",
      "**/.baseline*/**",
      "**/out/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "**/web-build/**",
      "**/next-env.d.ts",
      "**/expo-env.d.ts",
      "**/nativewind-env.d.ts",
      "**/react-native-css-env.d.ts",
      "**/cloudflare-env.d.ts",
      "**/worker-configuration.d.ts",
    ],
  },
]
```

### 5.3 `packages/eslint-config/next.js` (Next + Tailwind + boundaries)

```js
import nextPlugin from "@next/eslint-plugin-next"
import betterTailwind from "eslint-plugin-better-tailwindcss"
import boundaries from "eslint-plugin-boundaries"
import a11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"

import { config as base } from "./base.js"

const VARIANTES = "^(?:[^:]+:)*"
const CORES =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|" +
  "violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white"
const PROPS_COR =
  "bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|divide|" +
  "accent|caret|decoration|placeholder"
const PROPS_ESCALA =
  "p[xytblr]?|m[xytblr]?|gap(-[xy])?|space-[xy]|rounded(-[a-z]+)?|" +
  "leading|tracking"

const fronteiras = {
  plugins: { boundaries },
  settings: {
    // Sem o resolver, o boundaries não resolve imports .ts/.tsx
    // e a regra passa em silêncio.
    "import/resolver": { typescript: { alwaysTryTypes: true } },
    "boundaries/elements": [
      { type: "app", pattern: "app/**" },
      { type: "components", pattern: "components/**" },
      { type: "hooks", pattern: "hooks/**" },
      { type: "lib", pattern: "lib/**" },
    ],
  },
  rules: {
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        policies: [
          permitir("app", ["app", "components", "hooks", "lib"]),
          permitir("components", ["components", "hooks", "lib"]),
          permitir("hooks", ["hooks", "lib"]),
          permitir("lib", ["lib"]),
        ],
      },
    ],
  },
}

// Só para o código dos apps: os componentes gerados pelo shadcn ficam de fora.
const travasDoApp = {
  files: ["**/*.tsx"],
  rules: {
    "better-tailwindcss/no-restricted-classes": [
      "error",
      {
        restrict: [
          {
            pattern: `${VARIANTES}(${PROPS_COR})-(${CORES})(-\\d+)?(/\\d+)?$`,
            message: "Cor solta: use um token semântico.",
          },
          {
            pattern: `${VARIANTES}(${PROPS_COR}|${PROPS_ESCALA})-\\[.+\\]$`,
            message: "Valor arbitrário: use a escala ou crie um token.",
          },
        ],
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXAttribute[name.name='style']",
        message: "Sem style inline: use classes e tokens.",
      },
    ],
  },
}

const importsDoApp = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@workspace/api",
            allowTypeImports: true,
            message: "O front só importa TIPOS da API (Eden).",
          },
        ],
        patterns: [
          {
            group: [
              "react-icons",
              "react-icons/*",
              "@heroicons/*",
              "@tabler/*",
              "@phosphor-icons/*",
              "@hugeicons/*",
            ],
            message: "Ícones só de lucide-react.",
          },
        ],
      },
    ],
  },
}

function permitir(de, para) {
  return {
    from: { element: { type: de } },
    allow: { to: { element: { types: { anyOf: para } } } },
  }
}

/**
 * @param {{ tailwindEntryPoint: string, app?: boolean }} options
 * @returns {import("eslint").Linter.Config[]}
 */
export function nextConfig({ tailwindEntryPoint, app = true }) {
  return [
    ...base,
    reactHooks.configs.flat["recommended-latest"],
    nextPlugin.configs["core-web-vitals"],
    a11y.flatConfigs.recommended,
    betterTailwind.configs["correctness-error"],
    {
      settings: {
        "better-tailwindcss": { entryPoint: tailwindEntryPoint },
      },
    },
    fronteiras,
    ...(app ? [travasDoApp, importsDoApp] : []),
  ]
}
```

O que cada parte garante:

| Regra | Garante |
|---|---|
| `react-hooks` (recommended-latest) | Regras de hooks e do React Compiler. |
| `@next/next` (core-web-vitals) | `next/image`, `next/link`, fontes e scripts do jeito certo. |
| `jsx-a11y` (recommended) | Clique sem teclado, imagem sem `alt`, atributos ARIA errados. |
| `better-tailwindcss` (correctness) | Classe inexistente nos tokens, classes conflitantes (`p-2 p-4`), classe concatenada. |
| `no-restricted-classes` | Sem cor da paleta (`bg-red-500`), sem valor arbitrário de cor ou escala (`text-[#333]`, `p-[13px]`). `bg-(--token)` e `grid-cols-[...]` continuam valendo. |
| `no-restricted-syntax` | Sem `style={{...}}`. Valor que vem de dado em tempo de execução (ex.: largura de uma barra de progresso) é exceção com comentário na linha. |
| `boundaries` | `app` → `components` → `hooks` → `lib`. `lib` não importa componente; componente não importa rota. |
| `no-restricted-imports` | Front não importa código da API, só `import type`, e não usa outra biblioteca de ícones. |

### 5.4 `packages/eslint-config/elysia.js`

```js
import globals from "globals"

import { config as base } from "./base.js"

/** @type {import("eslint").Linter.Config[]} */
export const elysiaConfig = [
  ...base,
  {
    files: ["**/*.ts"],
    languageOptions: { globals: { ...globals.node, Bun: "readonly" } },
  },
]
```

### 5.5 `eslint.config.js` de cada workspace

`apps/web/eslint.config.js`:

```js
import { nextConfig } from "@workspace/eslint-config/next"

export default nextConfig({
  tailwindEntryPoint: "../../packages/ui/src/styles/globals.css",
})
```

`packages/ui/eslint.config.js`:

```js
import { nextConfig } from "@workspace/eslint-config/next"

export default [
  ...nextConfig({
    tailwindEntryPoint: "./src/styles/globals.css",
    app: false,
  }),
  {
    // packages/ui não é um app Next: sem pages/ nem app/.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  {
    // Código gerado pelo shadcn: fica como a CLI entrega, para poder atualizar.
    files: ["src/components/**", "src/hooks/**"],
    rules: {
      "@typescript-eslint/max-params": "off",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["^cn-", "^origin-top-center$", "^toaster$"] },
      ],
      eqeqeq: "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-noninteractive-tabindex": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "max-lines-per-function": "off",
      "no-nested-ternary": "off",
      "no-param-reassign": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]
```

`apps/api/eslint.config.js`:

```js
import { elysiaConfig } from "@workspace/eslint-config/elysia"

export default elysiaConfig
```

Cada um com `"lint": "eslint ."` no `package.json`.

---

## 6. Prettier

Na raiz:

```bash
bun add -d prettier prettier-plugin-tailwindcss
```

`prettier.config.js`:

```js
/** @type {import("prettier").Config} */
export default {
  semi: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./packages/ui/src/styles/globals.css",
  tailwindFunctions: ["cn", "cva"],
}
```

Acrescente ao `.prettierignore` do template, para este arquivo continuar igual
em todos os projetos:

```
DESIGN-SYSTEM.md
```

- O `printWidth` padrão do Prettier é 80, o mesmo do `@stylistic/max-len`.
  Os dois não brigam: o Prettier quebra a linha e strings longas (incluindo
  `className`) são ignoradas pelo `max-len`.
- A ordem das classes Tailwind é do `prettier-plugin-tailwindcss`. Não ligue
  as regras de ordenação do `better-tailwindcss`.

---

## 7. Raiz do monorepo

`package.json`:

```json
{
  "name": "<nome-do-projeto>",
  "private": true,
  "type": "module",
  "packageManager": "bun@<versão de `bun -v`>",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "format": "prettier --write .",
    "check": "prettier --check . && turbo lint typecheck test build"
  },
  "devDependencies": {
    "@workspace/eslint-config": "workspace:*",
    "@workspace/typescript-config": "workspace:*",
    "turbo": "^2.11",
    "prettier": "^3.9",
    "prettier-plugin-tailwindcss": "^0.8",
    "typescript": "~6.0"
  }
}
```

`turbo.json`:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "env": ["NEXT_PUBLIC_API_URL", "PORT", "WEB_URL"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "!.next/dev/**",
        "dist/**"
      ]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": {},
    "test": {}
  }
}
```

Toda variável de ambiente nova entra em `env` aqui. O
`turbo/no-undeclared-env-vars` avisa quando falta.

`.gitattributes` (fins de linha iguais em Windows, Mac e Linux):

```
* text=auto eol=lf
```

`apps/web/package.json` e `packages/ui/package.json` precisam dos scripts:

```json
"lint": "eslint .",
"typecheck": "tsc --noEmit",
"test": "bun test --pass-with-no-tests"
```

### 7.1 Integração contínua

O lint só protege o projeto se rodar sozinho. `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run check
```

Antes de dar uma tarefa por concluída, rode `bun run check` na máquina. É o mesmo
comando do CI.

### 7.2 Variáveis de ambiente

- Nunca versione `.env`, dumps, chaves nem dados de clientes.
- Cada app tem um `.env.example`, com as chaves e sem os valores. Como o template
  ignora `.env*`, acrescente ao `.gitignore`:

  ```
  !.env.example
  ```

- `NEXT_PUBLIC_*` vai para o navegador. Segredo nunca leva esse prefixo.

### 7.3 Testes

- `bun test`, com o teste ao lado do código (`arquivo.test.ts`).
- Toda rota nova da API tem teste com `app.handle(new Request(...))`, sem subir
  servidor (exemplo na seção 3.2).
- Fluxo crítico no navegador (login, pagamento): Playwright, em `apps/web/e2e`.
- Correção de bug vem com o teste que reproduz o bug.
- Teste verifica o comportamento, não o texto do código: comparar trechos do
  código-fonte quebra a cada formatação e não prova que a função funciona.

### 7.4 Deploy

Cada projeto documenta o próprio no `CLAUDE.md`: como publicar, como voltar atrás
e onde ficam as variáveis. A API em produção roda com `bun run start`. Defina
`WEB_URL` (origem do CORS) e `NEXT_PUBLIC_API_URL`.

---

## 8. Design system: regras de uso

### 8.1 Princípios

Referência de acabamento: Linear, Vercel, Tailwind Plus. Premium é **contenção**,
não efeito.

- **Minimalista:** espaço generoso, poucos elementos, nada de decoração sem função.
- **Cor:** cerca de 90% da tela é neutra. A marca fica na ação principal, no foco
  e em poucos destaques. **Um** botão `primary` por área visível.
- **Hierarquia por tamanho e peso**, não por cor. Texto secundário é
  `text-muted-foreground`, nunca um cinza inventado.
- **Efeitos** (glass, glow, gradiente, partículas) só com pedido explícito, e nunca
  em `packages/ui`.

### 8.2 Tokens (Tailwind v4)

- A **única** fonte de cores, raio, fontes e sombras é
  `packages/ui/src/styles/globals.css` (variáveis CSS + `@theme inline`).
- Três camadas, nesta ordem: **marca** (`--brand`), **semânticos** do shadcn
  (`--primary`, `--muted`...) e **estados** (`--success`...). Componentes usam só
  as duas últimas.
- Use as classes semânticas: `bg-background`, `text-foreground`, `bg-primary`,
  `text-muted-foreground`, `border-border`, `ring-ring`,
  `bg-success-soft text-success`.
- Precisou de uma cor nova? Crie o token em `globals.css` (light **e** dark), em
  OKLCH, e use a classe gerada. Não escreva cor solta no componente.
- Mudar o raio é só mudar `--radius`: a escala é derivada dele.
- CSS escrito à mão fica dentro de `@layer base`. Fora de camada, ele ganha de
  qualquer utilitário do Tailwind.

Cole no **fim** de `globals.css`, depois do que o preset gerou, e troque só os
valores de `--brand` e `--brand-foreground`. Os valores abaixo são neutros, iguais
aos do preset, para o projeto funcionar antes de ter marca:

```css
@custom-variant can-hover (@media (hover: hover));
@custom-variant no-hover (@media (hover: none));

:root {
  --brand: oklch(0.205 0 0);
  --brand-foreground: oklch(0.985 0 0);

  --primary: var(--brand);
  --primary-foreground: var(--brand-foreground);
  --ring: var(--brand);
  --sidebar-primary: var(--brand);
  --sidebar-primary-foreground: var(--brand-foreground);
  --sidebar-ring: var(--brand);
  --chart-1: var(--brand);

  --destructive-foreground: oklch(0.99 0 0);
  --destructive-soft: oklch(0.96 0.03 27);
  --success: oklch(0.53 0.14 155);
  --success-foreground: oklch(0.99 0 0);
  --success-soft: oklch(0.96 0.04 155);
  --warning: oklch(0.7 0.15 70);
  --warning-foreground: oklch(0.2 0.03 70);
  --warning-soft: oklch(0.97 0.05 85);
  --info: oklch(0.56 0.1 250);
  --info-foreground: oklch(0.99 0 0);
  --info-soft: oklch(0.96 0.02 250);
}

.dark {
  --brand: oklch(0.922 0 0);
  --brand-foreground: oklch(0.205 0 0);

  --primary: var(--brand);
  --primary-foreground: var(--brand-foreground);
  --ring: var(--brand);
  --sidebar-primary: var(--brand);
  --sidebar-primary-foreground: var(--brand-foreground);
  --sidebar-ring: var(--brand);
  --chart-1: var(--brand);

  --destructive-foreground: oklch(0.15 0.01 256);
  --destructive-soft: oklch(0.3 0.07 22);
  --success: oklch(0.74 0.16 158);
  --success-foreground: oklch(0.15 0.01 256);
  --success-soft: oklch(0.3 0.06 158);
  --warning: oklch(0.82 0.16 82);
  --warning-foreground: oklch(0.18 0.02 82);
  --warning-soft: oklch(0.32 0.06 82);
  --info: oklch(0.72 0.11 250);
  --info-foreground: oklch(0.15 0.01 256);
  --info-soft: oklch(0.3 0.05 250);
}

@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-soft: var(--destructive-soft);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-warning-soft: var(--warning-soft);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-info-soft: var(--info-soft);
}
```

### 8.3 Tipografia e espaçamento

- Títulos com `tracking-tight text-balance`. Parágrafos com `text-pretty` e
  `max-w-prose`. Números (preços, saldos, tabelas) com `tabular-nums`.
- Só a escala do Tailwind (múltiplos de 4px). Em telas de app: blocos `gap-4` ou
  `gap-6`, páginas `p-4 lg:p-8`. Em marketing: seções `py-16 lg:py-24`.
- Contêiner: `mx-auto max-w-7xl px-4 lg:px-8`.
- Superfícies: raio sempre pelo token (`rounded-lg`, `rounded-xl`), sombra suave
  (`shadow-xs`, `shadow-sm`).

### 8.4 Componentes (shadcn)

- Adicione sempre pela CLI, rodando **dentro de `packages/ui`**, e depois alinhe ao
  lint:
  ```bash
  cd packages/ui
  bunx --bun shadcn@latest add <componente>
  bunx --bun eslint . --fix
  ```
  Rodando de `apps/web`, a CLI põe o arquivo em `packages/ui`, mas instala as
  dependências em `apps/web`, e o `typecheck` de `packages/ui` quebra.
- Blocos (`login-01`, `dashboard-01`...) são a exceção: rode dentro de `apps/web`,
  depois de adicionar em `packages/ui` os componentes base de que eles dependem.
  Eles vêm com `href="#"` de exemplo, que o lint reprova: troque pelos links reais.
- A CLI para e pergunta quando o arquivo já existe. Em projeto novo, use
  `--overwrite`. Em projeto existente, veja antes a seção 4.3.
- Se a CLI gerar um `src/lib/*.tsx`, declare-o em `exports` no `package.json` de
  `packages/ui`, porque o padrão do template só cobre `.ts`:
  `"./lib/highlighter": "./src/lib/highlighter.tsx"`.
- Import sempre do pacote compartilhado:
  ```ts
  import { Button } from "@workspace/ui/components/button"
  import { cn } from "@workspace/ui/lib/utils"
  ```
- Antes de criar um componente, confira se o shadcn já tem um equivalente. Só
  então componha um novo **a partir** dos primitivos.
- Variações de um componente são feitas com `cva` no próprio componente, não
  copiando o arquivo.
- Bug em um primitivo se corrige **na fonte** (`packages/ui`), nunca com remendo em
  cada app. Componente usado por 2 apps ou mais sobe para `packages/ui`.
- Feedback: `sonner` para toast, `AlertDialog` para confirmar ação destrutiva,
  `Skeleton` para carregamento de conteúdo (nada de spinner de página inteira).
- `app/**/page.tsx` é fino: busca dados e renderiza componentes.
- **Todo componente interativo tem os estados:** padrão, hover, `focus-visible`,
  disabled e carregando. Listas têm também vazio e erro.

### 8.5 Ícones (Lucide)

- Só `lucide-react`:
  ```tsx
  import { Search } from "lucide-react"

  <Search className="size-4" />
  ```
- Tamanho com `size-*` (`size-4` em botões e campos, `size-5` em navegação) e cor
  herdando do texto (`text-*`). Nada de SVG solto quando existe ícone Lucide
  equivalente.
- Botão só com ícone leva `aria-label`.

### 8.6 Movimento

- 150 a 250 ms, `ease-out`, animando só `transform` e `opacity`.
- Animação decorativa fica dentro de `motion-safe:`.
- Animar `filter` repinta a camada a cada quadro. Para um pulso com brilho, empilhe
  duas cópias, deixe o filtro fixo na de cima e anime a `opacity` dela.
- `filter` e `scale` não ficam no mesmo elemento: o `scale` vai em uma camada interna.

### 8.7 Celular e toque

- **Mobile-first.** Teste a 390px de largura antes de dar por pronto.
- **Alvo de toque de pelo menos 44px** abaixo de `lg`. Controle solto:
  `h-11 lg:h-9`. Quando o desenho não pode crescer:
  `relative after:absolute after:-inset-3 after:content-[''] lg:after:hidden`.
  Com outro alvo ao lado, use só `after:-inset-y-3`, para um não roubar o toque do outro.
- **Hover não é tela larga.** Esconder até o hover usa `can-hover:`, nunca `lg:`,
  porque um iPad tem 1024px e não tem hover:
  `can-hover:opacity-0 can-hover:group-hover:opacity-100`.
- **`min-w-0` em todos os elos** de flex e grid que tenham texto longo, `truncate`,
  `font-mono` ou `<input>`. Um filho que não quebra linha vira o piso da coluna inteira.
- Faixa que rola de lado leva `overflow-x-auto overflow-y-hidden`.
- `ScrollArea`: corrija uma vez, em `packages/ui`, com `[&>div]:block!` no viewport.
  Sem isso, o Radix usa `display: table` e o conteúdo é cortado no celular.

### 8.8 Acessibilidade

- O foco é sempre visível (`focus-visible`).
- Erro de campo fica abaixo do campo, com `role="alert"` e `aria-describedby`.
- A cor nunca é a única pista: um ponto de status vem sempre com uma palavra.
- Respeite `prefers-reduced-motion`.

### 8.9 Armadilhas que nem lint nem teste pegam

- **Imagem fora da primeira dobra:** `loading="lazy"`. `hidden` e `display:none` não
  impedem o download. `background-image` de CSS não tem lazy.
- **Camada sobre um modal** (lightbox, popover em portal): precisa de
  `pointer-events-auto` e de se marcar para o modal não tratar o clique como
  "clique fora".
- **`Escape` sobre um modal:** quem trata por cima usa listener em `capture` com
  `stopPropagation()`.
- **`display: contents`** mede 0×0: código que mede ou posiciona por cima falha sem erro.
- **`fetch` segue redirect sem avisar:** rota de API sem sessão responde 401 em JSON,
  nunca redirect para o login, senão o `res.json()` quebra ao receber HTML.

### 8.10 Arquivos

- Nomes em `kebab-case` (`user-card.tsx`, `use-mobile.ts`). O lint bloqueia
  `UserCard.tsx`.

---

## 9. CodeRabbit, skills e SocratiCode

Os comandos desta seção instalam na **máquina**, não no projeto. Por isso `npx`
aparece aqui: a regra "nada de npm" vale para as dependências do projeto.

### 9.1 CodeRabbit

1. Instale o app do CodeRabbit no GitHub e libere o repositório.
2. `.coderabbit.yaml` na raiz (troque `language` conforme o idioma do projeto):

```yaml
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
language: "pt-BR"
reviews:
  profile: "assertive"
  request_changes_workflow: true
  high_level_summary: true
  auto_review:
    enabled: true
    drafts: false
  tools:
    eslint:
      enabled: true
  path_instructions:
    - path: "apps/web/**/*.tsx"
      instructions: >-
        Componentes devem vir de @workspace/ui (shadcn). Ícones só de
        lucide-react. Cores só por tokens semânticos (bg-background,
        text-foreground, bg-primary...). Aponte cor solta, valor arbitrário
        do Tailwind e componente que duplica um do shadcn.
    - path: "apps/api/**/*.ts"
      instructions: >-
        Rotas Elysia devem validar body, query e params com `t`. O tipo
        `App` precisa continuar exportado para o Eden.
knowledge_base:
  code_guidelines:
    filePatterns:
      - "**/DESIGN-SYSTEM.md"
```

Este arquivo (`DESIGN-SYSTEM.md`) fica na raiz do repositório para o
CodeRabbit usá-lo como guia de revisão.

Corrija ou justifique cada apontamento antes de abrir o PR.

Para revisar antes de abrir o PR, instale também o plugin e a CLI, uma vez por máquina.
No Windows, use `irm https://cli.coderabbit.ai/install.ps1 | iex` no PowerShell. O login
abre o navegador e precisa ser feito pela própria pessoa:

```bash
claude plugin install --scope user coderabbit
coderabbit auth login
```

- Durante o trabalho: `coderabbit review --agent --uncommitted`.
- Antes do PR: `coderabbit review --agent --base main`.

### 9.2 Skills (Claude Code)

```bash
# caveman: só na máquina, nunca no .claude/settings.json do projeto
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install --scope user caveman@caveman

# ponytail
claude plugin marketplace add DietrichGebert/ponytail
claude plugin install --scope user ponytail@ponytail

# mattpocock/skills: só as de engenharia. O pacote tem também skills pessoais
# e uma `code-review` que sobrepõe a do Claude Code.
npx -y skills@latest add mattpocock/skills --global --agent claude-code -y \
  --skill setup-matt-pocock-skills grill-me grilling grill-with-docs tdd \
  diagnosing-bugs to-spec to-tickets implement implement-spec triage \
  domain-modeling codebase-design improve-codebase-architecture research prototype

# impeccable
npx -y skills@latest add pbakaus/impeccable --global --agent claude-code -y \
  --skill impeccable
```

Depois de instalar o `mattpocock/skills`, rode `/setup-matt-pocock-skills`
dentro do Claude Code (configura issue tracker e labels). Faça isso uma vez em
cada repositório. Plugins e skills novos só valem nas sessões abertas depois.

| Skill | Quando usar |
|---|---|
| **ponytail** | Sempre ligada. Escreve o mínimo de código, sem cortar validação, erros, segurança nem acessibilidade. |
| **caveman** | Respostas curtas no chat. Desligue ao escrever texto para pessoas (`CLAUDE.md`, docs, PR). |
| **mattpocock/skills** | `/grill-me` para afinar requisitos, `tdd`, `diagnosing-bugs`, `to-spec`. |
| **impeccable** | Revisão e acabamento visual de telas. |

`.claude/settings.json` do projeto (se já existir, **junte** as chaves, sem
substituir o arquivo):

```json
{
  "extraKnownMarketplaces": {
    "socraticode": {
      "source": { "source": "github", "repo": "giancarloerra/socraticode" }
    },
    "ponytail": {
      "source": { "source": "github", "repo": "DietrichGebert/ponytail" }
    }
  },
  "enabledPlugins": {
    "socraticode@socraticode": true,
    "ponytail@ponytail": true
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bun \"$CLAUDE_PROJECT_DIR/.claude/hooks/lint-file.js\""
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/lint-file.js` (corrige com o ESLint cada arquivo editado):

```js
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"

const NOMES = ["js", "mjs", "cjs", "ts"].map((ext) => `eslint.config.${ext}`)

function acharPasta(arquivo) {
  let pasta = dirname(arquivo)
  while (pasta !== dirname(pasta)) {
    if (NOMES.some((nome) => existsSync(join(pasta, nome)))) return pasta
    pasta = dirname(pasta)
  }
  return null
}

const { tool_input: entrada } = await Bun.stdin.json()
const arquivo = entrada?.file_path
const ehCodigo = /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(arquivo ?? "")
const pasta = ehCodigo && existsSync(arquivo) ? acharPasta(arquivo) : null

if (pasta) {
  Bun.spawnSync(["bunx", "--bun", "eslint", "--fix", arquivo], { cwd: pasta })
}
```

### 9.3 SocratiCode

Pré-requisito: **Docker rodando** (ele sobe o Qdrant e, se não houver um Ollama na
máquina, também o Ollama).

```bash
claude plugin marketplace add giancarloerra/socraticode
claude plugin install socraticode@socraticode
```

Na primeira sessão do projeto, peça ao agente: "Index this codebase".

`.socraticode.json` na raiz, versionado. Com ele, todas as cópias e worktrees do
repositório usam o mesmo índice, seja qual for o caminho no disco:

```json
{
  "projectId": "<nome-do-projeto>"
}
```

`.socraticodecontextartifacts.json` na raiz (liste também specs e esquemas):

```json
{
  "artifacts": [
    {
      "name": "docs",
      "path": "./docs",
      "description": "Decisões, specs e convenções do projeto."
    },
    {
      "name": "design-tokens",
      "path": "./packages/ui/src/styles/globals.css",
      "description": "Tokens do design system: fonte única de verdade."
    }
  ]
}
```

Como usar:

- "Onde está X": `codebase_search` ou `codebase_symbols` antes de grep.
- Antes de editar, renomear ou apagar um símbolo: `codebase_impact`. Impacto em mais
  de 5 arquivos: avise antes de editar.

Cuidados:

- Use **o plugin ou** o MCP no `.mcp.json`, nunca os dois: sobem dois servidores iguais.
- Sem o `.socraticode.json`, o índice é **por caminho**: um worktree não herda o índice
  do projeto (a busca responde só "Not Found"), e no Windows `D:\projeto` e `d:\projeto`
  viram dois índices separados.
- Um worktree criado a partir de um commit sem o `.socraticode.json` ainda não usa o
  índice compartilhado. Atualize-o com o `main`.
- O índice compartilhado se ajusta à árvore de quem o usou por último. Em um worktree
  perto do `main`, é uma atualização pequena; em um muito atrasado, ele troca milhares
  de trechos e deixa o índice errado para os outros. Atualize o worktree antes.
- Worktrees **dentro** da pasta do projeto são indexados junto e duplicam os resultados.
  Prefira uma pasta fora; se não der, liste-os em `.socraticodeignore`.
- Se a sessão abrir com "Connection closed", rode `/mcp` para reconectar antes de
  concluir que não funciona. A falha fica em cache por alguns minutos.
- Na dúvida, peça `codebase_health` e `codebase_status`.

### 9.4 `CLAUDE.md`

O template só cria um `CLAUDE.md` apontando para o `AGENTS.md`. Mantenha isso e
acrescente ao `AGENTS.md`:

```markdown
## Padrão do projeto

Siga o `DESIGN-SYSTEM.md` da raiz: stack, tokens, componentes e checklist.
Antes de concluir uma tarefa, rode `bun run check`.
Use o SocratiCode para localizar código e medir impacto (seção 9.3).
```

---

## 10. Checklist de verificação

### Em cada tarefa

- [ ] `bun run check` passa.
- [ ] Tela nova ou alterada: vista no navegador, claro e escuro, a 390px e a 1440px.
- [ ] Estados cobertos: hover, foco, disabled, carregando, vazio e erro.
- [ ] Sem `eslint-disable` sem motivo escrito na mesma linha.
- [ ] Mudou algo compartilhado: `codebase_impact` antes de editar.

### Ao configurar o projeto

- [ ] `bun install` na raiz sem erro e sem outro lockfile além de `bun.lock`.
- [ ] `typescript` está em `~6.0` em todos os workspaces que o declaram.
- [ ] `tailwindcss` declarado em `apps/web` e em `packages/ui`.
- [ ] `bun run check` passa: formatação, lint, tipos, testes e build.
- [ ] Teste de fumaça do lint em `apps/web/components/Teste.tsx`, apagado depois.
      Deve acusar as regras indicadas:

      ```tsx
      import { FaBeer } from "react-icons/fa"

      export function Teste() {
        return (
          <div
            className="classe-inventada bg-red-500 p-2 p-4 text-[#333]"
            style={{ color: "red" }}
            onClick={() => null}
          >
            <FaBeer />
          </div>
        )
      }
      ```

      `check-file/filename-naming-convention`, `no-conflicting-classes`,
      `no-unknown-classes`, `no-restricted-classes` (duas vezes),
      `no-restricted-syntax`, `no-restricted-imports` e
      `jsx-a11y/click-events-have-key-events`. Se aparecer
      "Tailwind CSS is not installed", as regras de Tailwind estão desligadas.
- [ ] Teste do boundaries: um import de `components/` dentro de `lib/` gera erro.
- [ ] `apps/web` importa a API só com `import type`: um import de valor gera erro.
- [ ] Os dois `components.json` têm `iconLibrary: "lucide"` e o mesmo `style`
      e `baseColor`.
- [ ] Nenhuma outra lib de ícones no `package.json`.
- [ ] `.env.example` versionado; `.env` fora do git.
- [ ] `.coderabbit.yaml`, `.gitattributes`, `.socraticode.json`,
      `.github/workflows/ci.yml` e `DESIGN-SYSTEM.md` na raiz. `AGENTS.md` aponta para
      este arquivo.
- [ ] Skills e SocratiCode instalados; `codebase_status` mostra o índice do projeto.

---

## 11. Exceções e regras deste projeto

Preencha na cópia deste arquivo que fica no projeto. O resto do documento continua
igual ao padrão; o que é próprio do projeto (marca, telas, decisões) entra aqui.

| O padrão diz | Neste projeto | Motivo | Até quando |
|---|---|---|---|
| Pacotes com escopo `@workspace/*` | `@portfolio/*` | É o nome do projeto; a função de cada pacote é a mesma do padrão. | Permanente. |
| Tokens em três camadas (marca, semânticos, estados), em OKLCH, claro e escuro | Paleta Obsidiana e Sinal em hex, só escuro, com nomes próprios (`void`, `signal`...) apontados para os semânticos do shadcn | Visual aprovado. A marca nova sai do redesenho do currículo. Os tokens já moram no arquivo certo (`packages/ui/src/styles/globals.css`). | Redesenho do currículo. |
| Geist e Geist Mono, no máximo 2 famílias | Bricolage Grotesque, Inter e JetBrains Mono | Mesmo motivo: visual aprovado. | Redesenho do currículo. |
| Geist e Geist Mono, no máximo 2 famílias (redesenho) | Geist nos títulos e no texto, Geist Mono nos rótulos e **Anton só nos números grandes** | Escolha do Rodrigo em 24/11/2026: a Anton condensada dá o peso dos números de destaque. Bricolage Grotesque fica como alternativa para os títulos. | Permanente, enquanto os números de destaque existirem. |
| Claro e escuro com `next-themes` | Só escuro | Mesmo motivo. | Redesenho do currículo. |
| shadcn em `packages/ui`, estilo `radix-nova` | Em `apps/web/src/components/ui`, estilo `new-york` | A seção 4.3 proíbe trocar o estilo de projeto existente. Mover os componentes regenera todos, e isso vai junto com o redesenho. | Redesenho do currículo (fase 6). |
| Efeitos (partículas, brilho, gradiente) só com pedido explícito | Partículas em WebGL, cursor, granulado e brilho no currículo; scroll interativo com GSAP no redesenho | Pedido explícito do Rodrigo em 2026-11-18. | Permanente. |
| Animação com `tw-animate-css`; `motion` só com física ou gestos | `motion` e `lenis` no currículo; GSAP com ScrollTrigger no redesenho | Pedido explícito: landing com scroll interativo em GSAP. | Revisar no redesenho. |
| Stack sem biblioteca 3D | `three` e React Three Fiber em `packages/game` e `packages/gl` | O jogo e a cena do topo são 3D. | Permanente para o jogo. |
| Espelho de tokens fora do CSS | `packages/ui/src/styles/tokens.ts` repete as cores em hex | WebGL não lê CSS: o three.js precisa de número hexadecimal. | Enquanto houver cena WebGL. |
| Regras de tamanho e travas visuais como erro | Avisam nos arquivos listados com `legado()` em cada `eslint.config.js` (`packages/eslint-config/legado.js`) | Código anterior ao padrão. Arquivo novo segue o padrão inteiro. | O arquivo sai da lista quando for reescrito. |
| `no-param-reassign` com `props: true` | `props: false` em `packages/game` | O laço de quadros e a física mutam vetores do three de propósito, para não alocar objeto novo a cada quadro. | Até o jogo novo substituir o pacote. |
| Testes só com `bun test` | Ponta a ponta com Playwright em `apps/web/e2e`, inclusive o jogo | O jogo é o fluxo crítico do portfólio. Os testes do jogo dependem de CPU livre: em renderização por software, máquina carregada derruba o quadro por segundo e o personagem erra o alvo. | Permanente. |
