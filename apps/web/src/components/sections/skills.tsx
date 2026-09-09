import { languages, skillGroups, t as translate, type Locale } from '@portfolio/content';
import { Badge, Reveal, RevealGroup, RevealItem, SectionHeading } from '@portfolio/ui';
import { getLocale, getTranslations } from 'next-intl/server';

const ACCENT_BAR: Record<string, string> = {
  signal: 'bg-signal',
  plasma: 'bg-plasma',
  ember: 'bg-ember',
  cyan: 'bg-cyan',
};

export async function Skills() {
  const t = await getTranslations('skills');
  const locale = (await getLocale()) as Locale;

  return (
    <section id="skills" className="relative border-t border-line/60 bg-abyss/40 section-spacing">
      <div className="container-wide flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <RevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.08}>
          {skillGroups.map((group) => (
            <RevealItem key={group.id}>
              <article className="group h-full rounded-lg border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong">
                <header className="mb-5 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {translate(group.label, locale)}
                  </h3>
                  <Badge tone={group.accent}>{group.skills.length}</Badge>
                </header>

                <ul className="flex flex-col gap-3.5">
                  {group.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm text-ink-soft">{skill.name}</span>
                        <span className="font-mono text-[0.62rem] tracking-[0.1em] text-faint uppercase">
                          {t(`levels.${skill.level}`)}
                        </span>
                      </div>

                      {/*
                        A barra e decorativa: o nivel ja esta escrito ao lado em
                        texto, entao o leitor de tela nao precisa dela.
                      */}
                      <div
                        className="h-[3px] w-full overflow-hidden rounded-full bg-line"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full rounded-full ${ACCENT_BAR[group.accent] ?? 'bg-signal'} transition-[width] duration-700 ease-out`}
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}

          <RevealItem>
            <article className="h-full rounded-lg border border-line bg-surface/60 p-6">
              <h3 className="mb-5 font-display text-lg font-semibold text-ink">
                {t('languagesTitle')}
              </h3>

              <ul className="flex flex-col gap-3.5">
                {languages.map((language) => (
                  <li key={language.code} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-ink-soft">
                        {translate(language.name, locale)}
                      </span>
                      <span className="font-mono text-[0.62rem] tracking-[0.1em] text-faint uppercase">
                        {t(`languageLevels.${language.level}`)}
                      </span>
                    </div>
                    <div
                      className="h-[3px] w-full overflow-hidden rounded-full bg-line"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-signal to-cyan"
                        style={{ width: `${language.proficiency}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
