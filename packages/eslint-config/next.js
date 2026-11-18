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
            name: "@portfolio/api",
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
