import { expect, test } from '@playwright/test';

/*
 * A raiz escolhe o idioma pelo Accept-Language do navegador. Cada caso fixa
 * o idioma do navegador e confere o destino, que é o que um visitante de fora
 * do Brasil vê primeiro.
 */
test.describe('navegador em português', () => {
  test.use({ locale: 'pt-BR' });
  test('a raiz leva ao currículo em português', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rodrigo');
  });
});

test.describe('navegador em inglês', () => {
  test.use({ locale: 'en-US' });
  test('a raiz leva ao currículo em inglês', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });
});

test('o currículo tem a porta de entrada para o jogo', async ({ page }) => {
  await page.goto('/pt');
  await page.getByRole('banner').getByRole('link', { name: /Jogar/ }).click();
  await expect(page).toHaveURL(/\/pt\/jogo$/);
});

test('as páginas de projeto existem nos três idiomas', async ({ page }) => {
  for (const path of [
    '/pt/projetos/esplendido',
    '/en/projects/db-store',
    '/es/proyectos/db-connect',
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
  }
});
