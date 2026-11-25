import { type Case, type Locale, t as traduzir } from "@portfolio/content"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface Props {
  caso: Case
  destaque?: boolean
  emBreve: string
  locale: Locale
}

export function CartaoCaso({ caso, destaque, emBreve, locale }: Props) {
  return (
    <Link
      href={{ params: { slug: caso.slug }, pathname: "/casos/[slug]" }}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-vinho-claro",
        destaque && "border-vinho-claro",
        // O carrossel em arco marca o cartão do centro com .ativo no <li>.
        "in-[.ativo]:border-vinho-claro",
      )}
    >
      <div className="mb-3 flex aspect-video w-full items-end rounded-xl bloco-vinho p-3">
        <span className="font-mono text-xs">{emBreve}</span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-balance">
        {traduzir(caso.title, locale)}
      </h3>
      <p className="text-sm text-pretty text-muted-foreground">
        {traduzir(caso.summary, locale)}
      </p>
      <p className="mt-auto font-mono text-xs text-muted-foreground">
        {caso.stack.join(" · ")}
      </p>
    </Link>
  )
}
