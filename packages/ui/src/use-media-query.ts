'use client';

import { useSyncExternalStore } from 'react';

/**
 * Le uma media query como fonte externa de verdade.
 *
 * useSyncExternalStore existe exatamente para isto: um valor que vive fora do
 * React e muda por conta propria. Comparado a dupla useState mais useEffect, o
 * valor correto ja chega na primeira renderizacao do cliente, sem o quadro
 * intermediario em que o componente aparece com o estado errado.
 *
 * No servidor a resposta e sempre `false`, entao o HTML gerado assume o caso
 * mais conservador e nunca desencontra da hidratacao.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Ponteiro fino significa mouse ou trackpad, nunca tela de toque. */
export const FINE_POINTER = '(pointer: fine)';
