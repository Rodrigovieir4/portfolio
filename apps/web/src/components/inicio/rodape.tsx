import { LOCALES, profile } from "@portfolio/content"

import { Link } from "@/i18n/navigation"

export function Rodape() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
      <span className="font-medium">{profile.name}</span>
      <ul className="flex flex-wrap gap-6 font-mono text-sm">
        {profile.socials.map((social) => (
          <li key={social.platform}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex gap-3 font-mono text-xs uppercase">
        {LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              href="/"
              locale={locale}
              className="text-muted-foreground hover:text-foreground"
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  )
}
