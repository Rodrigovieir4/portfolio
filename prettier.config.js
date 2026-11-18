/** @type {import("prettier").Config} */
export default {
  semi: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./apps/web/src/app/globals.css",
  tailwindFunctions: ["cn", "cva"],
}
