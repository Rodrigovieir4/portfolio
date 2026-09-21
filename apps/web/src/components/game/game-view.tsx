'use client';

import { runtime, useGameStore } from '@portfolio/game/state';
import { useDeviceTier } from '@portfolio/gl/device';
import { useMediaQuery } from '@portfolio/ui';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';

import {
  AccessibleObjectList,
  HelpCard,
  InteractPrompt,
  Onboarding,
  Scoreboard,
  Toasts,
  TopBar,
  TouchButtons,
} from './hud';
import { Joystick } from './joystick';
import { GamePanels } from './panels';
import { RodrigoOS } from './rodrigo-os';

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

/**
 * Teclas de ação: um evento por toque, nunca repetido segurando a tecla.
 * Andar é estado contínuo e é lido pelo próprio personagem, dentro do jogo.
 */
function useActionKeys() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || isTyping(event.target)) return;
      const game = useGameStore.getState();

      // O placar abre e fecha até por cima de painel; o resto espera o painel fechar.
      if (event.code === 'KeyP') {
        game.toggleScoreboard();
        return;
      }
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
        case 'Digit1':
          game.requestEmote();
          break;
        case 'KeyZ':
          game.rotateCamera(-1);
          break;
        case 'KeyX':
          game.rotateCamera(1);
          break;
        case 'KeyH':
          game.toggleHelp();
          break;
        case 'KeyM':
          game.toggleSound();
          break;
        case 'Escape':
          game.toggleHelp(false);
          game.toggleScoreboard(false);
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}

export function GameView() {
  const t = useTranslations('game');
  const device = useDeviceTier();
  const touch = useMediaQuery('(pointer: coarse)');
  const [forced, setForced] = useState(false);

  useActionKeys();

  // Com ?debug na URL, o estado do jogo fica em window.__game. É o que permite
  // um teste automatizado dirigir o personagem pelo teclado lendo onde ele está.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return;
    (window as unknown as { __game: unknown }).__game = {
      runtime,
      getState: useGameStore.getState,
    };
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
      <Onboarding touch={touch} />
      <InteractPrompt />
      <Toasts />
      <HelpCard />
      <Scoreboard />
      <AccessibleObjectList />

      {touch && (
        <>
          <div className="absolute bottom-6 left-5">
            <Joystick label={t('joystick')} />
          </div>
          <TouchButtons />
        </>
      )}

      <GamePanels />
      <RodrigoOS />
    </div>
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
