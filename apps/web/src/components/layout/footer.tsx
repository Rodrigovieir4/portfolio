import { profile } from '@portfolio/content';
import { Marquee } from '@portfolio/ui';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { siteConfig } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-abyss">
      <div className="border-b border-line/60 py-6">
        <Marquee speed={42}>
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className="font-display text-2xl font-semibold tracking-tight text-faint sm:text-3xl"
            >
              {profile.name}
              <span className="mx-6 text-signal">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-wide flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-display text-lg font-medium text-ink">{profile.name}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted">{t('builtWith')}</p>
          <p className="font-mono text-xs text-faint">
            © {year} · {t('rights')}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="links">
          {profile.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-mono text-xs tracking-[0.12em] text-muted uppercase transition-colors hover:text-signal"
            >
              {social.label}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          ))}

          <a
            href={siteConfig.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 font-mono text-xs tracking-[0.12em] text-muted uppercase transition-colors hover:text-signal"
          >
            {t('sourceCode')}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </nav>
      </div>
    </footer>
  );
}
