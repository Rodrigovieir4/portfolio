import { setRequestLocale } from 'next-intl/server';

import { About } from '@/components/sections/about';
import { Certificates } from '@/components/sections/certificates';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Journey } from '@/components/sections/journey';
import { Projects } from '@/components/sections/projects';
import { Skills } from '@/components/sections/skills';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Pagina unica, em secoes.
 *
 * A ordem conta uma historia: quem e a pessoa, com o que ela trabalha, como
 * chegou ate aqui, o que ja entregou, o que estudou e como falar com ela.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Journey />
      <Projects />
      <Certificates />
      <Contact />
    </>
  );
}
