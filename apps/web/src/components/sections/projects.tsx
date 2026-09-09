import type { ReactNode } from 'react';
import {
  clientProjects,
  personalProjects,
  t as translate,
  type Locale,
  type Project,
} from '@portfolio/content';
import { GithubIcon, Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { ArrowUpRight, ExternalLink, Lock } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';

/** rgba do acento, no formato literal que o SpotlightCard exige. */
const SPOTLIGHT: Record<Project['accent'], `rgba(${number}, ${number}, ${number}, ${number})`> = {
  signal: 'rgba(200, 247, 81, 0.16)',
  plasma: 'rgba(123, 92, 255, 0.18)',
  ember: 'rgba(255, 107, 61, 0.16)',
  cyan: 'rgba(78, 224, 208, 0.16)',
};

const STATUS_TONE: Record<Project['status'], 'signal' | 'ember' | 'neutral'> = {
  live: 'signal',
  wip: 'ember',
  archived: 'neutral',
  private: 'neutral',
};

const MONTHS: Record<Locale, string[]> = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};

/** "2026-07" e null viram "jul 2026 — hoje". Mês igual colapsa num rótulo só. */
function formatPeriod(project: Project, locale: Locale, present: string): string {
  if (!project.start) return project.year;

  const label = (value: string) => {
    const [year, month] = value.split('-');
    return `${MONTHS[locale][Number(month) - 1] ?? month} ${year}`;
  };

  const from = label(project.start);
  const to = project.end ? label(project.end) : present;
  return from === to ? from : `${from} — ${to}`;
}

export async function Projects() {
  const t = await getTranslations('projects');
  const locale = (await getLocale()) as Locale;

  const labels: CardLabels = {
    viewProject: t('viewProject'),
    privateCode: t('privateCode'),
    liveSite: t('liveSite'),
    present: t('present'),
  };

  return (
    <section id="projects" className="relative border-t border-line/60 bg-abyss/40 section-spacing">
      <div className="container-wide flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          <GroupLabel>{t('groupClient')}</GroupLabel>

          <RevealGroup className="grid gap-6 lg:grid-cols-2" stagger={0.09}>
            {clientProjects.map((project, index) => (
              <RevealItem
                key={project.slug}
                // Os dois primeiros ocupam a linha inteira. Sem essa hierarquia
                // a grade dá o mesmo peso visual a um marketplace em produção e
                // a um projeto de três semanas.
                className={index < 2 ? 'lg:col-span-2' : undefined}
              >
                <ProjectCard
                  project={project}
                  locale={locale}
                  large={index < 2}
                  labels={labels}
                  status={t(`status.${project.status}`)}
                  engagement={t(`engagement.${project.engagement}`)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <GroupLabel>{t('groupPersonal')}</GroupLabel>

          <RevealGroup className="grid gap-5 md:grid-cols-3" stagger={0.07}>
            {personalProjects.map((project) => (
              <RevealItem key={project.slug}>
                <ProjectCard
                  project={project}
                  locale={locale}
                  large={false}
                  labels={labels}
                  status={t(`status.${project.status}`)}
                  engagement={t(`engagement.${project.engagement}`)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {children}
      </h3>
      <Separator className="flex-1 bg-line" />
    </div>
  );
}

interface CardLabels {
  viewProject: string;
  privateCode: string;
  liveSite: string;
  present: string;
}

function ProjectCard({
  project,
  locale,
  large,
  labels,
  status,
  engagement,
}: {
  project: Project;
  locale: Locale;
  large: boolean;
  labels: CardLabels;
  status: string;
  engagement: string;
}) {
  const period = formatPeriod(project, locale, labels.present);

  return (
    <SpotlightCard
      className="group h-full border-line bg-surface/70 p-0 transition-colors hover:border-line-strong"
      spotlightColor={SPOTLIGHT[project.accent]}
    >
      <div className="relative flex h-full flex-col gap-5 p-7 lg:p-9">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[project.status]}>{status}</Badge>
              <span className="font-mono text-[0.65rem] tracking-[0.14em] text-faint uppercase">
                {period}
              </span>
            </div>

            <h4
              className={
                large
                  ? 'font-display text-[length:var(--text-fluid-xl)] leading-none font-bold tracking-tight text-ink'
                  : 'font-display text-2xl leading-none font-bold tracking-tight text-ink'
              }
            >
              {project.name}
            </h4>

            <p className="font-mono text-[0.68rem] tracking-[0.1em] text-muted-foreground">
              {project.client ? `${project.client} · ` : ''}
              {engagement}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {project.codeVisibility === 'private' ? (
              // Dizer que o código é fechado é melhor do que um card sem
              // nenhum botão, que o visitante lê como página incompleta.
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.12em] text-faint uppercase">
                <Lock className="h-3 w-3" aria-hidden="true" />
                {labels.privateCode}
              </span>
            ) : (
              project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub — ${project.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted-foreground transition-colors hover:border-signal hover:text-signal"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )
            )}

            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.liveSite} — ${project.name}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-signal/40 bg-signal/10 text-signal transition-colors hover:bg-signal hover:text-void"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </header>

        <p
          className={
            large
              ? 'max-w-2xl text-[length:var(--text-fluid-base)] leading-relaxed text-ink-soft'
              : 'text-sm leading-relaxed text-ink-soft'
          }
        >
          {translate(project.summary, locale)}
        </p>

        {project.metrics.length > 0 && (
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {project.metrics.map((metric) => (
              <li key={metric.value} className="flex flex-col gap-0.5 bg-abyss/80 px-4 py-3">
                <span className="font-display text-xl font-semibold text-signal tabular-nums">
                  {metric.value}
                </span>
                <span className="font-mono text-[0.6rem] leading-tight tracking-[0.08em] text-muted-foreground uppercase">
                  {translate(metric.label, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <ul className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, large ? 12 : 5).map((tech) => (
            <li
              key={tech}
              className="rounded border border-line bg-elevated/60 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        <footer className="mt-auto pt-3">
          <Link
            href={{ pathname: '/projetos/[slug]', params: { slug: project.slug } }}
            className="group/link inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-signal uppercase"
          >
            {labels.viewProject}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </footer>
      </div>
    </SpotlightCard>
  );
}
