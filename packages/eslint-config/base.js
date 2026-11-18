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
