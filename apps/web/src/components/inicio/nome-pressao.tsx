import { TextPressure } from "@/components/reactbits/text-pressure"

/**
 * Nome gigante da abertura com o TextPressure do React Bits: cada letra
 * engrossa e alarga conforme o mouse chega perto, ganhando o tom vinho. O
 * tamanho se ajusta à largura disponível. Parado ou sem mouse, uma onda
 * passa pelas letras; um clique solta uma onda a partir do ponto.
 */
export function NomePressao({ texto }: { texto: string }) {
  return (
    <TextPressure
      // Espaço comum some numa letra isolada; o rígido mantém a largura.
      text={texto.replaceAll(" ", " ")}
      fontFamily="var(--font-pressao)"
      fontUrl=""
      italic={false}
      idle="wave"
      pressureColor="#e0425f"
      minFontSize={36}
    />
  )
}
