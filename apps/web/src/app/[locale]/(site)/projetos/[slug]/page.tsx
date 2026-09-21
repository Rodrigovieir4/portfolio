import { Badge } from '@/components/ui/badge';
import { projectBySlug, projects, t as translate, type Locale } from '@portfolio/content';
import { GithubIcon, Reveal, SplitText } from '@portfolio/ui';
import { ArrowLeft, ExternalLink, Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

type Params = { locale: string; slug: string };

/** Gera as tres traducoes de cada projeto no build. Nenhuma renderiza sob demanda. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectBySlug(slug);

  if (!project) return {};

  const summary = translate(project.summary, locale as Locale);

  return {
    title: project.name,
    description: summary,
    alternates: { canonical: `${siteUrl}/${locale}/projetos/${slug}` },
    openGraph: {
      type: 'article',
      title: project.name,
      description: summary,
      url: `${siteUrl}/${locale}/projetos/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = projectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations('projects');
  const typedLocale = locale as Locale;

  return (
    <article className="pt-32 pb-24 lg:pt-40">
      <div className="container-content flex flex-col gap-12">
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-signal"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          {t('backToProjects')}
        </Link>

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={project.status === 'live' ? 'signal' : 'neutral'}>
              {t(`status.${project.status}`)}
            </Badge>
            <span className="font-mono text-[0.65rem] tracking-[0.14em] text-faint uppercase">
              {project.year}
            </span>
          </div>

          <h1 className="font-display text-[length:var(--text-fluid-2xl)] leading-[0.95] font-bold tracking-[-0.03em] text-ink">
            <SplitText text={project.name} as="span" />
          </h1>

          <p className="max-w-2xl text-[length:var(--text-fluid-lg)] leading-snug text-ink-soft">
            {translate(project.summary, typedLocale)}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.codeVisibility === 'private' ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs tracking-[0.12em] text-faint uppercase">
                <Lock className="h-4 w-4" aria-hidden="true" />
                {t('privateCode')}
              </span>
            ) : (
              project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-mono text-xs tracking-[0.12em] text-ink uppercase transition-colors hover:border-signal hover:text-signal"
                >
                  <GithubIcon className="h-4 w-4" />
                  {t('repo')}
                </a>
              )
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 font-mono text-xs tracking-[0.12em] text-void uppercase transition-colors hover:bg-signal-glow"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {t('demo')}
              </a>
            )}
          </div>

          {project.metrics.length > 0 && (
            <div className="pt-4">
              <h2 className="mb-3 font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {t('metricsLabel')}
              </h2>
              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
                {project.metrics.map((metric) => (
                  <li key={metric.value} className="flex flex-col gap-1 bg-abyss px-5 py-4">
                    <span className="font-display text-2xl font-semibold text-signal tabular-nums">
                      {metric.value}
                    </span>
                    <span className="font-mono text-[0.62rem] leading-tight tracking-[0.08em] text-muted-foreground uppercase">
                      {translate(metric.label, typedLocale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            {translate(project.description, typedLocale).map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.05}>
                <p className="text-[length:var(--text-fluid-base)] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.1}>
              <section className="mt-4 flex flex-col gap-4">
                <h2 className="font-mono text-xs tracking-[0.16em] text-signal uppercase">
                  {t('highlightsLabel')}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {translate(project.highlights, typedLocale).map((highlight, index) => (
                    <li key={index} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span
                        className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-signal"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          </div>

          <aside className="flex flex-col gap-8 lg:col-span-4">
            {project.client && (
              <div className="flex flex-col gap-3">
                <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {t('clientLabel')}
                </h2>
                <p className="text-ink-soft">
                  {project.client}
                  <span className="block font-mono text-xs text-faint">
                    {t(`engagement.${project.engagement}`)}
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {t('roleLabel')}
              </h2>
              <p className="text-ink-soft">{translate(project.role, typedLocale)}</p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {t('stackLabel')}
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded border border-line bg-elevated/60 px-2.5 py-1 font-mono text-[0.68rem] text-ink-soft"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
