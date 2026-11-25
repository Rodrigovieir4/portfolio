import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

export default function NotFound() {
  const t = useTranslations("notFound")

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden brilho-vinho px-4 text-center">
      <p className="font-numeros text-8xl leading-none text-vinho-claro md:text-9xl">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-lg text-pretty text-muted-foreground">
        {t("description")}
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform active:scale-95"
      >
        {t("back")}
      </Link>
    </div>
  )
}
