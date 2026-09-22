'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

/**
 * Brilho e vinheta, num arquivo só para poder chegar depois.
 *
 * A biblioteca de pós-processamento é das mais pesadas da cena e só serve ao
 * nível alto. Isolada aqui, ela entra por import dinâmico: quem está no
 * automático num aparelho fraco, ou escolheu o nível baixo, nunca baixa esse
 * pedaço.
 *
 * Brilho só no que já é luz: LED, telas, commits e losangos passam do limiar;
 * paredes e móveis não. É o que dá o ar de quarto à noite sem lavar a cena.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.85} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur />
      <Vignette eskil={false} offset={0.22} darkness={0.62} />
    </EffectComposer>
  );
}
