import { type Case, type Locale, t as traduzir } from "@portfolio/content"
import { Card } from "@portfolio/ui/components/card"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface Props {
  caso: Case
  emBreve: string
  locale: Locale
}

export function CartaoCaso({ caso, emBreve, locale }: Props) {
  return (
    <Card asChild variant="contorno" className={cn("h-full gap-3 p-6")}>
      <Link href={{ params: { slug: caso.slug }, pathname: "/casos/[slug]" }}>
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
    </Card>
  )
}
