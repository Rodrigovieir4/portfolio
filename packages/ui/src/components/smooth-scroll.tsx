'use client';

import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';

/**
 * O contexto guarda um getter, nao a instancia.
 *
 * A instancia so existe depois que o efeito roda no navegador. Guardar ela em
 * estado obrigaria uma renderizacao extra da arvore inteira so para publicar um
 * objeto que ninguem desenha. Como o Lenis e usado apenas de forma imperativa,
 * dentro de manipuladores de evento, um getter estavel entrega o mesmo acesso
 * sem custo de renderizacao.
 */
const LenisContext = createContext<() => Lenis | null>(() => null);

/** Da acesso a instancia do Lenis, para rolar ate uma ancora programaticamente. */
export function useLenis(): () => Lenis | null {
  return useContext(LenisContext);
}

/**
 * Rolagem suave por interpolacao.
 *
 * O Lenis intercepta a roda do mouse e anima a posicao, em vez de aplicar o
 * salto do navegador. O ganho nao e so estetico: com a posicao mudando de forma
 * continua, as animacoes atreladas ao scroll param de tremer.
 *
 * Duas ressalvas tratadas aqui:
 *   - quem pediu menos movimento fica com a rolagem nativa, sem interceptacao;
 *   - o autoRaf fica desligado e o Lenis roda no proprio requestAnimationFrame,
 *     para o clique em ancora e o React compartilharem o mesmo relogio.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const instanceRef = useRef<Lenis | null>(null);
  // useCallback, e nao useRef: ler ref.current durante a renderizacao e
  // proibido no React 19, e este getter precisa existir ja na montagem do
  // Provider. O array vazio garante que a referencia nunca muda, entao os
  // consumidores do contexto nao re-renderizam a toa.
  const getInstance = useCallback(() => instanceRef.current, []);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.05,
      // Curva exponencial: arranca rapido e assenta devagar, que e o
      // comportamento que o olho le como "peso".
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      // Toque continua nativo. Interceptar rolagem em celular briga com o
      // gesto do sistema e sempre sai pior.
      syncTouch: false,
      autoRaf: false,
    });

    instanceRef.current = instance;

    let frameId = 0;
    function raf(time: number) {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      instance.destroy();
      instanceRef.current = null;
    };
  }, [reduced]);

  return <LenisContext.Provider value={getInstance}>{children}</LenisContext.Provider>;
}
