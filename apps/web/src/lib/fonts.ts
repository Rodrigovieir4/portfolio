import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Tres familias com papeis distintos:
 *   display  titulos, com a personalidade do site
 *   sans     texto corrido, escolhida por legibilidade em bloco
 *   mono     rotulos tecnicos, datas e numeros
 *
 * Todas sao variaveis, entao os pesos intermediarios saem de um unico arquivo
 * em vez de um download por peso. `display: 'swap'` garante que o texto apareca
 * na fonte do sistema enquanto a definitiva carrega, e nunca invisivel.
 */

export const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
