/**
 * Gera o pôster do quarto que aparece no alto do currículo.
 *
 * O pôster é um quadro do jogo de verdade, não uma arte feita à mão: quando o
 * quarto muda, basta rodar isto de novo e a imagem acompanha. É a mesma ideia
 * dos testes de ponta a ponta — dirigir o jogo pelo teclado e ler o estado por
 * window.__game, que só existe com ?debug na URL.
 *
 * Precisa de um servidor de produção no ar:
 *
 *   pnpm --filter @portfolio/web build
 *   pnpm --filter @portfolio/web start --port 3200
 *   pnpm --filter @portfolio/web poster
 *
 * Usa a GPU de verdade de propósito. Em renderização por software o brilho
 * derruba o contexto WebGL antes do fim, e o que sai é um retângulo preto.
 */

import { chromium } from '@playwright/test';
import sharp from 'sharp';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const DESTINO = new URL('../public/images/quarto.webp', import.meta.url).pathname.slice(1);

/** Enquadramento: a câmera segue o boneco, então é ele que decide o quadro. */
const LARGURA = 1600;
const ALTURA = 940;
const RECORTE = { x: 200, y: 0, width: 1190, height: 780 };
/** Onde o boneco para. Perto do meio do quarto, para nada ficar de fora. */
const ALVO = { x: 0, z: -0.3 };

const ler = (page) =>
  page.evaluate(() => {
    const { runtime } = window.__game;
    return { x: runtime.playerPosition.x, z: runtime.playerPosition.z, yaw: runtime.cameraYaw };
  });

/** Anda até (x, z) segurando as mesmas teclas que uma pessoa seguraria. */
async function andarAte(page, alvo, tolerancia = 0.15, limiteMs = 20_000) {
  const presas = new Set();
  const tecla = async (nome, ligada) => {
    if (ligada && !presas.has(nome)) {
      await page.keyboard.down(nome);
      presas.add(nome);
    } else if (!ligada && presas.has(nome)) {
      await page.keyboard.up(nome);
      presas.delete(nome);
    }
  };

  const inicio = Date.now();
  while (Date.now() - inicio < limiteMs) {
    const atual = await ler(page);
    const dx = alvo.x - atual.x;
    const dz = alvo.z - atual.z;
    if (Math.hypot(dx, dz) < tolerancia) break;

    // O inverso exato do que o personagem faz com a entrada: do rumo no mundo
    // para os eixos da tela, usando o ângulo atual da câmera.
    const sin = Math.sin(atual.yaw);
    const cos = Math.cos(atual.yaw);
    const eixoX = cos * dx - sin * dz;
    const eixoY = -sin * dx - cos * dz;
    const escala = Math.max(Math.abs(eixoX), Math.abs(eixoY));
    await tecla('KeyD', eixoX / escala > 0.35);
    await tecla('KeyA', eixoX / escala < -0.35);
    await tecla('KeyW', eixoY / escala > 0.35);
    await tecla('KeyS', eixoY / escala < -0.35);
    await page.waitForTimeout(35);
  }
  for (const nome of [...presas]) await tecla(nome, false);
  await page.waitForTimeout(150);
}

const navegador = await chromium.launch({ args: ['--ignore-gpu-blocklist'] });
const contexto = await navegador.newContext({
  viewport: { width: LARGURA, height: ALTURA },
  deviceScaleFactor: 2,
});
// Nível alto travado: o pôster mostra a melhor cara que o quarto tem.
await contexto.addInitScript(() => window.localStorage.setItem('rodrigo:quality', 'alto'));

const page = await contexto.newPage();
await page.goto(`${BASE}/pt/jogo?debug`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__game?.runtime.playerPosition.y > 0.3);
await page.waitForTimeout(3000);

// Foco no canto esquerdo: no meio de baixo fica o botão de interagir, e clicar
// nele abre um painel, que congela o boneco.
await page.mouse.click(10, 400);
await andarAte(page, ALVO);

// Um passo curto na direção da câmera, para ele terminar de frente.
await page.keyboard.down('KeyS');
await page.waitForTimeout(260);
await page.keyboard.up('KeyS');
await page.waitForTimeout(2500);

// Esconde o HUD: sobe do canvas até o topo escondendo, em cada nível, tudo que
// não está no caminho do canvas.
await page.evaluate(() => {
  let no = document.querySelector('canvas');
  while (no.parentElement) {
    for (const irmao of Array.from(no.parentElement.children)) {
      if (irmao !== no) irmao.style.display = 'none';
    }
    no = no.parentElement;
  }
});
await page.waitForTimeout(800);

const perdido = await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  return ctx ? ctx.isContextLost() : true;
});
if (perdido) throw new Error('o contexto WebGL caiu: o pôster sairia preto');

const png = await page.screenshot({ clip: RECORTE });
await navegador.close();

const info = await sharp(png).resize(1600).webp({ quality: 82 }).toFile(DESTINO);
console.log(
  `pôster gravado: ${DESTINO} — ${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB`,
);
