import { projects, t as translate, type Locale, type Project } from '@portfolio/content';
import {
  Badge,
  GithubIcon,
  Reveal,
  RevealGroup,
  RevealItem,
  SectionHeading,
  TiltCard,
} from '@portfolio/ui';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

const ACCENT_GLOW: Record<Project['accent'], string> = {
  signal: 'from-signal/22',
  plasma: 'from-plasma/22',
  ember: 'from-ember/22',
  cyan: 'from-cyan/22',
};

const STATUS_TONE: Record<Project['status'], 'signal' | 'ember' | 'neutral'> = {
  live: 'signal',
  wip: 'ember',
  archived: 'neutral',
  private: 'neutral',
};

export async function Projects() {
  const t = await getTranslations('projects');
  const locale = (await getLocale()) as Locale;

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

        <RevealGroup className="grid gap-6 lg:grid-cols-2" stagger={0.1}>
          {projects.map((project, index) => (
            <RevealItem
              key={project.slug}
              // O primeiro projeto ocupa a linha inteira, criando hierarquia em
              // vez de uma grade uniforme onde tudo tem o mesmo peso.
              className={index === 0 ? 'lg:col-span-2' : undefined}
            >
              <TiltCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface/70 transition-colors hover:border-line-strong">
                  <div
                    className={`pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${ACCENT_GLOW[project.accent]} to-transparent opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-1 flex-col gap-5 p-7 lg:p-9">
                    <header className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={STATUS_TONE[project.status]}>
                            {t(`status.${project.status}`)}
                          </Badge>
                          <span className="font-mono text-[0.65rem] tracking-[0.14em] text-faint uppercase">
                            {project.year}
                          </span>
                        </div>

                        <h3
                          className={
                            index === 0
                              ? 'font-display text-[length:var(--text-fluid-xl)] leading-none font-bold tracking-tight text-ink'
                              : 'font-display text-2xl leading-none font-bold tracking-tight text-ink'
                          }
                        >
                          {project.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {project.links.repo && (
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t('repo')} — ${project.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-signal hover:text-signal"
                          >
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t('demo')} — ${project.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-signal hover:text-signal"
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </header>

                    <p
                      className={
                        index === 0
                          ? 'max-w-2xl text-[length:var(--text-fluid-base)] leading-relaxed text-ink-soft'
                          : 'leading-relaxed text-ink-soft'
                      }
                    >
                      {translate(project.summary, locale)}
                    </p>

                    <ul className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded border border-line bg-elevated/60 px-2 py-1 font-mono text-[0.65rem] text-muted"
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
                        {t('viewProject')}
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </footer>
                  </div>
                </article>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
