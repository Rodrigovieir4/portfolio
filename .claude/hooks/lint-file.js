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
