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
