/** @type {import("prettier").Config} */
export default {
  semi: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./packages/ui/src/styles/globals.css",
  tailwindFunctions: ["cn", "cva"],
}
