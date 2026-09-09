import { Badge } from '@/components/ui/badge';
import { experiences, t as translate, type Locale } from '@portfolio/content';
import { Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { getLocale, getTranslations } from 'next-intl/server';

const KIND_TONE: Record<string, 'signal' | 'plasma' | 'ember' | 'cyan' | 'neutral'> = {
  work: 'signal',
  education: 'plasma',
  athletics: 'ember',
  project: 'cyan',
  certification: 'neutral',
};

const MONTHS: Record<Locale, string[]> = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};

/**
 * Formata "2025-02" como "fev 2025".
 *
 * Feito na mao em vez de Intl.DateTimeFormat porque a data e so ano e mes:
 * construir um Date completo introduziria um dia e um fuso que nao existem no
 * dado, e a virada de fuso poderia empurrar o mes para tras.
 */
function formatYearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  return `${MONTHS[locale][index] ?? month} ${year}`;
}

export async function Journey() {
  const t = await getTranslations('journey');
  const locale = (await getLocale()) as Locale;

  return (
    <section id="journey" className="relative border-t border-line/60 section-spacing">
      <div className="container-wide flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <RevealGroup className="relative flex flex-col" stagger={0.1}>
          {/*
            O trilho e um pseudo-elemento de largura fixa atras dos cartoes.
            Fica escondido de leitores de tela porque a ordem da lista ja
            comunica a sequencia.
          */}
          <div
            className="absolute top-2 bottom-0 left-[7px] w-px bg-gradient-to-b from-signal/70 via-line-strong to-transparent md:left-[9px]"
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-10">
            {experiences.map((item) => (
              <li key={item.id}>
                <RevealItem>
                  <article className="relative grid gap-3 pl-8 md:pl-12">
                    <span
                      className="absolute top-1.5 left-0 grid h-4 w-4 place-items-center rounded-full border border-line-strong bg-void md:h-5 md:w-5"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <time className="font-mono text-xs tracking-[0.12em] text-signal uppercase">
                        {formatYearMonth(item.start, locale)}
                        {' — '}
                        {item.end ? formatYearMonth(item.end, locale) : t('present')}
                      </time>
                      <Badge tone={KIND_TONE[item.kind] ?? 'neutral'}>
                        {t(`kinds.${item.kind}`)}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-xl leading-tight font-semibold text-ink">
                        {translate(item.role, locale)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.organizationUrl ? (
                          <a
                            href={item.organizationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-signal"
                          >
                            {item.organization}
                          </a>
                        ) : (
                          item.organization
                        )}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>

                    <p className="max-w-2xl leading-relaxed text-ink-soft">
                      {translate(item.summary, locale)}
                    </p>

                    <ul className="flex max-w-2xl flex-col gap-1.5 pt-1">
                      {translate(item.highlights, locale).map((highlight, index) => (
                        <li key={index} className="flex gap-2.5 text-sm text-muted-foreground">
                          <span
                            className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-line-strong"
                            aria-hidden="true"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {item.stack.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 pt-1">
                        {item.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded border border-line bg-elevated/50 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </RevealItem>
              </li>
            ))}
          </ol>
        </RevealGroup>
      </div>
    </section>
  );
}
