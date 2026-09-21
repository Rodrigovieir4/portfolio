import { expect, test } from '@playwright/test';

import { openGame, readGame } from './helpers';

test('no celular o joystick move o personagem', async ({ page }) => {
  await openGame(page);
  const joystick = page.getByRole('application', { name: 'Controle de movimento' });
  await expect(joystick).toBeVisible();
  await expect(page.getByRole('button', { name: 'Chutar' })).toBeVisible();

  const box = await joystick.boundingBox();
  if (!box) throw new Error('joystick sem tamanho');
  const before = await readGame(page);

  // Arrasta para cima como um dedo faria.
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy - 50, { steps: 5 });
  await page.waitForTimeout(1000);
  await page.mouse.up();

  const after = await readGame(page);
  expect(Math.hypot(after.px - before.px, after.pz - before.pz)).toBeGreaterThan(1);
});
