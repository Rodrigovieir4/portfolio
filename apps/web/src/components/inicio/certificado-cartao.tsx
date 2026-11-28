"use client"

import { Button } from "@portfolio/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@portfolio/ui/components/dialog"
import Image from "next/image"

import { cn } from "@/lib/utils"

export interface Certificado {
  ano: string
  /** Primeira página do PDF, em public/certificados/capas. */
  capa: null | string
  categoria: string
  /** Mês e ano de emissão, por extenso ("dezembro de 2023"). */
  data: string
  emissor: string
  horas: null | number
  id: string
  link: null | string
  nome: string
  sobre: null | string
  topicos: string[]
}

export interface RotulosCartao {
  abrir: string
  abrirPdf: string
  aprendi: string
}

/**
 * O cartão é só a foto do certificado, sem borda (pedido do Rodrigo, 27/11):
 * embaçada e escurecida, com o emissor e o nome por cima. No hover, ou com o
 * foco do teclado, a foto desembaça e o texto some. No celular, sem hover,
 * fica embaçada com o texto e em pé, para o nome caber.
 */
function Capa({ item }: { item: Certificado }) {
  return (
    <span
      className={cn(
        "relative block aspect-3/4 overflow-hidden rounded-2xl sm:aspect-4/3",
        // Só sem foto: com ela, o fundo vazava pelas bordas desfocadas e
        // desenhava uma bordinha clara nos cantos.
        !item.capa && "bg-muted",
      )}
    >
      {item.capa ? (
        // A foto fica 2 px para dentro: na borda do cartão só há o véu, e a
        // foto não aparece pela borda suavizada dele como um fio claro.
        <span className="absolute inset-0.5 overflow-hidden rounded-2xl">
          <Image
            src={item.capa}
            alt=""
            fill
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="scale-110 object-cover blur-sm transition duration-500 group-hover/card:scale-100 group-hover/card:blur-none group-focus-visible/card:scale-100 group-focus-visible/card:blur-none"
          />
        </span>
      ) : null}
      <span className="absolute inset-0 flex flex-col justify-end gap-2 bg-linear-to-t from-background via-background/70 to-background/30 p-4 transition duration-500 group-hover/card:opacity-0 group-focus-visible/card:opacity-0 sm:p-5">
        <span className="font-mono text-xs text-muted-foreground">
          {item.emissor}
          {item.ano ? ` · ${item.ano}` : ""}
        </span>
        <span className="text-base font-semibold tracking-tight text-pretty sm:text-lg">
          {item.nome}
        </span>
      </span>
    </span>
  )
}

/**
 * A janela do certificado: a foto inteira de um lado e, do outro, o que o
 * curso ensinou e o botão para o PDF.
 */
function Detalhe({
  item,
  rotulos,
}: {
  item: Certificado
  rotulos: RotulosCartao
}) {
  const meta = [item.emissor, item.data, item.horas ? `${item.horas} h` : ""]
  return (
    // De 1280 px para cima a foto dita a altura da janela (h-0 + min-h-full:
    // o texto não estica a linha da grade). Abaixo disso, foto e texto se
    // empilham: a coluna de texto ficaria estreita e rolaria.
    <div className="flex flex-col gap-3 p-6 xl:col-span-2 xl:h-0 xl:min-h-full xl:overflow-y-auto">
      <p className="font-mono text-xs text-muted-foreground">
        {meta.filter(Boolean).join(" · ")}
      </p>
      <DialogTitle className="text-2xl leading-tight font-semibold tracking-tight text-balance">
        {item.nome}
      </DialogTitle>
      {item.sobre ? (
        <DialogDescription className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {item.sobre}
        </DialogDescription>
      ) : null}
      {item.topicos.length > 0 ? (
        <div className="mt-1 flex flex-col gap-2">
          <h3 className="font-mono text-xs text-vinho-claro uppercase">
            {rotulos.aprendi}
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm">
            {item.topicos.map((topico) => (
              <li key={topico} className="flex gap-3">
                <span aria-hidden className="text-vinho-claro">
                  ›
                </span>
                {topico}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {item.link ? (
        <Button
          asChild
          variant="vinho"
          size="pilula"
          className="mt-2 self-start"
        >
          <a href={item.link} target="_blank" rel="noreferrer">
            {rotulos.abrirPdf} ↗
          </a>
        </Button>
      ) : null}
    </div>
  )
}

/** Um certificado na grade: o cartão abre a janela com o que foi aprendido. */
export function Cartao({
  item,
  rotulos,
}: {
  item: Certificado
  rotulos: RotulosCartao
}) {
  return (
    <li>
      <Dialog>
        <DialogTrigger
          aria-label={`${rotulos.abrir}: ${item.nome}`}
          className="group/card block w-full cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-vinho-claro"
        >
          <Capa item={item} />
        </DialogTrigger>
        <DialogContent className="max-h-dvh gap-0 overflow-y-auto p-0 sm:max-w-3xl xl:max-w-6xl xl:grid-cols-5">
          {item.capa ? (
            // A foto na proporção do certificado, sem faixas; abre o PDF.
            <a
              href={item.link ?? item.capa}
              target="_blank"
              rel="noreferrer"
              aria-label={rotulos.abrirPdf}
              className="block xl:col-span-3"
            >
              <Image
                src={item.capa}
                alt={item.nome}
                width={800}
                height={566}
                sizes="(min-width: 1280px) 42rem, 48rem"
                className="h-auto w-full"
              />
            </a>
          ) : null}
          <Detalhe item={item} rotulos={rotulos} />
        </DialogContent>
      </Dialog>
    </li>
  )
}
