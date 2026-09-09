'use client';

import { allSkills, languages, skillGroups, t as translate, type Locale } from '@portfolio/content';
import { Reveal, SectionHeading } from '@portfolio/ui';
import { useLocale, useTranslations } from 'next-intl';

import LogoLoop, { type LogoItem } from '@/components/reactbits/LogoLoop';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ACCENT_BAR: Record<string, string> = {
  signal: 'bg-signal',
  plasma: 'bg-plasma',
  ember: 'bg-ember',
  cyan: 'bg-cyan',
};

const ACCENT_TEXT: Record<string, string> = {
  signal: 'text-signal',
  plasma: 'text-plasma',
  ember: 'text-ember',
  cyan: 'text-cyan',
};

/**
 * Faixa de tecnologias em rolagem contínua.
 *
 * Usa nome em texto, não logotipo. Uma fileira de logos coloridos brigaria com
 * a paleta e ainda dependeria de imagem externa que pode falhar; o nome em
 * monoespaçada combina com o resto e não faz uma requisição sequer.
 *
 * Só as tecnologias de nível 4 ou 5 entram: a faixa é uma afirmação, e afirmar
 * trinta e oito coisas não afirma nenhuma.
 */
function techLogos(): LogoItem[] {
  return allSkills
    .filter((skill) => skill.level >= 4)
    .map((skill) => ({
      node: (
        <span className="font-mono text-sm tracking-[0.06em] whitespace-nowrap text-ink-soft">
          {skill.name}
        </span>
      ),
      title: skill.name,
    }));
}

export function Skills() {
  const t = useTranslations('skills');
  const locale = useLocale() as Locale;
  const firstGroup = skillGroups[0]?.id ?? 'backend';

  return (
    <section id="skills" className="relative border-t border-line/60 bg-abyss/40 section-spacing">
      <div className="container-wide flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-lg border border-line bg-surface/40 py-5">
            <LogoLoop
              logos={techLogos()}
              speed={44}
              gap={44}
              logoHeight={20}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="#090b10"
              ariaLabel={t('marqueeLabel')}
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Tabs defaultValue={firstGroup} className="gap-6">
            {/*
              O ScrollArea existe para a barra de abas em telas estreitas: sem
              ele, seis abas ou estouram a largura ou encolhem até virar texto
              ilegível. Com ele, a barra rola na horizontal e cada aba mantém
              o tamanho de alvo de toque.
            */}
            <ScrollArea className="w-full">
              <TabsList className="w-max border border-line bg-surface/60 p-1">
                {skillGroups.map((group) => (
                  <TabsTrigger
                    key={group.id}
                    value={group.id}
                    className="font-mono text-xs tracking-[0.1em] uppercase data-[state=active]:bg-elevated data-[state=active]:text-ink"
                  >
                    {translate(group.label, locale)}
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  value="idiomas"
                  className="font-mono text-xs tracking-[0.1em] uppercase data-[state=active]:bg-elevated data-[state=active]:text-ink"
                >
                  {t('languagesTitle')}
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            {skillGroups.map((group) => (
              <TabsContent key={group.id} value={group.id} className="mt-0">
                <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-ink-soft">{skill.name}</span>
                        <span
                          className={`font-mono text-[0.62rem] tracking-[0.1em] uppercase ${ACCENT_TEXT[group.accent] ?? 'text-signal'}`}
                        >
                          {t(`levels.${skill.level}`)}
                        </span>
                      </div>

                      {/*
                        A barra é decorativa: o nível já está escrito ao lado em
                        texto, então o leitor de tela não precisa dela.
                      */}
                      <div
                        className="h-[3px] w-full overflow-hidden rounded-full bg-line"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full rounded-full ${ACCENT_BAR[group.accent] ?? 'bg-signal'}`}
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}

            <TabsContent value="idiomas" className="mt-0">
              <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {languages.map((language) => (
                  <li key={language.code} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-ink-soft">{translate(language.name, locale)}</span>
                      <Badge tone="cyan">{t(`languageLevels.${language.level}`)}</Badge>
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
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
