'use client';

import { profile } from '@portfolio/content';
import { Magnetic, Reveal, SectionHeading } from '@portfolio/ui';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function Contact() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timeoutId);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      // A area de transferencia e negada em contexto sem HTTPS e em alguns
      // navegadores embutidos. O e-mail continua visivel e selecionavel ao
      // lado, entao nao ha nada a recuperar aqui.
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line/60 section-spacing"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(ellipse_at_bottom,var(--color-plasma)_0%,transparent_66%)] opacity-[0.13]"
        aria-hidden="true"
      />

      <div className="relative container-wide flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            index="06"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 font-mono text-sm tracking-[0.1em] text-void uppercase transition-colors hover:bg-signal-glow"
                >
                  {t('emailCta')}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-4 font-mono text-sm text-muted-foreground transition-colors hover:border-signal hover:text-signal"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-signal" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{profile.email}</span>
                <span className="sm:hidden">{copied ? t('copied') : t('copyEmail')}</span>
                {/* Anuncia a copia a quem usa leitor de tela, sem roubar o foco. */}
                <span className="sr-only" role="status" aria-live="polite">
                  {copied ? t('copied') : ''}
                </span>
              </button>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {profile.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col gap-1.5 bg-abyss p-5 transition-colors hover:bg-surface"
                  >
                    <span className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                      {social.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="truncate text-sm text-ink-soft">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
