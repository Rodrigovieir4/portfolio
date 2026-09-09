import { certifications, t as translate, type Locale } from '@portfolio/content';
import { Badge, Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { FileText } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

export async function Certificates() {
  const t = await getTranslations('certificates');
  const locale = (await getLocale()) as Locale;

  return (
    <section id="certificates" className="relative border-t border-line/60 section-spacing">
      <div className="container-wide flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            index="05"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <RevealGroup className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" stagger={0.05}>
          {certifications.map((certificate) => {
            const label = translate(certificate.name, locale);
            const Wrapper = certificate.file ? 'a' : 'div';

            return (
              <RevealItem key={certificate.id}>
                <Wrapper
                  {...(certificate.file
                    ? {
                        href: certificate.file,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': `${t('open')}: ${label}`,
                      }
                    : {})}
                  className="group flex h-full items-start gap-4 rounded-lg border border-line bg-surface/50 p-5 transition-colors hover:border-signal/40 hover:bg-surface"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-elevated text-muted transition-colors group-hover:border-signal/40 group-hover:text-signal">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm leading-snug font-medium text-ink">{label}</h3>
                    <p className="text-xs text-muted">{certificate.issuer}</p>
                    <Badge tone={certificate.category === 'academico' ? 'plasma' : 'neutral'}>
                      {t(`categories.${certificate.category}`)}
                    </Badge>
                  </div>
                </Wrapper>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
