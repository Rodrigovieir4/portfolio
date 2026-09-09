#!/usr/bin/env node
/**
 * Importa os arquivos binarios do portfolio antigo.
 *
 * Os PDFs de certificado, o curriculo e a foto vivem no repositorio anterior
 * com nomes acentuados e cheios de espaco, o que atrapalha URL, cache e
 * qualquer coisa que passe por linha de comando. Este script baixa cada um e
 * grava com um nome estavel em kebab-case, exatamente o que
 * packages/content/src/data/certifications.ts referencia.
 *
 * Rodar de novo e seguro: arquivos ja presentes sao pulados. Use --forcar para
 * rebaixar tudo.
 *
 *   node scripts/importar-assets.mjs
 *   node scripts/importar-assets.mjs --forcar
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLICO = join(RAIZ, 'apps', 'web', 'public');
const BASE = 'https://raw.githubusercontent.com/Rodrigovieir4/meu-portfolio/main/portfolio/assets';

const FORCAR = process.argv.includes('--forcar');

/** origem no repositorio antigo -> destino em apps/web/public */
const ARQUIVOS = [
  ['EU.png', 'images/rodrigo.png'],
  ['Currículo_Rodrigo_Vieira_de_Sousa.pdf', 'curriculo/rodrigo-vieira-de-sousa-pt.pdf'],

  ['certificados/Wizard - Certificado Curso de Inglês.pdf', 'certificados/wizard-ingles.pdf'],
  ['certificados/certificate Introdução ao Python.pdf', 'certificados/rocketseat-python.pdf'],
  ['certificados/certificate Minicurso de Java.pdf', 'certificados/rocketseat-java.pdf'],

  [
    'certificados/Certificado Modelagem de software.pdf',
    'certificados/usjt-modelagem-de-software.pdf',
  ],
  [
    'certificados/Certificado Modelos, métodos e técnicas da engenharia de software.pdf',
    'certificados/usjt-engenharia-de-software.pdf',
  ],
  [
    'certificados/Certificado Programação de soluções computacionais.pdf',
    'certificados/usjt-programacao-de-solucoes.pdf',
  ],
  [
    'certificados/Certificado Sistemas distribuídos e mobile.pdf',
    'certificados/usjt-sistemas-distribuidos.pdf',
  ],
  [
    'certificados/Certificado Sistemas computacionais e segurança.pdf',
    'certificados/usjt-sistemas-e-seguranca.pdf',
  ],
  [
    'certificados/Certificado Ambientes computacionais e conectividade.pdf',
    'certificados/usjt-ambientes-e-conectividade.pdf',
  ],
  [
    'certificados/Certificado Gestão e qualidade de software.pdf',
    'certificados/usjt-qualidade-de-software.pdf',
  ],
  [
    'certificados/Certificado Usabilidade, desenvolvimento web, mobile e jogos.pdf',
    'certificados/usjt-usabilidade-web-mobile.pdf',
  ],
  [
    'certificados/Certificado Inovação, sustentabilidade e competitividade.pdf',
    'certificados/usjt-inovacao.pdf',
  ],
];

async function existe(caminho) {
  try {
    await access(caminho);
    return true;
  } catch {
    return false;
  }
}

async function baixar(origem, destino) {
  const alvo = join(PUBLICO, destino);

  if (!FORCAR && (await existe(alvo))) {
    return { destino, status: 'ja existia' };
  }

  // Cada segmento e codificado separadamente para os espacos e acentos
  // sobreviverem, sem transformar as barras do caminho em %2F.
  const url = `${BASE}/${origem.split('/').map(encodeURIComponent).join('/')}`;
  const resposta = await fetch(url);

  if (!resposta.ok) {
    return { destino, status: `FALHOU (HTTP ${resposta.status})` };
  }

  await mkdir(dirname(alvo), { recursive: true });
  await writeFile(alvo, Buffer.from(await resposta.arrayBuffer()));

  const kb = Math.round((await resposta.headers.get('content-length')) / 1024) || '?';
  return { destino, status: `baixado (${kb} kB)` };
}

const resultados = [];
for (const [origem, destino] of ARQUIVOS) {
  resultados.push(await baixar(origem, destino));
}

for (const { destino, status } of resultados) {
  console.log(`${status.startsWith('FALHOU') ? 'x' : '+'} ${destino.padEnd(48)} ${status}`);
}

const falhas = resultados.filter((r) => r.status.startsWith('FALHOU'));
if (falhas.length > 0) {
  console.error(
    `\n${falhas.length} arquivo(s) nao vieram. Confira os nomes no repositorio antigo.`,
  );
  process.exit(1);
}

console.log(`\n${resultados.length} arquivos prontos em apps/web/public.`);
