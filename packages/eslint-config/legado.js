/**
 * Código escrito antes do padrão.
 *
 * Nos arquivos listados, as regras de tamanho e as travas visuais avisam em vez
 * de barrar. Arquivo novo segue o padrão inteiro. Quem mexer num arquivo da
 * lista corrige o que tocar e, quando zerar, tira o arquivo da lista.
 * Registrado no DESIGN-SYSTEM.md, seção 11.
 *
 * @param {string[]} files
 * @returns {import("eslint").Linter.Config}
 */
export function legado(files) {
  return {
    files,
    rules: {
      "@stylistic/max-len": "warn",
      "@typescript-eslint/max-params": "warn",
      "better-tailwindcss/no-restricted-classes": "warn",
      "max-lines-per-function": "warn",
      "no-restricted-syntax": "warn",
    },
  }
}
