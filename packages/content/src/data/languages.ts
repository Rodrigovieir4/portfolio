import { languageSchema, parseCollection, type Language } from '../schema';

const raw = [
  {
    code: 'pt',
    name: { pt: 'Português', en: 'Portuguese', es: 'Portugués' },
    level: 'nativo',
    proficiency: 100,
  },
  {
    code: 'en',
    name: { pt: 'Inglês', en: 'English', es: 'Inglés' },
    level: 'avancado',
    proficiency: 75,
  },
  {
    code: 'es',
    name: { pt: 'Espanhol', en: 'Spanish', es: 'Español' },
    level: 'basico',
    proficiency: 35,
  },
];

export const languages: Language[] = parseCollection(languageSchema, raw, 'src/data/languages.ts');
