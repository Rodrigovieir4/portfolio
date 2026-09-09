'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

import { cn } from '../cn';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Fracao do elemento que precisa aparecer para disparar. */
  amount?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

/**
 * Revela o conteudo quando ele entra na viewport.
 *
 * `once: true` e deliberado. Animar de novo a cada subida e descida da pagina
 * chama atencao para o efeito em vez de para o conteudo, e cansa rapido em
 * leitura longa.
 *
 * Quem pediu menos movimento no sistema recebe o conteudo ja posicionado, sem
 * deslocamento nenhum, apenas a opacidade resolvida.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = reduced ? OFFSET.none : OFFSET[direction];
  const Component = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reduced ? 0.01 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </Component>
  );
}

/**
 * Container que escalona os filhos.
 *
 * Use junto de RevealItem: o pai controla o intervalo entre as entradas e cada
 * filho so declara que participa. Evita ter que calcular delay manual item a
 * item, que sempre sai errado quando a lista muda de tamanho.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: reduced ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  const reduced = useReducedMotion();
  const offset = reduced ? OFFSET.none : OFFSET[direction];

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: reduced ? 0.01 : 0.62, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
