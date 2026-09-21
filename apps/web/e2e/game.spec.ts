import { expect, test } from '@playwright/test';

import { openGame, readGame, walkTo } from './helpers';

/**
 * O jogo, jogado de verdade: teclado, controlador de personagem e colisão.
 *
 * Cada teste descreve algo que um visitante faz. Se um deles quebra, é porque
 * um visitante também não conseguiria mais fazer aquilo.
 */

test('nasce em cima do tapete e já vê a primeira dica', async ({ page }) => {
  await openGame(page);
  await expect(page.getByRole('button', { name: /Sobre mim/ }).last()).toBeVisible();
  await page.keyboard.press('KeyE');
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Oi, eu sou o Rodrigo.' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('anda até a estante e abre a trajetória com o conteúdo real', async ({ page }) => {
  await openGame(page);
  const snapshot = await walkTo(page, 3.6, -1.4);
  expect(snapshot.nearby).toBe('trofeus');
  await page.keyboard.press('KeyE');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Trajetória' })).toBeVisible();
  await expect(dialog.getByText('DBC Software')).toBeVisible();
});

test('senta no PC, usa o terminal e abre um projeto', async ({ page }) => {
  await openGame(page);
  await walkTo(page, 0, 0.5, 0.4);
  const snapshot = await walkTo(page, -1.8, -3.1);
  expect(snapshot.nearby).toBe('pc');
  await page.keyboard.press('KeyE');

  const os = page.getByRole('dialog', { name: 'RodrigoOS' });
  await expect(os).toBeVisible();
  await os.getByRole('button', { name: 'Terminal' }).click();

  const terminal = os.getByRole('textbox');
  await terminal.fill('whoami');
  await terminal.press('Enter');
  await expect(os.getByText('Rodrigo Vieira de Sousa · Desenvolvedor Full-Stack')).toBeVisible();

  await terminal.fill('open esplendido');
  await terminal.press('Enter');
  await expect(os.getByRole('region', { name: '~/projetos/esplendido' })).toBeVisible();
  await expect(os.getByText('286')).toBeVisible();

  await os.getByRole('button', { name: 'Sair do PC' }).click();
  await expect(os).toHaveCount(0);
});

test('pega um commit e o contador anda', async ({ page }) => {
  await openGame(page);
  await walkTo(page, 1.2, 3.0, 0.1);
  await expect.poll(async () => (await readGame(page)).collected).toBe(1);
});

test('apaga a luz no abajur e ganha a conquista', async ({ page }) => {
  await openGame(page);
  await walkTo(page, 0, 0.5, 0.4);
  const snapshot = await walkTo(page, -4.3, -3.7);
  expect(snapshot.nearby).toBe('abajur');
  await page.keyboard.press('KeyE');
  await expect.poll(async () => (await readGame(page)).lampOn).toBe(false);
  await expect(page.getByText('Boa noite')).toBeVisible();
});

test('faz gol e cai no contato', async ({ page }) => {
  await openGame(page);
  const goal = { x: 3.3, z: 4.45 };

  // Com a bola parada no meio, basta alinhar atrás dela e chutar. Tenta de novo
  // se a aproximação empurrar a bola, como uma pessoa faria.
  for (let attempt = 0; attempt < 4; attempt++) {
    const before = await readGame(page);
    if (before.goals > 0) break;
    const dx = goal.x - before.bx;
    const dz = goal.z - before.bz;
    const length = Math.hypot(dx, dz);
    await walkTo(page, before.bx - (dx / length) * 0.7, before.bz - (dz / length) * 0.7, 0.1);
    await page.keyboard.press('Space');
    await page.waitForTimeout(2500);
  }

  await expect.poll(async () => (await readGame(page)).goals).toBeGreaterThan(0);
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Golaço.' })).toBeVisible();
});

test('a versão em inglês traduz a interface do jogo', async ({ page }) => {
  await openGame(page, 'en');
  await expect(page.getByRole('button', { name: /About me/ }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: 'View résumé' })).toBeVisible();
});
