import { languageSchema, parseCollection, type Language } from '../schema';

const raw = [
  {
    code: 'pt',
    name: { pt: 'Portugues', en: 'Portuguese', es: 'Portugues' },
    level: 'nativo',
    proficiency: 100,
  },
  {
    code: 'en',
    name: { pt: 'Ingles', en: 'English', es: 'Ingles' },
    level: 'avancado',
    proficiency: 75,
  },
  {
    code: 'es',
    name: { pt: 'Espanhol', en: 'Spanish', es: 'Espanol' },
    level: 'basico',
    proficiency: 35,
  },
];

export const languages: Language[] = parseCollection(languageSchema, raw, 'src/data/languages.ts');
