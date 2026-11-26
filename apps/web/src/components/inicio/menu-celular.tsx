"use client"

import { useState } from "react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "@/i18n/navigation"

import { Idiomas } from "./idiomas"

type Rota = "/casos" | "/ideias" | "/projetos" | "/sobre"

interface Props {
  fechar: string
  menu: string
  paginas: { rota: Rota; rotulo: string }[]
}

const ITEM =
  "block py-2 text-5xl font-semibold tracking-tight transition-colors hover:text-vinho-claro"

/**
 * Menu do celular: tela cheia vinda de cima, com os mesmos destinos do
 * cabeçalho. Cada link fecha o menu, porque o cabeçalho vive no layout e não
 * desmonta quando a página troca.
 */
export function MenuCelular({ fechar, menu, paginas }: Props) {
  const [aberto, setAberto] = useState(false)

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger className="justify-self-end font-mono text-sm md:hidden">
        {menu}
      </SheetTrigger>
      <SheetContent
        side="top"
        showCloseButton={false}
        aria-describedby={undefined}
        className="h-dvh gap-0 border-none px-4 pt-4 pb-10"
      >
        <div className="flex h-12 items-center justify-between">
          <SheetTitle className="font-mono text-sm font-normal">
            {menu}
          </SheetTitle>
          <SheetClose className="font-mono text-sm">{fechar}</SheetClose>
        </div>
        <nav className="mt-10 flex-1">
          <ul className="flex flex-col gap-2">
            {paginas.map(({ rota, rotulo }) => (
              <li key={rota}>
                <SheetClose asChild>
                  <Link href={rota} className={ITEM}>
                    {rotulo}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <Idiomas />
      </SheetContent>
    </Sheet>
  )
}
