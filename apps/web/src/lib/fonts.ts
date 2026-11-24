import { Anton, Geist, Geist_Mono } from "next/font/google"

/**
 * Tres familias com papeis distintos (redesenho de 24/11/2026):
 *   Geist       titulos e texto corrido
 *   Geist Mono  rotulos pequenos, datas e metadados
 *   Anton       so os numeros grandes de destaque
 *
 * `display: 'swap'` mostra o texto na fonte do sistema enquanto a definitiva
 * carrega, e nunca invisivel.
 */

export const fontSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
})

export const fontMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const fontNumeros = Anton({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
})

export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontNumeros.variable}`
