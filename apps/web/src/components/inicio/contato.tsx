import { type Locale, profile, t as traduzir } from "@portfolio/content"
import { Button } from "@portfolio/ui/components/button"
import { getLocale, getTranslations } from "next-intl/server"

const LINKEDIN = profile.socials.find((s) => s.platform === "linkedin")

export async function Contato() {
  const t = await getTranslations("inicio.contato")
  const locale = (await getLocale()) as Locale

  return (
    <section id="contato" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div
        data-mov="contato"
        className="flex flex-col gap-8 rounded-3xl bloco-vinho px-6 py-16 md:px-12 md:py-24"
      >
        <h2 className="text-6xl font-semibold tracking-tight md:text-8xl">
          {t("titulo")}
        </h2>
        <p className="max-w-2xl text-xl text-pretty">{t("texto")}</p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="cta-lg">
            <a
              href={LINKEDIN?.url ?? `mailto:${profile.email}`}
              target="_blank"
              rel="noreferrer"
            >
              {t("falar")}
            </a>
          </Button>
          <Button asChild variant="contorno" size="cta-lg">
            <a href={traduzir(profile.resumeUrl, locale)} download>
              {t("curriculo")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
