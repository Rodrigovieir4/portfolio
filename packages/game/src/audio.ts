/**
 * Efeitos sonoros sintetizados na hora, com Web Audio.
 *
 * Nenhum arquivo de áudio é baixado. Cada som é montado de osciladores e ruído
 * no instante em que toca, o que pesa zero bytes no carregamento e deixa o
 * timbre inteiro sob controle do código.
 *
 * O contexto de áudio só nasce na primeira vez que o som toca com o som
 * ligado. O navegador exige um gesto do usuário para liberar áudio, e ligar o
 * som é esse gesto.
 */

export type Sfx = 'step' | 'kick' | 'pickup' | 'open' | 'close' | 'goal' | 'achievement' | 'toggle';

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
}

/** Envelope curto: sobe rápido e decai exponencialmente até o silêncio. */
function envelope(ctx: AudioContext, peak: number, duration: number, start = ctx.currentTime) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  gain.connect(ctx.destination);
  return gain;
}

function tone(
  ctx: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  duration: number,
  peak: number,
  delay = 0,
) {
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  osc.connect(envelope(ctx, peak, duration, start));
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function burst(
  ctx: AudioContext,
  filter: BiquadFilterType,
  frequency: number,
  duration: number,
  peak: number,
  delay = 0,
) {
  const start = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.playbackRate.value = 0.8 + Math.random() * 0.4;
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter;
  biquad.frequency.value = frequency;
  source.connect(biquad);
  biquad.connect(envelope(ctx, peak, duration, start));
  source.start(start, Math.random() * 0.5);
  source.stop(start + duration + 0.02);
}

const SOUNDS: Record<Sfx, (ctx: AudioContext) => void> = {
  // Passo: ruído grave e curtíssimo, com variação para não soar metralhadora.
  step: (ctx) => burst(ctx, 'lowpass', 500 + Math.random() * 300, 0.07, 0.05),
  // Chute: um bumbo, frequência que despenca, mais o estalo do couro.
  kick: (ctx) => {
    tone(ctx, 'sine', 150, 45, 0.16, 0.45);
    burst(ctx, 'highpass', 2500, 0.03, 0.08);
  },
  // Coleta: duas notas subindo, o "plim" universal de item pego.
  pickup: (ctx) => {
    tone(ctx, 'square', 880, 1320, 0.07, 0.05);
    tone(ctx, 'square', 1320, 1760, 0.09, 0.05, 0.07);
  },
  open: (ctx) => tone(ctx, 'triangle', 480, 760, 0.08, 0.07),
  close: (ctx) => tone(ctx, 'triangle', 760, 480, 0.08, 0.06),
  // Gol: arpejo maior e um sopro de torcida por baixo.
  goal: (ctx) => {
    [523, 659, 784, 1047].forEach((frequency, index) =>
      tone(ctx, 'triangle', frequency, frequency, 0.16, 0.09, index * 0.09),
    );
    burst(ctx, 'bandpass', 1200, 1.1, 0.07, 0.05);
  },
  achievement: (ctx) => {
    tone(ctx, 'sine', 660, 660, 0.3, 0.08);
    tone(ctx, 'sine', 990, 990, 0.36, 0.07, 0.09);
  },
  toggle: (ctx) => tone(ctx, 'square', 2200, 1800, 0.03, 0.04),
};

export function playSfx(name: Sfx): void {
  const ctx = audio();
  if (!ctx) return;
  try {
    SOUNDS[name](ctx);
  } catch {
    // Áudio é enfeite. Um navegador que recuse um nó não pode derrubar o jogo.
  }
}
