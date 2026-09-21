import { CanvasTexture, SRGBColorSpace } from 'three';

/**
 * Texturas desenhadas num canvas, na hora, em vez de imagens baixadas.
 *
 * Tela de monitor, lousa, mapa e camisa são desenhos simples: pintar com a
 * API do canvas custa alguns milissegundos e zero bytes de rede, e deixa o
 * conteúdo da textura sob controle do código, como o texto da lousa.
 *
 * Cada fábrica guarda o resultado: a mesma textura serve a todo objeto que a
 * usa, e nada é redesenhado quando o React renderiza de novo.
 */

const cache = new Map<string, CanvasTexture>();

function paint(
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  const cached = cache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);
  return texture;
}

/** Gerador pseudoaleatório com semente: o mesmo desenho a cada carga. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';
const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

/** Monitor da esquerda: um editor com código colorido. */
export function codeScreen() {
  return paint('code', 320, 200, (ctx) => {
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#141925';
    ctx.fillRect(0, 0, 320, 16);
    ['#f43f5e', '#fbbf24', '#4ade80'].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(10 + index * 12, 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    const random = seeded(7);
    const palette = ['#c8f751', '#4ee0d0', '#7b5cff', '#b6bdcb', '#ff6b3d', '#7d8698'];
    for (let line = 0; line < 13; line++) {
      const y = 28 + line * 13;
      ctx.fillStyle = '#3a4256';
      ctx.fillRect(6, y, 10, 5);
      let x = 24 + Math.floor(random() * 3) * 12;
      const tokens = 2 + Math.floor(random() * 4);
      for (let token = 0; token < tokens && x < 300; token++) {
        const width = 14 + random() * 56;
        ctx.fillStyle = palette[Math.floor(random() * palette.length)] ?? '#b6bdcb';
        ctx.fillRect(x, y, width, 5);
        x += width + 7;
      }
    }
  });
}

/** Monitor da direita: um painel com gráfico de barras e números. */
export function dashboardScreen() {
  return paint('dashboard', 320, 200, (ctx) => {
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#c8f751';
    ctx.font = `bold 22px ${MONO}`;
    ctx.fillText('286', 16, 38);
    ctx.fillStyle = '#7d8698';
    ctx.font = `10px ${MONO}`;
    ctx.fillText('ENDPOINTS', 16, 52);
    ctx.fillStyle = '#4ee0d0';
    ctx.font = `bold 22px ${MONO}`;
    ctx.fillText('1081', 130, 38);
    ctx.fillStyle = '#7d8698';
    ctx.font = `10px ${MONO}`;
    ctx.fillText('TESTES', 130, 52);
    const random = seeded(3);
    for (let bar = 0; bar < 14; bar++) {
      const height = 30 + random() * 90;
      ctx.fillStyle = bar % 4 === 3 ? '#7b5cff' : '#c8f751';
      ctx.globalAlpha = 0.85;
      ctx.fillRect(16 + bar * 21, 186 - height, 14, height);
    }
    ctx.globalAlpha = 1;
  });
}

/** Lousa com a stack escrita à mão, em cores de pincel. */
export function whiteboard() {
  return paint('whiteboard', 512, 280, (ctx) => {
    ctx.fillStyle = '#e8ebf0';
    ctx.fillRect(0, 0, 512, 280);
    ctx.strokeStyle = '#c9ced8';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 500, 268);

    const words: [string, string, number, number, number][] = [
      ['STACK', '#1f2a44', 30, 48, -0.03],
      ['TypeScript', '#2456c9', 40, 102, -0.02],
      ['NestJS', '#c92442', 300, 96, 0.03],
      ['Next.js', '#1f2a44', 58, 158, 0.02],
      ['PostgreSQL', '#2456c9', 250, 160, -0.03],
      ['AWS', '#d97706', 60, 222, -0.04],
      ['Docker', '#2456c9', 180, 226, 0.02],
      ['Pix + Stripe', '#15803d', 320, 226, -0.02],
    ];
    for (const [text, color, x, y, angle] of words) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.font = `bold ${text === 'STACK' ? 34 : 30}px ${SANS}`;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    // setas de rabisco ligando as camadas
    ctx.strokeStyle = '#c92442';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 88);
    ctx.quadraticCurveTo(275, 70, 292, 84);
    ctx.moveTo(150, 142);
    ctx.quadraticCurveTo(200, 150, 240, 148);
    ctx.stroke();
  });
}

/**
 * Contornos de continente muito simplificados, em coordenadas normalizadas
 * de uma projeção equirretangular. Não precisam ser fiéis: viram pontinhos
 * de uma matriz e só têm que ser reconhecíveis a um passo de distância.
 */
const CONTINENTS: [number, number][][] = [
  [
    [0.08, 0.18],
    [0.28, 0.12],
    [0.34, 0.22],
    [0.27, 0.36],
    [0.22, 0.44],
    [0.17, 0.35],
    [0.1, 0.3],
  ],
  [
    [0.29, 0.5],
    [0.36, 0.49],
    [0.41, 0.56],
    [0.38, 0.7],
    [0.33, 0.83],
    [0.3, 0.7],
    [0.27, 0.58],
  ],
  [
    [0.45, 0.17],
    [0.55, 0.13],
    [0.59, 0.22],
    [0.55, 0.3],
    [0.47, 0.31],
    [0.44, 0.25],
  ],
  [
    [0.46, 0.36],
    [0.56, 0.34],
    [0.62, 0.44],
    [0.58, 0.62],
    [0.53, 0.71],
    [0.5, 0.56],
    [0.45, 0.46],
  ],
  [
    [0.58, 0.13],
    [0.86, 0.11],
    [0.93, 0.25],
    [0.83, 0.38],
    [0.7, 0.43],
    [0.62, 0.34],
    [0.58, 0.24],
  ],
  [
    [0.8, 0.6],
    [0.9, 0.58],
    [0.93, 0.68],
    [0.85, 0.73],
    [0.79, 0.67],
  ],
];

/** Onde os produtos rodam. Posições aproximadas na mesma projeção. */
const PINS: { label: string; x: number; y: number; home?: boolean }[] = [
  { label: 'BR', x: 0.365, y: 0.64, home: true },
  { label: 'PT', x: 0.463, y: 0.27 },
  { label: 'IE', x: 0.455, y: 0.2 },
];

export function worldMap() {
  const width = 512;
  const height = 320;
  return paint('map', width, height, (ctx) => {
    ctx.fillStyle = '#0d1220';
    ctx.fillRect(0, 0, width, height);

    // matriz de pontos: cada ponto dentro de um continente acende
    for (const shape of CONTINENTS) {
      ctx.beginPath();
      shape.forEach(([x, y], index) =>
        index === 0 ? ctx.moveTo(x * width, y * height) : ctx.lineTo(x * width, y * height),
      );
      ctx.closePath();
      for (let y = 4; y < height; y += 8) {
        for (let x = 4; x < width; x += 8) {
          if (!ctx.isPointInPath(x, y)) continue;
          ctx.fillStyle = '#34406a';
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
    }

    // rotas de São Paulo para a Europa
    const home = PINS[0]!;
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c8f751';
    for (const pin of PINS.slice(1)) {
      ctx.beginPath();
      ctx.moveTo(home.x * width, home.y * height);
      ctx.quadraticCurveTo(
        ((home.x + pin.x) / 2 - 0.06) * width,
        ((home.y + pin.y) / 2 - 0.08) * height,
        pin.x * width,
        pin.y * height,
      );
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const pin of PINS) {
      const x = pin.x * width;
      const y = pin.y * height;
      ctx.fillStyle = pin.home ? '#c8f751' : '#4ee0d0';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#eef1f6';
      ctx.font = `bold 16px ${MONO}`;
      ctx.fillText(pin.label, x + 14, y + 5);
    }
  });
}

/** Camisa de time, com nome e número. */
export function jersey() {
  return paint('jersey', 160, 190, (ctx) => {
    ctx.clearRect(0, 0, 160, 190);
    ctx.fillStyle = '#10131a';
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(62, 4);
    ctx.quadraticCurveTo(80, 22, 98, 4);
    ctx.lineTo(120, 10);
    ctx.lineTo(156, 44);
    ctx.lineTo(134, 68);
    ctx.lineTo(122, 58);
    ctx.lineTo(122, 186);
    ctx.lineTo(38, 186);
    ctx.lineTo(38, 58);
    ctx.lineTo(26, 68);
    ctx.lineTo(4, 44);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c8f751';
    ctx.fillRect(38, 82, 84, 6);
    ctx.font = `bold 14px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText('SOUSA', 80, 72);
    ctx.font = `bold 56px ${SANS}`;
    ctx.fillText('10', 80, 150);
  });
}

/** Certificado genérico: papel, título, linhas de texto e selo. */
export function certificate(seed: number) {
  return paint(`certificate-${seed}`, 128, 92, (ctx) => {
    ctx.fillStyle = '#f3efe4';
    ctx.fillRect(0, 0, 128, 92);
    ctx.strokeStyle = '#c9b98a';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, 118, 82);
    ctx.fillStyle = '#3b3350';
    ctx.fillRect(28, 18, 72, 7);
    const random = seeded(seed + 11);
    ctx.fillStyle = '#9aa0ad';
    for (let line = 0; line < 4; line++) {
      const width = 50 + random() * 40;
      ctx.fillRect(64 - width / 2, 34 + line * 9, width, 3);
    }
    ctx.fillStyle = seed % 3 === 0 ? '#c92442' : seed % 3 === 1 ? '#2456c9' : '#d9a441';
    ctx.beginPath();
    ctx.arc(100, 72, 8, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Tapete da entrada, com a saudação escrita no idioma do visitante. */
export function doormat() {
  return paint('doormat', 280, 160, (ctx) => {
    ctx.fillStyle = '#3b2f4d';
    ctx.fillRect(0, 0, 280, 160);
    ctx.strokeStyle = '#c8f751';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 256, 136);
    ctx.fillStyle = '#c8f751';
    ctx.font = `bold 44px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.fillText('> olá_', 140, 96);
  });
}

/** Piso de tábuas: faixas com leve variação de tom e emendas desencontradas. */
export function floorPlanks() {
  const texture = paint('floor', 512, 512, (ctx) => {
    const random = seeded(21);
    const plank = 64;
    for (let row = 0; row < 512 / plank; row++) {
      const shade = 34 + Math.floor(random() * 10);
      ctx.fillStyle = `rgb(${shade + 8}, ${shade}, ${shade + 16})`;
      ctx.fillRect(0, row * plank, 512, plank);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, row * plank, 512, 2);
      const seam = Math.floor(random() * 400) + 40;
      ctx.fillRect(seam, row * plank, 2, plank);
    }
  });
  return texture;
}
