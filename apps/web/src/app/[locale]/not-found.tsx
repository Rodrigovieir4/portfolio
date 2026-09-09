import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[length:var(--text-fluid-mega)] leading-none font-bold text-signal/12">
        404
      </p>
      <h1 className="-mt-8 font-display text-[length:var(--text-fluid-xl)] font-bold tracking-tight text-ink">
        {t('title')}
      </h1>
      <p className="max-w-md leading-relaxed text-muted-foreground">{t('description')}</p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center rounded-full bg-signal px-6 py-3 font-mono text-xs tracking-[0.12em] text-void uppercase transition-colors hover:bg-signal-glow"
      >
        {t('back')}
      </Link>
    </div>
  );
}
