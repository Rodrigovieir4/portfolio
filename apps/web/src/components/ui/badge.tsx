import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

/**
 * Badge do shadcn/ui, estendido com as cores de acento do projeto.
 *
 * As variantes de cima são as que vieram do gerador. As de baixo, agrupadas em
 * `tone`, são as do tema Obsidiana e existem porque cada grupo de stack e cada
 * projeto tem um acento próprio, e o badge precisa acompanhar.
 *
 * Manter as duas dimensões separadas evita o vício comum de sobrescrever a cor
 * por className solto no meio da página: quem chama declara a intenção, e a
 * definição da cor continua morando num lugar só.
 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive: 'bg-destructive text-white focus-visible:ring-destructive/20',
        outline: 'border-border text-foreground [a&]:hover:bg-accent',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
      tone: {
        none: '',
        signal: 'border-signal/30 bg-signal/10 text-signal',
        plasma: 'border-plasma/30 bg-plasma/10 text-plasma',
        ember: 'border-ember/30 bg-ember/10 text-ember',
        cyan: 'border-cyan/30 bg-cyan/10 text-cyan',
        neutral: 'border-line bg-elevated/60 text-muted-foreground',
      },
      size: {
        sm: 'px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase',
        md: 'px-3.5 py-1.5 font-mono text-xs tracking-[0.14em] uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
      tone: 'none',
      size: 'sm',
    },
  },
);

function Badge({
  className,
  variant,
  tone,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  // Um tom de acento substitui a variante base, senão as duas pintariam fundo
  // e a cor do shadcn venceria a nossa por ordem de declaração.
  const resolvedVariant = tone && tone !== 'none' ? undefined : (variant ?? 'default');

  return (
    <Comp
      data-slot="badge"
      data-tone={tone}
      className={cn(badgeVariants({ variant: resolvedVariant, tone, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
