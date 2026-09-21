'use client';

import {
  certifications,
  experiences,
  languages,
  profile,
  projects,
  skillGroups,
  t as translate,
  type Locale,
} from '@portfolio/content';
import { ACHIEVEMENTS, COMMIT_IDS, useGameStore, type PanelId } from '@portfolio/game/state';
import { Download, FileText, Lock, Mail, MapPin, Trophy } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { formatDuration } from './career-stats';

/**
 * Os painéis que os objetos do quarto abrem.
 *
 * Todo o texto vem de @portfolio/content, o mesmo pacote do modo currículo.
 * O jogo não guarda uma vírgula de conteúdo próprio: mudar um projeto no
 * arquivo de dados muda o site e o quarto ao mesmo tempo.
 *
 * O PC não passa por aqui: ele abre o RodrigoOS, em tela cheia.
 */
export function GamePanels() {
  const t = useTranslations('game');
  const openPanel = useGameStore((state) => state.openPanel);
  const closePanel = useGameStore((state) => state.closePanel);
  const panel = openPanel && openPanel !== 'pc' ? openPanel : null;

  return (
    <Dialog open={panel !== null} onOpenChange={(open) => !open && closePanel()}>
      <DialogContent className="max-h-[88dvh] border-line bg-popover/95 backdrop-blur-xl sm:max-w-2xl">
        {panel && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl tracking-tight text-ink">
                {t(`panels.${panel}.title`)}
              </DialogTitle>
              <DialogDescription className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
                {t(`panels.${panel}.description`)}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[62dvh] pr-3">
              <PanelBody id={panel} />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PanelBody({ id }: { id: Exclude<PanelId, 'pc'> }) {
  switch (id) {
    case 'sobre':
      return <AboutBody />;
    case 'lousa':
      return <StackBody />;
    case 'mapa':
      return <MapBody />;
    case 'certificados':
      return <CertificatesBody />;
    case 'trofeus':
      return <JourneyBody />;
    case 'formacao':
      return <EducationBody />;
    case 'contato':
    case 'gol':
      return <ContactBody />;
    case 'final':
      return <FinalBody />;
  }
}

function AboutBody() {
  const locale = useLocale() as Locale;
  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-lg border border-line">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          sizes="128px"
          className="object-cover grayscale"
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-signal">{translate(profile.tagline, locale)}</p>
        {translate(profile.bio, locale).map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed text-ink-soft">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function StackBody() {
  const t = useTranslations('skills');
  const locale = useLocale() as Locale;
  return (
    <div className="flex flex-col gap-5">
      {skillGroups.map((group) => (
        <section key={group.id} className="flex flex-col gap-2">
          <h3 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {translate(group.label, locale)}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {group.skills.map((skill) => (
              <li key={skill.name}>
                <Badge tone={skill.level >= 4 ? group.accent : 'neutral'} className="normal-case">
                  {skill.name}
                  <span className="opacity-60">· {t(`levels.${skill.level}`)}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function MapBody() {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;
  const markets = ['BR', 'PT', 'IE', 'EU'] as const;

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-sm text-ink-soft">
        <MapPin className="h-4 w-4 text-signal" aria-hidden="true" />
        {t('markets.base')}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {markets.map((market) => {
          const here = projects.filter((project) => project.markets.includes(market));
          if (here.length === 0) return null;
          return (
            <li key={market} className="rounded-lg border border-line bg-surface/60 p-4">
              <p className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-lg font-semibold text-ink">
                  {t(`markets.${market}`)}
                </span>
                <span className="font-mono text-xs text-signal">{market}</span>
              </p>
              <ul className="flex flex-col gap-1.5">
                {here.map((project) => (
                  <li key={project.slug} className="text-sm text-ink-soft">
                    <span className="text-ink">{project.name}</span>
                    <span className="text-muted-foreground">
                      {' · '}
                      {translate(project.role, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CertificatesBody() {
  const locale = useLocale() as Locale;
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

function Timeline({ kinds }: { kinds: readonly string[] }) {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;
  return (
    <ol className="flex flex-col gap-4 border-l border-line-strong pl-5">
      {experiences
        .filter((item) => kinds.includes(item.kind))
        .map((item) => (
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

function JourneyBody() {
  return <Timeline kinds={['work', 'athletics', 'project']} />;
}

function EducationBody() {
  const t = useTranslations('game');
  const skills = useTranslations('skills');
  const locale = useLocale() as Locale;
  return (
    <div className="flex flex-col gap-6">
      <Timeline kinds={['education']} />
      <section className="flex flex-col gap-2">
        <h3 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t('formacao.languages')}
        </h3>
        <ul className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <li key={language.code}>
              <Badge tone="cyan" className="normal-case">
                {translate(language.name, locale)} · {skills(`languageLevels.${language.level}`)}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted-foreground">{t('formacao.certificatesHint')}</p>
    </div>
  );
}

function ContactBody() {
  const t = useTranslations('game');
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

function FinalBody() {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;
  const startedAt = useGameStore((state) => state.startedAt);
  const finishedAt = useGameStore((state) => state.finishedAt);
  const achievements = useGameStore((state) => state.achievements);
  const collected = useGameStore((state) => state.collected.length);
  const openPanelFor = useGameStore((state) => state.openPanelFor);
  const closePanel = useGameStore((state) => state.closePanel);

  const time =
    startedAt !== null && finishedAt !== null ? formatDuration(finishedAt - startedAt) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
        <div className="flex flex-col gap-1 bg-abyss p-4">
          <span className="font-display text-3xl font-semibold text-signal tabular-nums">
            {time ?? '—'}
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-muted-foreground uppercase">
            {t('final.time')}
          </span>
        </div>
        <div className="flex flex-col gap-1 bg-abyss p-4">
          <span className="font-display text-3xl font-semibold text-signal tabular-nums">
            {collected}/{COMMIT_IDS.length}
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-muted-foreground uppercase">
            {t('final.commits')}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t('final.speedrunHint')}</p>

      <section className="flex flex-col gap-2">
        <h3 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t('final.achievements')}
        </h3>
        <AchievementList unlocked={achievements} />
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={translate(profile.resumeUrl, locale)}
          download
          className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-mono text-xs tracking-[0.1em] text-void uppercase"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t('final.cv')}
        </a>
        <button
          type="button"
          onClick={() => openPanelFor('contato')}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.1em] text-ink uppercase"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {t('final.contact')}
        </button>
        <button
          type="button"
          onClick={closePanel}
          className="px-3 py-3 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase"
        >
          {t('final.keep')}
        </button>
      </div>
    </div>
  );
}

/** Lista de conquistas, travadas em cinza e liberadas em verde. */
export function AchievementList({ unlocked }: { unlocked: readonly string[] }) {
  const t = useTranslations('game');
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {ACHIEVEMENTS.map((id) => {
        const done = unlocked.includes(id);
        return (
          <li
            key={id}
            className={`flex items-start gap-3 rounded-lg border p-3 ${done ? 'border-signal/40 bg-signal/5' : 'border-line bg-surface/40 opacity-60'}`}
          >
            {done ? (
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
            ) : (
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
            )}
            <span className="flex flex-col">
              <span className="text-sm text-ink">{t(`achievements.${id}.title`)}</span>
              <span className="text-xs text-muted-foreground">
                {t(`achievements.${id}.description`)}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
