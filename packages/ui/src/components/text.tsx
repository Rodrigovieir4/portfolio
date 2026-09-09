'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '../cn';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

export interface SplitTextProps {
  text: string;
  className?: string;
  /** Intervalo entre a entrada de cada palavra. */
  stagger?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Revela um titulo palavra por palavra, cada uma subindo de tras de uma mascara.
 *
 * Divide por palavra, nao por caractere, de proposito: quebrar letra a letra
 * destroi a leitura para quem usa leitor de tela e piora a quebra de linha em
 * telas estreitas. O texto completo continua no DOM, so a apresentacao e que e
 * fatiada.
 */
export function SplitText({
  text,
  className,
  stagger = 0.045,
  delay = 0,
  as: Tag = 'span',
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <Tag className={cn(className)}>{text}</Tag>;
  }

  return (
    <Tag className={cn(className)} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            // A mascara precisa de overflow escondido e de folga vertical, senao
            // acentos e descidas de letra ficam cortados.
            className="inline-block overflow-hidden py-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '110%', opacity: 0 },
                visible: {
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Efeito de decodificacao: o texto chega embaralhado e vai se resolvendo da
 * esquerda para a direita, como um terminal decifrando uma string.
 *
 * O valor final fica em um elemento visualmente escondido para leitores de tela,
 * enquanto a animacao roda em um irmao marcado como aria-hidden. Assim ninguem
 * ouve caractere aleatorio.
 */
export function ScrambleText({
  text,
  className,
  speed = 32,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  const [scrambled, setScrambled] = useState('');
  const frame = useRef(0);

  // Quem pediu menos movimento ve o texto final direto. Isso e derivado na
  // renderizacao em vez de escrito no estado por um efeito, entao nao existe
  // um quadro intermediario com o valor errado.
  const display = reduced ? text : scrambled;

  useEffect(() => {
    if (reduced) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      frame.current = 0;
      intervalId = setInterval(() => {
        frame.current += 1;
        // Cada caractere leva ~2 quadros para travar. Antes disso mostra lixo.
        const settled = Math.floor(frame.current / 2);

        setScrambled(
          text
            .split('')
            .map((char, index) => {
              if (index < settled || char === ' ') return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char;
            })
            .join(''),
        );

        if (settled >= text.length && intervalId) clearInterval(intervalId);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay, reduced]);

  return (
    <span className={cn('tabular-nums', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || ' '}</span>
    </span>
  );
}
