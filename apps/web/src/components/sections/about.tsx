import { profile, stats, t as translate, type Locale } from '@portfolio/content';
import { Counter, Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function About() {
  const t = await getTranslations('about');
  const locale = (await getLocale()) as Locale;
  const bio = translate(profile.bio, locale);

  return (
    <section id="about" className="relative border-t border-line/60 section-spacing">
      <div className="container-wide grid gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <Reveal>
            <SectionHeading index="01" eyebrow={t('eyebrow')} title={t('title')} />
          </Reveal>

          <Reveal delay={0.1} direction="right">
            <figure className="relative w-full max-w-xs">
              {/* Moldura deslocada atrás da foto: dá profundidade sem recorrer
                  a sombra pesada, e amarra o retrato ao acento do tema. */}
              <div
                className="absolute -right-3 -bottom-3 h-full w-full rounded-lg border border-signal/30"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={520}
                  height={640}
                  // Fica abaixo da dobra, então carrega em segundo plano e não
                  // disputa banda com o hero.
                  loading="lazy"
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="h-auto w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60"
                  aria-hidden="true"
                />
              </div>

              <figcaption className="mt-4 font-mono text-[0.65rem] tracking-[0.14em] text-faint uppercase">
                {profile.location.city}, {profile.location.state} · {profile.location.country}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="flex flex-col gap-12 lg:col-span-7">
          <RevealGroup className="flex flex-col gap-6" stagger={0.12}>
            {bio.map((paragraph, index) => (
              <RevealItem key={index}>
                <p
                  className={
                    index === 0
                      ? 'text-[length:var(--text-fluid-lg)] leading-snug text-ink'
                      : 'text-[length:var(--text-fluid-base)] leading-relaxed text-ink-soft'
                  }
                >
                  {paragraph}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-1.5 bg-abyss p-5">
                  <span className="font-display text-3xl font-semibold text-signal">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="font-mono text-[0.65rem] leading-tight tracking-[0.1em] text-muted-foreground uppercase">
                    {translate(stat.label, locale)}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
