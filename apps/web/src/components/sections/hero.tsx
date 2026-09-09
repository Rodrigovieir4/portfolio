'use client';

import { profile, t as translate, type Locale } from '@portfolio/content';
import { Magnetic, ScrambleText, SplitText, StatusDot } from '@portfolio/ui';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import ShinyText from '@/components/reactbits/ShinyText';
import StarBorder from '@/components/reactbits/StarBorder';

/**
 * A cena WebGL entra por import dinamico com ssr desligado.
 *
 * three.js toca em window e em document ao criar o contexto, entao renderizar
 * no servidor quebraria a build. Como bonus, os cerca de 600 kB de three saem
 * do bundle inicial e so chegam depois que o HTML ja pintou.
 */
const HeroCanvas = dynamic(() => import('@portfolio/gl').then((module) => module.HeroCanvas), {
  ssr: false,
});

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLElement>(null);

  // Progresso da propria secao, de quando o topo encosta no topo da janela ate
  // ela sair por baixo.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);

  // A nuvem de particulas recebe um numero simples, nao um MotionValue, para o
  // pacote WebGL nao depender da biblioteca de animacao. O estado so e
  // atualizado quando a mudanca e perceptivel, entao rolar a pagina nao dispara
  // uma re-renderizacao por pixel.
  const [morph, setMorph] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setMorph((current) => (Math.abs(latest - current) > 0.006 ? latest : current));
  });

  const [first, ...rest] = profile.name.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.06]" aria-hidden="true" />

      <HeroCanvas progress={morph} from="sphere" to="knot" className="absolute inset-0" />

      {/* Vinheta que escurece as bordas e devolve contraste ao texto. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_26%,var(--color-void)_88%)]"
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 container-wide pt-24"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="flex max-w-4xl flex-col gap-7">
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-signal uppercase">
              <StatusDot active={profile.availability.open} />
              {translate(profile.availability.label, locale)}
            </span>
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t('basedIn')}
            </span>
          </motion.div>

          <h1
            id="hero-title"
            className="font-display text-[length:var(--text-fluid-3xl)] leading-[0.92] font-bold tracking-[-0.03em]"
          >
            <SplitText text={first ?? ''} as="span" />
            <span className="block text-gradient">
              <SplitText text={rest.join(' ')} as="span" delay={0.18} />
            </span>
          </h1>

          <motion.p
            className="font-mono text-[length:var(--text-fluid-lg)] text-signal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <ScrambleText text={translate(profile.headline, locale)} startDelay={700} />
          </motion.p>

          <motion.p
            className="max-w-xl text-[length:var(--text-fluid-base)] leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/*
              O brilho passa devagar e uma vez a cada ciclo longo. É a frase que
              resume a pessoa: chamar atenção para ela vale, piscar sem parar
              não.
            */}
            <ShinyText
              text={translate(profile.tagline, locale)}
              speed={7}
              color="var(--color-ink-soft)"
              shineColor="var(--color-signal)"
              spread={26}
            />
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 pt-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Magnetic>
              <StarBorder
                as="a"
                href="#projects"
                color="#c8f751"
                speed="5s"
                thickness={1}
                backgroundColor="var(--color-signal)"
                textColor="var(--color-void)"
                borderColor="transparent"
                className="group font-mono text-xs tracking-[0.12em] uppercase"
              >
                <span className="inline-flex items-center gap-2">
                  {t('ctaProjects')}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </StarBorder>
            </Magnetic>

            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-xs tracking-[0.12em] text-ink uppercase transition-colors hover:border-signal hover:text-signal"
              >
                {t('ctaContact')}
              </a>
            </Magnetic>

            <a
              href={translate(profile.resumeUrl, locale)}
              download
              className="inline-flex items-center gap-2 px-3 py-3 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-ink"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('resume')}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: textOpacity }}
      >
        <span className="font-mono text-[0.65rem] tracking-[0.22em] text-faint uppercase">
          {t('scrollHint')}
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4 text-signal" aria-hidden="true" />
        </motion.span>
      </motion.div>
    </section>
  );
}
