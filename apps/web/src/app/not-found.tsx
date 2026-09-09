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
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          background: '#050609',
          color: '#eef1f6',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>404</h1>
          <p style={{ color: '#7d8698', margin: '0 0 1.5rem' }}>
            Página não encontrada · Page not found · Página no encontrada
          </p>
          <a href="/pt" style={{ color: '#c8f751' }}>
            Ir para o início
          </a>
        </div>
      </body>
    </html>
  );
}
