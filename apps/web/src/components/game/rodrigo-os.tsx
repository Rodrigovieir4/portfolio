'use client';

import {
  clientProjects,
  personalProjects,
  profile,
  projects,
  skillGroups,
  t as translate,
  type Locale,
  type Project,
} from '@portfolio/content';
import { useGameStore } from '@portfolio/game/state';
import { useMediaQuery } from '@portfolio/ui';
import {
  ExternalLink,
  FileDown,
  FileText,
  Folder,
  Lock,
  Power,
  SquareTerminal,
  Trash2,
  X,
} from 'lucide-react';
import { motion, useDragControls, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { Link } from '@/i18n/navigation';

type WindowKind =
  { kind: 'project'; slug: string } | { kind: 'terminal' } | { kind: 'about' } | { kind: 'trash' };

interface OpenWindow {
  id: string;
  spec: WindowKind;
  z: number;
  /** Posição inicial, em cascata, para janelas novas não caírem uma sobre a outra. */
  offset: number;
}

function windowId(spec: WindowKind): string {
  return spec.kind === 'project' ? `project:${spec.slug}` : spec.kind;
}

/**
 * O PC do quarto: um sistema operacional de mentira, com os projetos em janelas.
 *
 * Existe porque projeto com números, stack e descrição não cabe num balão de
 * diálogo. Janela é o formato que todo mundo já sabe ler: abre, arrasta,
 * fecha. E ainda deixa o visitante mexer num terminal, que é a forma mais
 * curta de dizer "desenvolvedor" sem escrever a palavra.
 */
export function RodrigoOS() {
  const open = useGameStore((state) => state.openPanel === 'pc');
  if (!open) return null;
  return <Desktop />;
}

function Desktop() {
  const t = useTranslations('game.os');
  const closePanel = useGameStore((state) => state.closePanel);
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(Boolean(reduced));
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const area = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    root.current?.focus();
    if (booted) return;
    const timeout = setTimeout(() => setBooted(true), 1300);
    return () => clearTimeout(timeout);
  }, [booted]);

  const openWindow = useCallback((spec: WindowKind) => {
    setWindows((current) => {
      const id = windowId(spec);
      const top = current.reduce((max, item) => Math.max(max, item.z), 0);
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => (item.id === id ? { ...item, z: top + 1 } : item));
      }
      return [...current, { id, spec, z: top + 1, offset: current.length % 6 }];
    });
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((current) => {
      const top = current.reduce((max, item) => Math.max(max, item.z), 0);
      return current.map((item) => (item.id === id ? { ...item, z: top + 1 } : item));
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((current) => current.filter((item) => item.id !== id));
  }, []);

  // Esc fecha a janela da frente; sem janela, sai do PC.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    const front = [...windows].sort((a, b) => b.z - a.z)[0];
    if (front) closeWindow(front.id);
    else closePanel();
  }

  return (
    <motion.div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="RodrigoOS"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#070a10] outline-none"
    >
      {!booted ? (
        <BootScreen />
      ) : (
        <>
          <div
            ref={area}
            className="relative flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,rgb(123_92_255/0.18),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgb(200_247_81/0.12),transparent_50%)]"
          >
            <div className="absolute inset-0 bg-grid opacity-[0.07]" aria-hidden="true" />
            <DesktopIcons onOpen={openWindow} />
            <p className="pointer-events-none absolute right-5 bottom-4 hidden font-mono text-[0.65rem] tracking-[0.14em] text-faint uppercase sm:block">
              {t('openHint')}
            </p>

            {windows.map((item) => (
              <OsWindow
                key={item.id}
                item={item}
                bounds={area}
                onFocus={() => focusWindow(item.id)}
                onClose={() => closeWindow(item.id)}
              >
                <WindowBody spec={item.spec} onOpen={openWindow} />
              </OsWindow>
            ))}
          </div>
          <Taskbar windows={windows} onFocus={focusWindow} />
        </>
      )}
    </motion.div>
  );
}

function BootScreen() {
  const t = useTranslations('game.os');
  const lines = t.raw('bootLines') as string[];
  return (
    <div className="grid flex-1 place-items-center">
      <div className="flex w-72 flex-col gap-2 font-mono text-xs text-muted-foreground">
        <p className="mb-2 text-sm text-signal">{t('booting')}</p>
        {lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.25 }}
          >
            <span className="text-signal">[ok]</span> {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

function DesktopIcons({ onOpen }: { onOpen: (spec: WindowKind) => void }) {
  const t = useTranslations('game.os');
  const locale = useLocale() as Locale;

  const icon =
    'flex w-20 flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-white/5 focus-visible:bg-white/10';
  const label = 'line-clamp-2 font-mono text-[0.66rem] leading-tight text-ink-soft';

  return (
    <nav
      aria-label={t('desktop')}
      className="absolute inset-y-0 left-0 grid auto-rows-min grid-cols-3 content-start gap-1 p-4 sm:grid-flow-col sm:grid-cols-none sm:grid-rows-6"
    >
      {clientProjects.map((project) => (
        <button
          key={project.slug}
          type="button"
          className={icon}
          onClick={() => onOpen({ kind: 'project', slug: project.slug })}
        >
          <Folder className="h-9 w-9 text-signal" strokeWidth={1.5} aria-hidden="true" />
          <span className={label}>{project.name}</span>
        </button>
      ))}
      <button type="button" className={icon} onClick={() => onOpen({ kind: 'terminal' })}>
        <SquareTerminal className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
        <span className={label}>{t('terminal')}</span>
      </button>
      <button type="button" className={icon} onClick={() => onOpen({ kind: 'about' })}>
        <FileText className="h-9 w-9 text-ink-soft" strokeWidth={1.5} aria-hidden="true" />
        <span className={label}>{t('about')}</span>
      </button>
      <a href={translate(profile.resumeUrl, locale)} download className={icon}>
        <FileDown className="h-9 w-9 text-plasma" strokeWidth={1.5} aria-hidden="true" />
        <span className={label}>{t('resume')}</span>
      </a>
      {personalProjects.map((project) => (
        <button
          key={project.slug}
          type="button"
          className={icon}
          onClick={() => onOpen({ kind: 'project', slug: project.slug })}
        >
          <Folder className="h-9 w-9 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          <span className={label}>{project.name}</span>
        </button>
      ))}
      <button type="button" className={icon} onClick={() => onOpen({ kind: 'trash' })}>
        <Trash2 className="h-9 w-9 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        <span className={label}>{t('trash')}</span>
      </button>
    </nav>
  );
}

function OsWindow({
  item,
  bounds,
  onFocus,
  onClose,
  children,
}: {
  item: OpenWindow;
  bounds: RefObject<HTMLDivElement | null>;
  onFocus: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const t = useTranslations('game');
  const controls = useDragControls();
  // No celular a janela ocupa a tela; arrastar com o dedo só atrapalharia.
  const compact = useMediaQuery('(max-width: 639px)');
  const title = useWindowTitle(item.spec);

  return (
    <motion.section
      aria-label={title}
      drag={!compact}
      dragListener={false}
      dragControls={controls}
      dragConstraints={bounds}
      dragMomentum={false}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      style={
        compact
          ? { zIndex: item.z }
          : { zIndex: item.z, left: 240 + item.offset * 34, top: 24 + item.offset * 28 }
      }
      className={
        compact
          ? 'absolute inset-2 flex flex-col overflow-hidden rounded-xl border border-line-strong bg-popover shadow-2xl'
          : 'absolute flex max-h-[78%] w-[min(560px,calc(100%-260px))] flex-col overflow-hidden rounded-xl border border-line-strong bg-popover shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]'
      }
    >
      <header
        onPointerDown={(event) => controls.start(event)}
        className="flex shrink-0 cursor-grab items-center justify-between gap-3 border-b border-line bg-elevated/80 px-3 py-2 active:cursor-grabbing"
      >
        <span className="truncate font-mono text-xs text-ink-soft">{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-danger/20 hover:text-danger"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </motion.section>
  );
}

function useWindowTitle(spec: WindowKind): string {
  const t = useTranslations('game.os');
  switch (spec.kind) {
    case 'project':
      return `~/${t('projectsFolder').toLowerCase()}/${spec.slug}`;
    case 'terminal':
      return 'rodrigo@rodrigoos: ~';
    case 'about':
      return t('about');
    case 'trash':
      return t('trash');
  }
}

function WindowBody({ spec, onOpen }: { spec: WindowKind; onOpen: (spec: WindowKind) => void }) {
  switch (spec.kind) {
    case 'project': {
      const project = projects.find((item) => item.slug === spec.slug);
      return project ? <ProjectWindow project={project} /> : null;
    }
    case 'terminal':
      return <Terminal onOpen={onOpen} />;
    case 'about':
      return <AboutWindow />;
    case 'trash':
      return <TrashWindow />;
  }
}

function ProjectWindow({ project }: { project: Project }) {
  const t = useTranslations('game');
  const os = useTranslations('game.os');
  const locale = useLocale() as Locale;

  return (
    <article className="flex flex-col gap-4 p-5">
      <header className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{project.name}</h2>
        <p className="font-mono text-[0.68rem] text-muted-foreground">
          {[project.client, translate(project.role, locale)].filter(Boolean).join(' · ')}
        </p>
      </header>
      <p className="text-sm leading-relaxed text-ink-soft">{translate(project.summary, locale)}</p>

      {project.metrics.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
            {os('metrics')}
          </h3>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {project.metrics.map((metric) => (
              <li key={metric.value} className="flex flex-col bg-abyss px-3 py-2">
                <span className="font-display text-lg font-semibold text-signal tabular-nums">
                  {metric.value}
                </span>
                <span className="font-mono text-[0.6rem] tracking-[0.06em] text-muted-foreground uppercase">
                  {translate(metric.label, locale)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
          {os('highlights')}
        </h3>
        <ul className="flex flex-col gap-1.5">
          {translate(project.highlights, locale).map((highlight) => (
            <li key={highlight} className="flex gap-2 text-sm text-ink-soft">
              <span
                className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-signal"
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <ul className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded border border-line bg-elevated/60 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Link
          href={{ pathname: '/projetos/[slug]', params: { slug: project.slug } }}
          className="inline-flex items-center gap-1.5 rounded-full bg-signal px-4 py-2 font-mono text-[0.68rem] tracking-[0.1em] text-void uppercase"
        >
          {t('openProject')}
        </Link>
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 font-mono text-[0.68rem] tracking-[0.1em] text-ink uppercase"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {t('liveSite')}
          </a>
        )}
        {project.codeVisibility === 'private' && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.1em] text-faint uppercase">
            <Lock className="h-3 w-3" aria-hidden="true" />
            {t('privateCode')}
          </span>
        )}
      </footer>
    </article>
  );
}

function AboutWindow() {
  const locale = useLocale() as Locale;
  return (
    <div className="flex flex-col gap-3 p-5 font-mono text-[0.78rem] leading-relaxed text-ink-soft">
      <p className="text-signal"># {profile.name}</p>
      {translate(profile.bio, locale).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function TrashWindow() {
  const t = useTranslations('game.os');
  return <p className="p-5 font-mono text-xs text-muted-foreground">{t('trashContent')}</p>;
}

/* -------------------------------------------------------------------------- */
/* Terminal                                                                   */
/* -------------------------------------------------------------------------- */

interface Line {
  kind: 'in' | 'out' | 'error';
  text: string;
}

function Terminal({ onOpen }: { onOpen: (spec: WindowKind) => void }) {
  const t = useTranslations('game.os');
  const locale = useLocale() as Locale;
  const closePanel = useGameStore((state) => state.closePanel);
  const openPanelFor = useGameStore((state) => state.openPanelFor);
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: t('terminalWelcome') }]);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  function findProject(name: string) {
    const needle = name.toLowerCase();
    return projects.find(
      (project) => project.slug === needle || project.name.toLowerCase() === needle,
    );
  }

  function run(raw: string) {
    const input = raw.trim();
    const out: Line[] = [{ kind: 'in', text: input }];
    const [command = '', ...args] = input.split(/\s+/);
    const argument = args.join(' ');

    switch (command.toLowerCase()) {
      case '':
        break;
      case 'help':
        out.push({ kind: 'out', text: t('commands.help') });
        break;
      case 'whoami':
        out.push({ kind: 'out', text: `${profile.name} · ${translate(profile.headline, locale)}` });
        out.push({ kind: 'out', text: translate(profile.tagline, locale) });
        break;
      case 'ls':
        out.push({ kind: 'out', text: projects.map((project) => project.slug).join('   ') });
        break;
      case 'cat': {
        const project = findProject(argument);
        if (!project)
          out.push({ kind: 'error', text: t('commands.noProject', { name: argument }) });
        else {
          out.push({ kind: 'out', text: `${project.name} (${project.year})` });
          out.push({ kind: 'out', text: translate(project.summary, locale) });
          out.push({ kind: 'out', text: project.stack.join(', ') });
        }
        break;
      }
      case 'open': {
        const project = findProject(argument);
        if (!project)
          out.push({ kind: 'error', text: t('commands.noProject', { name: argument }) });
        else {
          out.push({ kind: 'out', text: t('commands.opening', { name: project.name }) });
          onOpen({ kind: 'project', slug: project.slug });
        }
        break;
      }
      case 'stack':
        for (const group of skillGroups) {
          out.push({
            kind: 'out',
            text: `${translate(group.label, locale).toLowerCase()}: ${group.skills.map((skill) => skill.name).join(', ')}`,
          });
        }
        break;
      case 'contato':
      case 'contact':
      case 'contacto':
        out.push({ kind: 'out', text: profile.email });
        profile.socials
          .filter((social) => social.platform !== 'email')
          .forEach((social) => out.push({ kind: 'out', text: `${social.label}: ${social.url}` }));
        break;
      case 'sudo':
        out.push({ kind: 'out', text: t('commands.hire') });
        setLines((current) => [...current, ...out]);
        setTimeout(() => openPanelFor('contato'), 600);
        return;
      case 'clear':
        setLines([]);
        return;
      case 'exit':
        out.push({ kind: 'out', text: t('commands.exit') });
        setLines((current) => [...current, ...out]);
        setTimeout(closePanel, 350);
        return;
      default:
        out.push({ kind: 'error', text: t('commands.notFound', { command }) });
    }
    setLines((current) => [...current, ...out]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Esc sobe para o sistema, que fecha a janela. As outras teclas ficam aqui.
    if (event.key === 'Escape') return;
    event.stopPropagation();

    if (event.key === 'Enter') {
      if (value.trim()) history.current.unshift(value);
      cursor.current = -1;
      run(value);
      setValue('');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(cursor.current + 1, history.current.length - 1);
      if (next >= 0) {
        cursor.current = next;
        setValue(history.current[next] ?? '');
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = cursor.current - 1;
      cursor.current = Math.max(-1, next);
      setValue(next >= 0 ? (history.current[next] ?? '') : '');
    }
  }

  return (
    <div className="flex min-h-72 flex-col gap-1 bg-[#05070b] p-4 font-mono text-[0.76rem] leading-relaxed">
      {lines.map((line, index) => (
        <p
          key={index}
          className={
            line.kind === 'in'
              ? 'text-ink'
              : line.kind === 'error'
                ? 'text-danger'
                : 'text-ink-soft'
          }
        >
          {line.kind === 'in' && <span className="text-signal">rodrigo@os:~$ </span>}
          {line.text}
        </p>
      ))}
      <label className="flex items-center gap-2">
        <span className="text-signal">rodrigo@os:~$</span>
        <input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label={t('terminalPlaceholder')}
          placeholder={t('terminalPlaceholder')}
          className="flex-1 bg-transparent text-ink outline-none placeholder:text-faint"
        />
      </label>
      <div ref={end} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Barra de tarefas                                                           */
/* -------------------------------------------------------------------------- */

function Clock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const format = () =>
      setNow(
        new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: profile.location.timezone,
        }).format(new Date()),
      );
    format();
    const interval = setInterval(format, 15_000);
    return () => clearInterval(interval);
  }, []);
  return <span className="font-mono text-xs text-ink-soft tabular-nums">{now} BRT</span>;
}

function Taskbar({ windows, onFocus }: { windows: OpenWindow[]; onFocus: (id: string) => void }) {
  const t = useTranslations('game.os');
  const closePanel = useGameStore((state) => state.closePanel);

  return (
    <footer className="flex h-12 shrink-0 items-center gap-2 border-t border-line bg-abyss/95 px-3">
      <span className="grid h-8 w-8 place-items-center rounded-md border border-signal/40 bg-signal/10 font-mono text-sm text-signal">
        R
      </span>
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {windows.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFocus(item.id)}
            className="shrink-0 truncate rounded-md border border-line bg-elevated/60 px-2.5 py-1 font-mono text-[0.65rem] text-ink-soft"
          >
            {item.spec.kind === 'project'
              ? item.spec.slug
              : t(item.spec.kind === 'about' ? 'about' : item.spec.kind)}
          </button>
        ))}
      </div>
      <Clock />
      <button
        type="button"
        onClick={closePanel}
        className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.1em] text-ink uppercase transition-colors hover:border-danger hover:text-danger"
      >
        <Power className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exit')}
      </button>
    </footer>
  );
}
