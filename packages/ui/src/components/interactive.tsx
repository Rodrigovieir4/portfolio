'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../cn';
import { FINE_POINTER, useMediaQuery } from '../use-media-query';

/**
 * Botao magnetico: o elemento e atraido pelo cursor quando ele chega perto.
 *
 * A mola e amortecida de proposito. Sem amortecimento o botao vibra em torno do
 * ponto de repouso e o efeito, que deveria ser agradavel, vira um tique nervoso.
 *
 * O deslocamento e puramente visual. A area clicavel real nao se move, entao a
 * acessibilidade por teclado e por toque continua intacta.
 */
export function Magnetic({
  children,
  className,
  strength = 0.32,
  radius = 90,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.42 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.42 });

  useEffect(() => {
    if (reduced) return;
    const element = ref.current;
    if (!element) return;

    function onPointerMove(event: PointerEvent) {
      const rect = element!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;

      if (Math.hypot(deltaX, deltaY) > radius + Math.max(rect.width, rect.height) / 2) {
        x.set(0);
        y.set(0);
        return;
      }

      x.set(deltaX * strength);
      y.set(deltaY * strength);
    }

    function onPointerLeave() {
      x.set(0);
      y.set(0);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    element.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduced, radius, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cursor customizado: um anel que persegue o ponteiro e cresce sobre elementos
 * interativos.
 *
 * Nao esconde o cursor nativo. Esconder e a origem daquele portfolio bonito em
 * que ninguem acha o que clicar, e some com o feedback do sistema em campos de
 * texto e links. Aqui o anel apenas acompanha.
 *
 * Nao monta em dispositivo de toque nem para quem pediu menos movimento.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  // Ponteiro fino significa mouse ou trackpad. Em tela de toque o anel seria
  // um enfeite parado no canto, entao a condicao e lida direto da media query
  // em vez de ser derivada dentro de um efeito.
  const finePointer = useMediaQuery(FINE_POINTER);
  const enabled = finePointer && !reduced;

  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.32 });
  const springY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.32 });

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as Element | null;
      setActive(Boolean(target?.closest('a, button, [role="button"], input, textarea, select')));
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden mix-blend-difference md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        animate={{
          width: active ? 44 : 22,
          height: active ? 44 : 22,
          opacity: active ? 0.95 : 0.55,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      />
    </motion.div>
  );
}

/**
 * Inclinacao 3D no hover, com brilho que segue o cursor.
 *
 * O perspective fica no container externo e a rotacao no interno. Aplicar os
 * dois no mesmo elemento faz a perspectiva ser recalculada a cada quadro e o
 * card parece dobrar em vez de girar.
 */
export function TiltCard({
  children,
  className,
  intensity = 9,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [intensity, -intensity]) as MotionValue<number>,
    { stiffness: 260, damping: 22 },
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-intensity, intensity]) as MotionValue<number>,
    { stiffness: 260, damping: 22 },
  );

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  return (
    <div className={cn('[perspective:1200px]', className)}>
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
