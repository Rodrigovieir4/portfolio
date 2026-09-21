import { defineConfig, devices } from '@playwright/test';

const PORT = 3200;

/**
 * Testes de ponta a ponta, contra o build de produção.
 *
 * O jogo roda em WebGL, e o navegador de teste não tem placa de vídeo. O
 * SwiftShader desenha em software: mais lento, mas o bastante para a física,
 * as colisões e os painéis funcionarem de verdade, que é o que os testes olham.
 * Nenhum teste compara pixel, porque renderização em software varia entre
 * sistemas e daria falso negativo.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 820 } },
      testIgnore: '**/mobile.spec.ts',
    },
    { name: 'celular', use: { ...devices['Pixel 7'] }, testMatch: '**/mobile.spec.ts' },
  ],
  webServer: {
    command: `pnpm exec next start --port ${PORT}`,
    url: `http://localhost:${PORT}/pt`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
