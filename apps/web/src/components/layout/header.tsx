'use client';

import { LOCALES, LOCALE_META, profile, type Locale } from '@portfolio/content';
import { cn, Magnetic, StatusDot } from '@portfolio/ui';
import { Check, Globe, Menu } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useTransition } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { SECTIONS } from '@/lib/site';

/**
 * Cabeçalho fixo.
 *
 * Some ao descer e reaparece ao subir, padrão que devolve a navegação no
 * instante em que o visitante demonstra querer sair da leitura, sem ocupar
 * altura enquanto ele lê.
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
    // A margem de 140px evita que o cabeçalho pisque com o solavanco do
    // scroll suave perto do topo.
    setHidden(current > previous && current > 140 && !menuOpen);
  });

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
                className="rounded-full px-3.5 py-2 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:bg-elevated hover:text-ink"
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

            <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
          </div>
        </div>
      </motion.header>
    </>
  );
}

/**
 * Menu mobile sobre o Sheet do shadcn/ui.
 *
 * Trocar o painel escrito à mão por este resolveu de graça o que dava trabalho
 * manter: travar o foco dentro do painel, fechar no Escape, devolver o foco ao
 * botão que abriu e impedir a rolagem do fundo. É Radix por baixo.
 */
function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const t = useTranslations('nav');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t('menu')}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-line-strong lg:hidden"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full border-line bg-void/97 backdrop-blur-2xl sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {t('menu')}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-4 pb-8">
          {SECTIONS.map((section, index) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={() => onOpenChange(false)}
              className="border-b border-line/60 py-4 font-display text-2xl font-medium tracking-tight text-ink transition-colors hover:text-signal"
            >
              <span className="mr-3 font-mono text-xs text-signal">
                {String(index + 1).padStart(2, '0')}
              </span>
              {t(section)}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Troca de idioma preservando a página atual.
 *
 * O `usePathname` do next-intl devolve o caminho interno, sem prefixo de
 * idioma, então o mesmo valor serve para os três. O `params` é repassado para
 * que rotas dinâmicas como /projetos/[slug] não percam o slug na troca.
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('changeLanguage')}
          disabled={pending}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-line bg-abyss/70 px-3 py-2 font-mono text-[0.68rem] tracking-[0.1em] text-ink uppercase transition-colors hover:border-line-strong',
            pending && 'opacity-60',
          )}
        >
          <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {locale}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44 border-line bg-popover">
        <DropdownMenuLabel className="font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
          {t('changeLanguage')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-line" />

        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item}
            onSelect={() => change(item)}
            className="cursor-pointer gap-2 focus:bg-elevated focus:text-ink"
          >
            <span aria-hidden="true">{LOCALE_META[item].flag}</span>
            <span className="flex-1">{LOCALE_META[item].label}</span>
            {item === locale && <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
