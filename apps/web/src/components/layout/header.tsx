'use client';

import { LOCALES, LOCALE_META, profile, type Locale } from '@portfolio/content';
import { cn, Magnetic, StatusDot } from '@portfolio/ui';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { SECTIONS } from '@/lib/site';

/**
 * Cabecalho fixo.
 *
 * Some ao descer e reaparece ao subir, padrao que devolve a navegacao no
 * instante em que o visitante demonstra querer sair da leitura, sem ocupar
 * altura enquanto ele le.
 */
export function Header() {
  const t = useTranslations('nav');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    // A margem de 140px evita que o cabecalho pisque com o solavanco do
    // scroll suave perto do topo.
    setHidden(current > previous && current > 140 && !menuOpen);
  });

  // Com o menu aberto, travar o fundo impede a rolagem por tras do painel.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
      >
        {t('skipToContent')}
      </a>

      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled && 'border-b border-line/70 bg-void/72 backdrop-blur-xl',
        )}
        animate={{ y: hidden ? '-105%' : '0%' }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-display text-base font-semibold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md border border-signal/40 bg-signal/10 font-mono text-sm text-signal transition-colors group-hover:bg-signal group-hover:text-void">
              R
            </span>
            <span className="hidden sm:inline">{profile.shortName}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t('menu')}>
            {SECTIONS.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="rounded-full px-3.5 py-2 font-mono text-xs tracking-[0.12em] text-muted uppercase transition-colors hover:bg-elevated hover:text-ink"
              >
                {t(section)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />

            <Magnetic className="hidden sm:block">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-4 py-2 font-mono text-xs tracking-[0.12em] text-signal uppercase transition-colors hover:bg-signal hover:text-void"
              >
                <StatusDot active={profile.availability.open} />
                {t('contact')}
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('close') : t('menu')}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-line-strong lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  className="absolute left-0 block h-px w-full bg-current"
                  animate={menuOpen ? { top: '50%', rotate: 45 } : { top: 0, rotate: 0 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 block h-px w-full bg-current"
                  animate={menuOpen ? { bottom: '50%', rotate: -45 } : { bottom: 0, rotate: 0 }}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('nav');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-void/96 backdrop-blur-2xl lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <nav className="container-content flex h-full flex-col justify-center gap-2 pb-16">
            {SECTIONS.map((section, index) => (
              <motion.a
                key={section}
                href={`#${section}`}
                onClick={onClose}
                className="border-b border-line/60 py-4 font-display text-3xl font-medium tracking-tight text-ink"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="mr-3 font-mono text-xs text-signal">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {t(section)}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Troca de idioma preservando a pagina atual.
 *
 * O `usePathname` do next-intl devolve o caminho interno, sem prefixo de
 * idioma, entao o mesmo valor serve para os tres. O `params` e repassado para
 * que rotas dinamicas como /projetos/[slug] nao percam o slug na troca.
 */
function LocaleSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { pathname, params: params as any },
        { locale: next },
      );
    });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-line bg-abyss/70 p-0.5"
      role="group"
      aria-label={t('changeLanguage')}
    >
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => change(item)}
          disabled={pending}
          aria-current={item === locale}
          title={LOCALE_META[item].label}
          className={cn(
            'rounded-full px-2.5 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] uppercase transition-colors',
            item === locale ? 'bg-signal text-void' : 'text-muted hover:bg-elevated hover:text-ink',
            pending && 'opacity-60',
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
