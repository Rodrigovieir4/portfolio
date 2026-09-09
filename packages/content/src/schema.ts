import { z } from 'zod';

import { LOCALES } from './locale';

/**
 * Schemas de conteúdo.
 *
 * Cada arquivo em src/data é validado contra estes schemas no momento em que o
 * módulo carrega. Se você digitar uma data inválida ou esquecer a tradução em
 * espanhol, o build do Next quebra com a mensagem exata do campo, em vez de o
 * portfólio subir com um buraco.
 */

/** Constrói o validador de um campo de texto em todos os idiomas. */
const localized = <T extends z.ZodTypeAny>(inner: T) =>
  z.object(
    Object.fromEntries(LOCALES.map((locale) => [locale, inner])) as Record<
      (typeof LOCALES)[number],
      T
    >,
  );

export const localizedString = localized(z.string().min(1, 'texto não pode ser vazio'));
export const localizedList = localized(z.array(z.string().min(1)).min(1));

/** Data no formato AAAA-MM. Precisão de mês basta para currículo. */
export const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use o formato AAAA-MM, por exemplo 2024-03');

export const socialSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'email', 'whatsapp', 'x', 'instagram', 'youtube']),
  label: z.string().min(1),
  url: z.string().url(),
  handle: z.string().optional(),
  primary: z.boolean().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  headline: localizedString,
  tagline: localizedString,
  bio: localized(z.array(z.string().min(1)).min(1)),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
    timezone: z.string(),
  }),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().min(1),
  resumeUrl: localized(z.string().min(1)),
  availability: z.object({
    open: z.boolean(),
    label: localizedString,
  }),
  socials: z.array(socialSchema).min(1),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  /** 1 estudando, 2 basico, 3 produtivo, 4 solido, 5 referencia. */
  level: z.number().int().min(1).max(5),
  icon: z.string().optional(),
  since: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
});

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  label: localizedString,
  accent: z.enum(['signal', 'plasma', 'ember', 'cyan']),
  skills: z.array(skillSchema).min(1),
});

/**
 * Um número que prova alguma coisa.
 *
 * Existe porque "trabalhei numa API grande" não diz nada e "286 endpoints REST,
 * 285 documentados em Swagger" diz tudo. O campo `value` é string, não número,
 * para caber "2,7 MB" e "99%" sem gambiarra de formatação.
 */
export const metricSchema = z.object({
  value: z.string().min(1),
  label: localizedString,
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug deve ser kebab-case, sem acento'),
  name: z.string().min(1),
  summary: localizedString,
  description: localized(z.array(z.string().min(1)).min(1)),
  role: localizedString,
  year: z.string().regex(/^\d{4}$/),
  /** Período de atuação. `end: null` significa que segue em andamento. */
  start: yearMonth.optional(),
  end: yearMonth.nullish(),
  /** Quem contratou. Ausente quando é projeto próprio ou acadêmico. */
  client: z.string().optional(),
  /** Como o trabalho chegou: via a DBC, como freelance, ou por conta própria. */
  engagement: z.enum(['dbc', 'freelance', 'proprio', 'academico']).default('proprio'),
  status: z.enum(['live', 'wip', 'archived', 'private']),
  /**
   * Se o código pode ser lido por quem visita. Produto de cliente é fechado, e
   * dizer isso explicitamente é melhor do que um card sem link que parece
   * quebrado.
   */
  codeVisibility: z.enum(['public', 'private']).default('public'),
  featured: z.boolean().default(false),
  stack: z.array(z.string().min(1)).min(1),
  highlights: localizedList,
  metrics: z.array(metricSchema).default([]),
  links: z.object({
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    article: z.string().url().optional(),
  }),
  cover: z.string().optional(),
  /** Cor de acento usada no brilho do card. */
  accent: z.enum(['signal', 'plasma', 'ember', 'cyan']).default('signal'),
});

export const experienceSchema = z
  .object({
    id: z.string().min(1),
    role: localizedString,
    organization: z.string().min(1),
    organizationUrl: z.string().url().optional(),
    kind: z.enum(['work', 'education', 'athletics', 'certification', 'project']),
    employment: z
      .enum(['clt', 'pj', 'freelance', 'estagio', 'trainee', 'voluntario', 'proprio'])
      .optional(),
    mode: z.enum(['remoto', 'hibrido', 'presencial']).optional(),
    start: yearMonth,
    /** null significa "até hoje". */
    end: yearMonth.nullable(),
    location: z.string().optional(),
    summary: localizedString,
    highlights: localizedList,
    stack: z.array(z.string()).default([]),
  })
  .refine((value) => value.end === null || value.end >= value.start, {
    message: 'a data final não pode ser anterior à inicial',
    path: ['end'],
  });

export const certificationSchema = z.object({
  id: z.string().min(1),
  name: localizedString,
  issuer: z.string().min(1),
  issued: yearMonth.optional(),
  credentialUrl: z.string().url().optional(),
  file: z.string().optional(),
  category: z.enum(['academico', 'idioma', 'curso', 'cloud', 'outro']),
});

export const languageSchema = z.object({
  code: z.string().min(2),
  name: localizedString,
  level: z.enum(['nativo', 'fluente', 'avancado', 'intermediario', 'basico']),
  /** Percentual usado apenas na barra visual. */
  proficiency: z.number().int().min(0).max(100),
});

export type Social = z.infer<typeof socialSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;

/**
 * Valida uma coleção e enriquece o erro com o nome do arquivo de origem,
 * para a mensagem de build apontar direto para onde corrigir.
 */
export function parseCollection<T extends z.ZodTypeAny>(
  schema: T,
  items: unknown[],
  source: string,
): z.infer<T>[] {
  return items.map((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `  - ${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
        .join('\n');
      throw new Error(`Conteúdo inválido em ${source}, item ${index}:\n${issues}`);
    }
    return result.data;
  });
}
