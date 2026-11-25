/**
 * Abertura de entrada: contador de 0 a 100 com o nome, e a cortina sobe.
 *
 * O movimento é todo em CSS (globals.css, seção "abertura com contador").
 * O script em linha roda antes da cortina ser pintada: na segunda página
 * vista na mesma sessão, marca o <html> e a cortina nem aparece.
 */
const MARCAR_SESSAO = [
  "try{",
  'if(sessionStorage.getItem("intro"))',
  'document.documentElement.dataset.intro="visto";',
  'sessionStorage.setItem("intro","1")',
  "}catch(e){}",
].join("")

export function Intro({ nome }: { nome: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MARCAR_SESSAO }} />
      <div
        aria-hidden
        className="fixed inset-0 z-50 intro flex flex-col items-center justify-center gap-6 bg-background"
      >
        <span className="intro-numero font-numeros text-8xl leading-none tabular-nums md:text-9xl" />
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {nome}
        </span>
        <span className="h-px w-48 intro-linha bg-vinho-claro" />
      </div>
    </>
  )
}
