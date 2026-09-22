'use client';

import { profile, t as translate, type Locale } from '@portfolio/content';
import {
  activeTier,
  COMMIT_IDS,
  HOTSPOT_IDS,
  LAMP,
  QUALITY_TIERS,
  useGameStore,
  type QualityMode,
  type Toast,
} from '@portfolio/game/state';
import {
  FileText,
  Hand,
  HelpCircle,
  RotateCcw,
  RotateCw,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/layout/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/navigation';

import { careerStats, formatDuration } from './career-stats';
import { AchievementList } from './panels';

const chip =
  'rounded-full border border-line bg-void/70 backdrop-blur-md font-mono text-[0.68rem] text-ink-soft';
const iconButton =
  'grid h-9 w-9 place-items-center rounded-full border border-line bg-void/70 text-ink-soft backdrop-blur-md transition-colors hover:border-line-strong hover:text-ink';

/* -------------------------------------------------------------------------- */
/* Barra de cima                                                              */
/* -------------------------------------------------------------------------- */

export function TopBar() {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;
  const soundOn = useGameStore((state) => state.soundOn);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const toggleHelp = useGameStore((state) => state.toggleHelp);
  const toggleScoreboard = useGameStore((state) => state.toggleScoreboard);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-display text-base leading-none font-semibold text-ink sm:text-lg">
          {profile.name}
        </p>
        <p className="font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
          {translate(profile.headline, locale)}
          <span className="ml-2 rounded-full border border-signal/40 px-2 py-0.5 text-signal">
            {t('badge')}
          </span>
        </p>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? t('hud.soundOff') : t('hud.soundOn')}
            aria-pressed={soundOn}
            className={iconButton}
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4 text-signal" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleScoreboard()}
            aria-label={t('hud.scoreboard')}
            className={iconButton}
          >
            <Trophy className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toggleHelp()}
            aria-label={t('hud.help')}
            className={iconButton}
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-void/70 px-4 py-2 font-mono text-xs tracking-[0.12em] whitespace-nowrap text-signal uppercase backdrop-blur-md transition-colors hover:bg-signal hover:text-void"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {t('backToCv')}
        </Link>
        <Progress />
      </div>
    </header>
  );
}

/** Tempo do tour em andamento, atualizado quatro vezes por segundo. */
function useElapsed(): number | null {
  const startedAt = useGameStore((state) => state.startedAt);
  const finishedAt = useGameStore((state) => state.finishedAt);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return;
    const interval = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(interval);
  }, [startedAt, finishedAt]);

  if (startedAt === null) return null;
  return (finishedAt ?? Math.max(now, startedAt)) - startedAt;
}

/**
 * Progresso do tour: objetos visitados, commits achados e o cronômetro.
 *
 * Os commits aparecem como o gráfico de contribuições do GitHub, doze casas
 * que vão ficando verdes. É o jeito de dizer "tem mais coisa escondida" sem
 * escrever isso.
 */
function Progress() {
  const t = useTranslations('game');
  const visited = useGameStore((state) => state.visited.length);
  const collected = useGameStore((state) => state.collected.length);
  const goals = useGameStore((state) => state.goals);
  const elapsed = useElapsed();

  return (
    <div className={`${chip} flex flex-col items-end gap-1.5 px-3 py-2`}>
      <div className="flex items-center gap-3">
        <span>
          {t('hud.objects')}{' '}
          <span className="text-ink">
            {visited}/{HOTSPOT_IDS.length}
          </span>
        </span>
        {goals > 0 && (
          <span>
            {t('hud.goals')} <span className="text-ink">{goals}</span>
          </span>
        )}
        {elapsed !== null && (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Timer className="h-3 w-3 text-signal" aria-hidden="true" />
            <span className="text-ink">{formatDuration(elapsed)}</span>
          </span>
        )}
      </div>
      <div
        className="flex items-center gap-2"
        title={`${t('hud.commits')} ${collected}/${COMMIT_IDS.length}`}
      >
        <span>{t('hud.commits')}</span>
        <div className="grid grid-flow-col grid-rows-2 gap-[3px]" aria-hidden="true">
          {COMMIT_IDS.map((id, index) => (
            <span
              key={id}
              className={`h-2 w-2 rounded-[2px] transition-colors duration-300 ${index < collected ? 'bg-signal shadow-[0_0_6px_rgb(200_247_81/0.8)]' : 'bg-line'}`}
            />
          ))}
        </div>
        <span className="sr-only">
          {collected}/{COMMIT_IDS.length}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dica de interação e tutorial                                               */
/* -------------------------------------------------------------------------- */

/**
 * A dica que aparece quando o personagem pisa perto de um objeto.
 *
 * É um botão de verdade: no desktop mostra a tecla, no celular é o próprio
 * alvo do toque. Some enquanto um painel está aberto.
 */
export function InteractPrompt() {
  const t = useTranslations('game');
  const nearby = useGameStore((state) => state.nearby);
  const openPanel = useGameStore((state) => state.openPanel);
  const lampOn = useGameStore((state) => state.lampOn);
  const interact = useGameStore((state) => state.interact);

  const label =
    nearby === LAMP.id
      ? t(lampOn ? 'hint.lampOff' : 'hint.lampOn')
      : nearby
        ? t(`hint.${nearby}`)
        : '';

  return (
    <AnimatePresence>
      {nearby && !openPanel && (
        <motion.div
          key={nearby}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-x-0 bottom-28 flex justify-center sm:bottom-24"
        >
          <button
            type="button"
            onClick={interact}
            className="inline-flex items-center gap-3 rounded-full border border-signal/50 bg-void/85 py-2 pr-5 pl-2 font-mono text-sm text-ink shadow-[0_0_32px_-8px_rgb(200_247_81/0.6)] backdrop-blur-md transition-transform active:scale-95"
          >
            <kbd className="grid h-7 w-7 place-items-center rounded-full bg-signal font-mono text-xs text-void">
              E
            </kbd>
            {label}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Uma frase só, até o primeiro passo. Depois disso some e não volta. */
export function Onboarding({ touch }: { touch: boolean }) {
  const t = useTranslations('game');
  const started = useGameStore((state) => state.startedAt !== null);

  return (
    <AnimatePresence>
      {!started && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2.2 }}
          className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-mono text-xs tracking-[0.14em] text-ink uppercase"
        >
          <span className="rounded-full bg-void/70 px-4 py-2 backdrop-blur-md">
            {touch ? t('onboarding.touch') : t('onboarding.keyboard')}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Avisos de conquista                                                        */
/* -------------------------------------------------------------------------- */

function ToastItem({ toast }: { toast: Toast }) {
  const t = useTranslations('game');
  const dismissToast = useGameStore((state) => state.dismissToast);

  useEffect(() => {
    const timeout = setTimeout(() => dismissToast(toast.key), 3800);
    return () => clearTimeout(timeout);
  }, [toast.key, dismissToast]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 rounded-xl border border-signal/40 bg-void/90 px-4 py-3 shadow-[0_0_40px_-12px_rgb(200_247_81/0.6)] backdrop-blur-md"
    >
      <Trophy className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
      <span className="flex flex-col">
        <span className="font-mono text-[0.6rem] tracking-[0.14em] text-signal uppercase">
          {t('toastTitle')}
        </span>
        <span className="text-sm font-medium text-ink">
          {t(`achievements.${toast.achievement}.title`)}
        </span>
        <span className="text-xs text-muted-foreground">
          {t(`achievements.${toast.achievement}.description`)}
        </span>
      </span>
    </motion.li>
  );
}

export function Toasts() {
  const toasts = useGameStore((state) => state.toasts);
  return (
    <ol
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-24 z-40 flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.key} toast={toast} />
        ))}
      </AnimatePresence>
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Ajuda e placar                                                             */
/* -------------------------------------------------------------------------- */

export function HelpCard() {
  const t = useTranslations('game.help');
  const open = useGameStore((state) => state.helpOpen);
  const toggleHelp = useGameStore((state) => state.toggleHelp);

  const rows: [string, string][] = [
    ['WASD / ← ↑ → ↓', t('move')],
    ['Shift', t('run')],
    ['E / Enter', t('interact')],
    ['Espaço / Space', t('kick')],
    ['1', t('wave')],
    ['Z · X', t('camera')],
    ['P', t('scoreboard')],
    ['H', t('help')],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          className="absolute top-1/2 right-4 z-30 w-72 -translate-y-1/2 rounded-xl border border-line-strong bg-void/90 p-4 backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">{t('title')}</h2>
            <button
              type="button"
              onClick={() => toggleHelp(false)}
              className="font-mono text-xs text-muted-foreground hover:text-ink"
            >
              ✕
            </button>
          </div>
          <dl className="flex flex-col gap-1.5">
            {rows.map(([key, action]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <dt>
                  <kbd className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.65rem] text-ink">
                    {key}
                  </kbd>
                </dt>
                <dd className="text-right text-xs text-ink-soft">{action}</dd>
              </div>
            ))}
          </dl>
          <QualityPicker />

          <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-muted-foreground">
            {t('tip')}
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/**
 * Escolha de qualidade, com o automático como padrão.
 *
 * O automático cobre quase todo mundo, mas o manual existe por dois motivos
 * concretos: quem está com a bateria acabando quer o nível baixo mesmo com o
 * aparelho dando conta, e quem gravou a tela quer o alto travado, sem o jogo
 * mudando de aparência no meio do vídeo. No automático, o nível em vigor
 * aparece ao lado: o visitante vê o que o jogo decidiu por ele.
 */
function QualityPicker() {
  const t = useTranslations('game.help.quality');
  const quality = useGameStore((state) => state.quality);
  const setQuality = useGameStore((state) => state.setQuality);
  const tier = useGameStore(activeTier);

  return (
    <div className="mt-3 border-t border-line pt-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="quality" className="text-xs text-ink-soft">
          {t('label')}
          {quality === 'auto' && (
            <span className="ml-1.5 font-mono text-[0.6rem] text-muted-foreground uppercase">
              {t(tier)}
            </span>
          )}
        </label>
        <Select value={quality} onValueChange={(value) => setQuality(value as QualityMode)}>
          <SelectTrigger id="quality" size="sm" className="w-28 font-mono text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">{t('auto')}</SelectItem>
            {QUALITY_TIERS.map((item) => (
              <SelectItem key={item} value={item}>
                {t(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="mt-2 text-[0.7rem] leading-relaxed text-muted-foreground">{t('hint')}</p>
    </div>
  );
}

/**
 * Placar no estilo de jogo de tiro tático: a linha de quem joga agora e, embaixo,
 * os números de carreira somados do conteúdo.
 */
export function Scoreboard() {
  const t = useTranslations('game');
  const open = useGameStore((state) => state.scoreboardOpen);
  const toggleScoreboard = useGameStore((state) => state.toggleScoreboard);
  const visited = useGameStore((state) => state.visited.length);
  const collected = useGameStore((state) => state.collected.length);
  const goals = useGameStore((state) => state.goals);
  const achievements = useGameStore((state) => state.achievements);
  const elapsed = useElapsed();

  const career: [string, number][] = [
    [t('scoreboard.stats.live'), careerStats.live],
    [t('scoreboard.stats.endpoints'), careerStats.endpoints],
    [t('scoreboard.stats.tests'), careerStats.tests],
    [t('scoreboard.stats.migrations'), careerStats.migrations],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 grid place-items-center bg-void/60 p-4 backdrop-blur-sm"
          onClick={() => toggleScoreboard(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-line-strong bg-void/95 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              {t('scoreboard.title')}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] font-mono text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground uppercase">
                    <th className="pb-2 font-normal">{t('scoreboard.player')}</th>
                    <th className="pb-2 font-normal">{t('hud.objects')}</th>
                    <th className="pb-2 font-normal">{t('hud.commits')}</th>
                    <th className="pb-2 font-normal">{t('hud.goals')}</th>
                    <th className="pb-2 font-normal">{t('hud.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line text-ink">
                    <td className="py-2 text-signal">{profile.shortName}</td>
                    <td className="py-2 tabular-nums">
                      {visited}/{HOTSPOT_IDS.length}
                    </td>
                    <td className="py-2 tabular-nums">
                      {collected}/{COMMIT_IDS.length}
                    </td>
                    <td className="py-2 tabular-nums">{goals}</td>
                    <td className="py-2 tabular-nums">
                      {elapsed === null ? '—' : formatDuration(elapsed)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-5 mb-2 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {t('scoreboard.career')}
            </h3>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
              {career.map(([label, value]) => (
                <li key={label} className="flex flex-col bg-abyss p-3">
                  <span className="font-display text-2xl font-semibold text-signal tabular-nums">
                    {value}
                  </span>
                  <span className="font-mono text-[0.6rem] tracking-[0.08em] text-muted-foreground uppercase">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-5 mb-2 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {t('scoreboard.achievements')}
            </h3>
            <AchievementList unlocked={achievements} />

            <p className="mt-4 text-center font-mono text-[0.65rem] text-faint uppercase">
              {t('scoreboard.close')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Controles de toque                                                         */
/* -------------------------------------------------------------------------- */

export function TouchButtons() {
  const t = useTranslations('game');
  const requestKick = useGameStore((state) => state.requestKick);
  const requestEmote = useGameStore((state) => state.requestEmote);
  const rotateCamera = useGameStore((state) => state.rotateCamera);

  const round =
    'grid place-items-center rounded-full border border-line-strong bg-void/60 text-ink backdrop-blur-md transition-transform active:scale-95';

  return (
    <div className="absolute right-5 bottom-7 flex items-end gap-3">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          aria-label={t('rotateLeft')}
          onClick={() => rotateCamera(-1)}
          className={`${round} h-11 w-11`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t('rotateRight')}
          onClick={() => rotateCamera(1)}
          className={`${round} h-11 w-11`}
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t('wave')}
          onClick={requestEmote}
          className={`${round} h-11 w-11`}
        >
          <Hand className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={requestKick}
        className="grid h-20 w-20 place-items-center rounded-full border border-signal/60 bg-signal/15 font-mono text-xs tracking-[0.1em] text-signal uppercase backdrop-blur-md transition-transform active:scale-95"
      >
        {t('kick')}
      </button>
    </div>
  );
}

/**
 * Caminho para quem não enxerga o canvas.
 *
 * O quarto é desenhado num canvas, que o leitor de tela não lê. Esta lista
 * invisível tem um botão por objeto, com o mesmo efeito de chegar perto e
 * interagir. Fica visível quando recebe foco pelo teclado.
 */
export function AccessibleObjectList() {
  const t = useTranslations('game');
  const openPanelFor = useGameStore((state) => state.openPanelFor);

  return (
    <nav
      aria-label={t('objectsLabel')}
      className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-28 focus-within:left-5 focus-within:z-40"
    >
      <ul className="flex flex-col gap-2">
        {HOTSPOT_IDS.map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => openPanelFor(id)}
              className="rounded-full bg-void/85 px-4 py-2 font-mono text-xs text-ink"
            >
              {t(`hint.${id}`)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
