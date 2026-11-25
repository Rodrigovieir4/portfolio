/* eslint-disable no-restricted-syntax -- fora do [locale] não há Tailwind */
import Link from "next/link"

/**
 * 404 global, para caminhos que nem chegam a ter idioma resolvido.
 *
 * Precisa das proprias tags html e body porque o layout raiz apenas repassa os
 * filhos, e neste ponto o layout de [locale] ainda nao entrou em cena.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(60% 60% at 50% 40%, #3d0913, #121013 70%)",
          color: "#f2e9dc",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1
            style={{ color: "#dc5a6f", fontSize: "4rem", margin: "0 0 0.5rem" }}
          >
            404
          </h1>
          <p style={{ color: "rgba(242,233,220,0.6)", margin: "0 0 1.5rem" }}>
            Página não encontrada · Page not found · Página no encontrada
          </p>
          <Link href="/pt" style={{ color: "#f2e9dc" }}>
            Ir para o início
          </Link>
        </div>
      </body>
    </html>
  )
}
