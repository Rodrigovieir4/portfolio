'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../cn';

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors',
  {
    variants: {
      tone: {
        signal: 'border-signal/30 bg-signal/8 text-signal',
        plasma: 'border-plasma/30 bg-plasma/10 text-plasma',
        ember: 'border-ember/30 bg-ember/10 text-ember',
        cyan: 'border-cyan/30 bg-cyan/10 text-cyan',
        neutral: 'border-line bg-elevated/60 text-muted',
      },
      size: {
        sm: 'px-2.5 py-1',
        md: 'px-3.5 py-1.5 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
);

export interface BadgeProps
  extends VariantProps<typeof badgeStyles>, React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Badge({ children, className, tone, size, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone, size }), className)} {...rest}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Ponto de status pulsante                                                   */
/* -------------------------------------------------------------------------- */

export function StatusDot({ active = true }: { active?: boolean }) {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
      )}
      <span
        className={cn(
          'relative inline-flex h-2 w-2 rounded-full',
          active ? 'bg-signal' : 'bg-muted',
        )}
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Cabecalho de secao                                                         */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
        <span className="text-signal">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>

      <h2 className="font-display text-[length:var(--text-fluid-xl)] leading-[1.06] font-semibold tracking-tight text-ink">
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-[length:var(--text-fluid-base)] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Contador animado                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Conta de zero ate o valor quando entra na tela.
 *
 * Usa `animate` imperativo em vez de estado por quadro: escrever direto no
 * textContent evita uma re-renderizacao do React a cada frame, o que numa fila
 * de quatro contadores simultaneos ja aparece no perfil de performance.
 */
export function Counter({
  value,
  suffix = '',
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (reduced) {
      node.textContent = `${value}${suffix}`;
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, value, suffix, duration, reduced]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      0{suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Faixa em rolagem continua.
 *
 * O conteudo e duplicado e a animacao percorre exatamente metade da largura,
 * entao no instante em que reinicia a segunda copia esta no lugar da primeira e
 * a emenda fica invisivel.
 */
export function Marquee({
  children,
  speed = 34,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn('flex gap-8 overflow-x-auto', className)}>
        <div className="flex shrink-0 items-center gap-8">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative flex overflow-hidden', className)}
      // A mascara dissolve as pontas, para o texto nao ser cortado a faca na
      // borda da tela.
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Barra de progresso do scroll                                               */
/* -------------------------------------------------------------------------- */

export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      className={cn('fixed inset-x-0 top-0 z-50 h-px bg-transparent', className)}
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-signal via-cyan to-plasma transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Grao                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Camada de grao sobre a pagina inteira.
 *
 * E um SVG de ruido fractal embutido como data URI, nao uma imagem: pesa alguns
 * bytes, escala em qualquer resolucao e nao gera requisicao. O grao tira o
 * aspecto plastico dos gradientes grandes e amarra o WebGL ao HTML, porque os
 * dois passam a dividir a mesma textura.
 */
export function Grain({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
