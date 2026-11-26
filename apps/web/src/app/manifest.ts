import type { MetadataRoute } from "next"

/**
 * Ícone na tela inicial do Android: a janela de terminal com "❯RV", a mesma
 * do favicon (app/icon.svg). O iPhone usa o app/apple-icon.png.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#121013",
    display: "browser",
    icons: [
      { sizes: "192x192", src: "/icones/icone-192.png", type: "image/png" },
      { sizes: "512x512", src: "/icones/icone-512.png", type: "image/png" },
    ],
    name: "Rodrigo Vieira",
    short_name: "Rodrigo",
    start_url: "/",
    theme_color: "#121013",
  }
}
