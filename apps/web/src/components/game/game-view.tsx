'use client';

import { profile, t as translate, type Locale } from '@portfolio/content';
import { HOTSPOT_IDS, runtime, useGameStore } from '@portfolio/game/state';
import { useDeviceTier } from '@portfolio/gl/device';
import { useMediaQuery } from '@portfolio/ui';
import { FileText, Footprints, RotateCcw, RotateCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';

import { Joystick } from './joystick';
import { GamePanels } from './panels';

/**
 * three e Rapier entram só no navegador. O Rapier ainda baixa um módulo
 * WebAssembly, então o canvas mostra a tela de carregamento enquanto isso.
 */
const GameCanvas = dynamic(() => import('@portfolio/game').then((module) => module.GameCanvas), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export function GameView() {
  const t = useTranslations('game');
  const device = useDeviceTier();
  const touch = useMediaQuery('(pointer: coarse)');
  const [forced, setForced] = useState(false);

  // Com ?debug na URL, o estado do jogo fica em window.__game. É o que permite
  // um teste automatizado dirigir o personagem pelo teclado lendo onde ele está.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return;
    (window as unknown as { __game: unknown }).__game = {
      runtime,
      getState: useGameStore.getState,
    };
  }, []);

  // Ações pontuais: um evento por toque de tecla, nunca repetido. Andar é
  // estado contínuo e é lido pelo próprio personagem, dentro do jogo.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || isTyping(event.target)) return;
      const game = useGameStore.getState();
      if (game.openPanel) return;

      switch (event.code) {
        case 'KeyE':
        case 'Enter':
          game.interact();
          break;
        case 'Space':
          event.preventDefault();
          game.requestKick();
          break;
        case 'KeyZ':
          game.rotateCamera(-1);
          break;
        case 'KeyX':
          game.rotateCamera(1);
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (device.tier === 'off' && !forced) {
    return <Unsupported onForce={() => setForced(true)} />;
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-void select-none">
      <GameCanvas
        className="absolute inset-0 touch-none"
        quality={device.tier === 'low' ? 'low' : 'high'}
      />

      <TopBar />
      <InteractPrompt />
      <AccessibleObjectList />

      {touch ? (
        <>
          <div className="absolute bottom-6 left-6">
            <Joystick label={t('joystick')} />
          </div>
          <TouchButtons />
        </>
      ) : (
        <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase">
          {t('controlsKeyboard')}
        </p>
      )}

      <GamePanels />
    </div>
  );
}

function TopBar() {
  const t = useTranslations('game');
  const locale = useLocale() as Locale;
  const visited = useGameStore((state) => state.visited.length);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg leading-none font-semibold text-ink">{profile.name}</p>
        <p className="font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">
          {translate(profile.headline, locale)}
          <span className="ml-2 rounded-full border border-ember/40 px-2 py-0.5 text-ember">
            {t('prototype')}
          </span>
        </p>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-void/60 px-4 py-2 font-mono text-xs tracking-[0.12em] whitespace-nowrap text-signal uppercase backdrop-blur-md transition-colors hover:bg-signal hover:text-void"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {t('backToCv')}
        </Link>
        <span className="rounded-full bg-void/60 px-3 py-1 font-mono text-[0.68rem] text-muted-foreground backdrop-blur-md">
          <Footprints className="mr-1.5 inline h-3 w-3 text-signal" aria-hidden="true" />
          {t('visited', { count: visited, total: HOTSPOT_IDS.length })}
        </span>
      </div>
    </header>
  );
}

/**
 * A dica que aparece quando o personagem pisa perto de um objeto.
 *
 * É um botão de verdade: no desktop mostra a tecla, no celular é o próprio
 * alvo do toque. Some enquanto um painel está aberto.
 */
function InteractPrompt() {
  const t = useTranslations('game');
  const nearby = useGameStore((state) => state.nearby);
  const openPanel = useGameStore((state) => state.openPanel);
  const interact = useGameStore((state) => state.interact);

  if (!nearby || openPanel) return null;

  return (
    <div className="absolute inset-x-0 bottom-24 flex justify-center">
      <button
        type="button"
        onClick={interact}
        className="inline-flex items-center gap-3 rounded-full border border-signal/50 bg-void/80 py-2 pr-5 pl-2 font-mono text-sm text-ink shadow-[0_0_32px_-8px_rgb(200_247_81/0.6)] backdrop-blur-md transition-transform active:scale-95"
      >
        <kbd className="grid h-7 w-7 place-items-center rounded-full bg-signal font-mono text-xs text-void">
          E
        </kbd>
        {t(`hint.${nearby}`)}
      </button>
    </div>
  );
}

function TouchButtons() {
  const t = useTranslations('game');
  const requestKick = useGameStore((state) => state.requestKick);
  const rotateCamera = useGameStore((state) => state.rotateCamera);

  const round =
    'grid place-items-center rounded-full border border-line-strong bg-void/60 text-ink backdrop-blur-md active:scale-95 transition-transform';

  return (
    <div className="absolute right-6 bottom-8 flex items-end gap-3">
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
function AccessibleObjectList() {
  const t = useTranslations('game');
  const openPanelFor = useGameStore((state) => state.openPanelFor);

  return (
    <nav
      aria-label={t('objectsLabel')}
      className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-24 focus-within:left-5"
    >
      <ul className="flex flex-col gap-2">
        {HOTSPOT_IDS.map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => openPanelFor(id)}
              className="rounded-full bg-void/80 px-4 py-2 font-mono text-xs text-ink"
            >
              {t(`hint.${id}`)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LoadingScreen() {
  const t = useTranslations('game');
  return (
    <div className="absolute inset-0 grid place-items-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-line">
          <div className="h-full w-1/3 animate-[loading_1.1s_ease-in-out_infinite] rounded-full bg-signal" />
        </div>
        <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}

function Unsupported({ onForce }: { onForce: () => void }) {
  const t = useTranslations('game');
  return (
    <div className="grid min-h-dvh place-items-center bg-void px-6">
      <div className="flex max-w-md flex-col gap-5 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('unsupported.title')}</h1>
        <p className="leading-relaxed text-ink-soft">{t('unsupported.body')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-signal px-6 py-3 font-mono text-xs tracking-[0.12em] text-void uppercase"
          >
            {t('unsupported.cta')}
          </Link>
          <button
            type="button"
            onClick={onForce}
            className="rounded-full border border-line-strong px-6 py-3 font-mono text-xs tracking-[0.12em] text-ink uppercase"
          >
            {t('unsupported.force')}
          </button>
        </div>
      </div>
    </div>
  );
}
