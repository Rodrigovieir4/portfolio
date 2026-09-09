import { profile, stats, t as translate, type Locale } from '@portfolio/content';
import { Counter, Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { getLocale, getTranslations } from 'next-intl/server';

export async function About() {
  const t = await getTranslations('about');
  const locale = (await getLocale()) as Locale;
  const bio = translate(profile.bio, locale);

  return (
    <section id="about" className="relative border-t border-line/60 section-spacing">
      <div className="container-wide grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading index="01" eyebrow={t('eyebrow')} title={t('title')} />
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
                  <span className="font-mono text-[0.65rem] leading-tight tracking-[0.1em] text-muted uppercase">
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
