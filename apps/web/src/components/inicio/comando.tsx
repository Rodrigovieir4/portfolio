import { cn } from "@/lib/utils"

/**
 * Comando de terminal acima do título de cada seção, no mesmo desenho do
 * prompt do cabeçalho: a seta em vinho, o comando e o cursor fino. O
 * movimento.tsx digita o comando quando a seção entra na tela; sem movimento,
 * ele já aparece inteiro. É enfeite: o título da seção é que tem o conteúdo.
 * Sobre fundo vinho (`sobreVinho`), seta e cursor ficam claros.
 */
export function Comando({
  className,
  sobreVinho = false,
  texto,
}: {
  className?: string
  sobreVinho?: boolean
  texto: string
}) {
  return (
    <p
      aria-hidden
      data-mov="comando"
      className={cn("font-mono text-sm text-muted-foreground", className)}
    >
      <span className={sobreVinho ? "text-foreground" : "text-vinho-claro"}>
        ❯
      </span>{" "}
      <span data-texto={texto}>{texto}</span>
      <span
        data-cursor-comando
        className={cn(
          "ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em]",
          sobreVinho ? "bg-foreground" : "bg-vinho-claro",
        )}
      />
    </p>
  )
}
