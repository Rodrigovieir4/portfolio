import type { Page } from '@playwright/test';

/** O que a página expõe em window.__game quando aberta com ?debug. */
export interface GameSnapshot {
  px: number;
  pz: number;
  bx: number;
  bz: number;
  yaw: number;
  nearby: string | null;
  openPanel: string | null;
  visited: string[];
  collected: number;
  achievements: string[];
  goals: number;
  lampOn: boolean;
}

export function readGame(page: Page): Promise<GameSnapshot> {
  return page.evaluate(() => {
    const game = (window as unknown as { __game: any }).__game;
    const player = game.runtime.playerPosition;
    const ball = game.runtime.ballPosition;
    const state = game.getState();
    return {
      px: player.x,
      pz: player.z,
      bx: ball.x,
      bz: ball.z,
      yaw: game.runtime.cameraYaw,
      nearby: state.nearby,
      openPanel: state.openPanel,
      visited: state.visited,
      collected: state.collected.length,
      achievements: state.achievements,
      goals: state.goals,
      lampOn: state.lampOn,
    };
  });
}

/** Abre o jogo em modo de depuração e espera o motor e a física ficarem prontos. */
export async function openGame(page: Page, locale = 'pt') {
  const path = { pt: '/pt/jogo', en: '/en/play', es: '/es/jugar' }[locale] ?? '/pt/jogo';
  await page.goto(`${path}?debug`);
  await page.waitForFunction(() => 'undefined' !== typeof (window as any).__game);
  await page.locator('canvas').waitFor();
  // O personagem precisa de alguns quadros para assentar no chão antes de o
  // teste começar a apertar teclas.
  await page.waitForFunction(() => (window as any).__game.runtime.playerPosition.y > 0.3);
  await page.mouse.click(10, 400);
}

/**
 * Anda até (x, z) segurando as mesmas teclas que uma pessoa seguraria.
 *
 * Converte a direção no mundo para eixos de tela com o ângulo atual da
 * câmera, que é o inverso exato do que o personagem faz com a entrada. Assim o
 * teste passa pelo mesmo caminho do jogador de verdade: teclado, controlador,
 * colisão.
 */
export async function walkTo(
  page: Page,
  x: number,
  z: number,
  tolerance = 0.15,
  timeoutMs = 15_000,
) {
  const held = new Set<string>();
  const setKey = async (key: string, on: boolean) => {
    if (on && !held.has(key)) {
      await page.keyboard.down(key);
      held.add(key);
    } else if (!on && held.has(key)) {
      await page.keyboard.up(key);
      held.delete(key);
    }
  };

  const start = Date.now();
  let snapshot = await readGame(page);
  while (Date.now() - start < timeoutMs) {
    snapshot = await readGame(page);
    const dx = x - snapshot.px;
    const dz = z - snapshot.pz;
    if (Math.hypot(dx, dz) < tolerance) break;
    const sin = Math.sin(snapshot.yaw);
    const cos = Math.cos(snapshot.yaw);
    const inputX = cos * dx - sin * dz;
    const inputY = -sin * dx - cos * dz;
    const scale = Math.max(Math.abs(inputX), Math.abs(inputY));
    await setKey('KeyD', inputX / scale > 0.35);
    await setKey('KeyA', inputX / scale < -0.35);
    await setKey('KeyW', inputY / scale > 0.35);
    await setKey('KeyS', inputY / scale < -0.35);
    await page.waitForTimeout(35);
  }
  for (const key of [...held]) await setKey(key, false);
  await page.waitForTimeout(150);
  return readGame(page);
}
