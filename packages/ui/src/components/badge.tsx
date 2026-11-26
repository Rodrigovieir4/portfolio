import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

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
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      tone: {
        none: "",
        signal: "border-signal/30 bg-signal/10 text-signal",
        plasma: "border-plasma/30 bg-plasma/10 text-plasma",
        ember: "border-ember/30 bg-ember/10 text-ember",
        cyan: "border-cyan/30 bg-cyan/10 text-cyan",
        neutral: "border-line bg-elevated/60 text-muted-foreground",
      },
      size: {
        default: "",
        sm: "h-auto px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase",
        md: "h-auto px-3.5 py-1.5 font-mono text-xs tracking-[0.14em] uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "none",
      // O padrão antigo do projeto: rótulo mono pequeno, em caixa alta.
      size: "sm",
    },
  },
)

function Badge({
  className,
  variant,
  tone,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  // Um tom de acento substitui a variante base, senão as duas pintariam fundo
  // e a cor do shadcn venceria a nossa por ordem de declaração.
  const variante = tone && tone !== "none" ? undefined : (variant ?? "default")

  return (
    <Comp
      data-slot="badge"
      data-variant={variante}
      data-tone={tone}
      className={cn(
        badgeVariants({ size, tone, variant: variante }),
        className,
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
