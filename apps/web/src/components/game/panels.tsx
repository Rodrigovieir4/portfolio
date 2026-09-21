'use client';

import {
  certifications,
  clientProjects,
  experiences,
  profile,
  t as translate,
  type Locale,
} from '@portfolio/content';
import { useGameStore, type PanelId } from '@portfolio/game/state';
import { ArrowUpRight, FileText, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from '@/i18n/navigation';

/**
 * Os painéis que os objetos do quarto abrem.
 *
 * Todo o texto vem de @portfolio/content, o mesmo pacote do modo currículo.
 * O jogo não guarda uma vírgula de conteúdo próprio: mudar um projeto no
 * arquivo de dados muda o site e o quarto ao mesmo tempo.
 */
export function GamePanels() {
  const t = useTranslations('game');
  const openPanel = useGameStore((state) => state.openPanel);
  const closePanel = useGameStore((state) => state.closePanel);

  return (
    <Dialog open={openPanel !== null} onOpenChange={(open) => !open && closePanel()}>
      <DialogContent className="max-h-[85dvh] border-line bg-popover/95 backdrop-blur-xl sm:max-w-2xl">
        {openPanel && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl tracking-tight text-ink">
                {t(`panels.${openPanel}.title`)}
              </DialogTitle>
              <DialogDescription className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
                {t(`panels.${openPanel}.description`)}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60dvh] pr-3">
              <PanelBody id={openPanel} />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PanelBody({ id }: { id: PanelId }) {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;

  if (id === 'pc') {
    return (
      <ul className="flex flex-col gap-3">
        {clientProjects.map((project) => (
          <li key={project.slug} className="rounded-lg border border-line bg-surface/60 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink">{project.name}</h3>
              <span className="font-mono text-[0.65rem] text-faint">
                {project.client ?? project.year}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {translate(project.summary, locale)}
            </p>
            {project.metrics.length > 0 && (
              <p className="mt-2 font-mono text-[0.68rem] text-signal">
                {project.metrics
                  .map((metric) => `${metric.value} ${translate(metric.label, locale)}`)
                  .join(' · ')}
              </p>
            )}
            <Link
              href={{ pathname: '/projetos/[slug]', params: { slug: project.slug } }}
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs tracking-[0.1em] text-signal uppercase"
            >
              {t('openProject')}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (id === 'certificados') {
    return (
      <ul className="grid gap-2 sm:grid-cols-2">
        {certifications.map((certificate) => (
          <li key={certificate.id}>
            <a
              href={certificate.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-start gap-3 rounded-lg border border-line bg-surface/60 p-3 transition-colors hover:border-signal/40"
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm text-ink">{translate(certificate.name, locale)}</span>
                <span className="text-xs text-muted-foreground">{certificate.issuer}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (id === 'trofeus') {
    return (
      <ol className="flex flex-col gap-4 border-l border-line-strong pl-5">
        {experiences.map((item) => (
          <li key={item.id} className="relative">
            <span
              className="absolute top-1.5 -left-[25px] h-2 w-2 rounded-full bg-signal"
              aria-hidden="true"
            />
            <p className="font-mono text-[0.68rem] tracking-[0.1em] text-signal uppercase">
              {item.start.slice(0, 4)} — {item.end ? item.end.slice(0, 4) : t('present')}
            </p>
            <h3 className="font-display text-base font-semibold text-ink">
              {translate(item.role, locale)}
            </h3>
            <p className="text-xs text-muted-foreground">{item.organization}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {translate(item.summary, locale)}
            </p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-signal px-5 py-3 font-mono text-xs tracking-[0.1em] text-void uppercase transition-colors hover:bg-signal-glow"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {t('emailCta')}
      </a>
      <ul className="grid gap-2 sm:grid-cols-2">
        {profile.socials.map((social) => (
          <li key={social.platform}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col rounded-lg border border-line bg-surface/60 p-3 transition-colors hover:border-signal/40"
            >
              <span className="font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                {social.label}
              </span>
              <span className="truncate text-sm text-ink">{social.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
