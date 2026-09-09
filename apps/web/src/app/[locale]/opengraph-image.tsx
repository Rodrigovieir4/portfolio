import { profile, t as translate, type Locale } from '@portfolio/content';
import { ImageResponse } from 'next/og';

import { routing } from '@/i18n/routing';

/**
 * Cartão Open Graph, um por idioma.
 *
 * É a primeira coisa que aparece quando o link é colado no LinkedIn, no
 * WhatsApp ou no Slack. Sem ele, o compartilhamento vira um retângulo cinza com
 * uma URL, que é o oposto do que um portfólio deveria provocar.
 *
 * A imagem é gerada no build e servida como arquivo estático. Nada é renderizado
 * em tempo de requisição.
 *
 * O layout é escrito com um subconjunto de CSS: o motor por trás do
 * ImageResponse não tem navegador, então nada de grid, de porcentagem em
 * transform, nem de fonte variável. Flexbox, cor sólida e tamanho absoluto
 * cobrem tudo que este cartão precisa.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Rodrigo Vieira de Sousa — Desenvolvedor Full-Stack';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const headline = translate(profile.headline, locale as Locale);
  const tagline = translate(profile.tagline, locale as Locale);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#050609',
        padding: '72px 80px',
        // Duas luzes de canto, que evitam o retangulo preto chapado.
        backgroundImage:
          'radial-gradient(900px 500px at 88% 8%, rgba(123,92,255,0.20), transparent 62%), radial-gradient(760px 460px at 6% 96%, rgba(200,247,81,0.16), transparent 60%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor: '#c8f751',
            color: '#050609',
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          R
        </div>
        <div
          style={{
            display: 'flex',
            color: '#7d8698',
            fontSize: 22,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {headline}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div
          style={{
            display: 'flex',
            color: '#eef1f6',
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          {profile.name}
        </div>

        <div style={{ display: 'flex', width: 132, height: 5, backgroundColor: '#c8f751' }} />

        <div style={{ display: 'flex', color: '#b6bdcb', fontSize: 32, lineHeight: 1.3 }}>
          {tagline}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#4d5567',
          fontSize: 24,
        }}
      >
        <div style={{ display: 'flex' }}>github.com/Rodrigovieir4</div>
        {/* Localização em vez de repetir o nome, que já domina o cartão. */}
        <div style={{ display: 'flex' }}>
          {profile.location.city}, {profile.location.country}
        </div>
      </div>
    </div>,
    size,
  );
}
