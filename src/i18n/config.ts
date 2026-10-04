import nb from './nb.json';
import nn from './nn.json';
import en from './en.json';
import { validateTranslations } from './validate.mjs';

// In language-selector order. Bokmål defines the translation keys and types.
export const languages = {
  nb: { name: 'Bokmål', htmlLang: 'nb-NO', translations: nb },
  nn: { name: 'Nynorsk', htmlLang: 'nn-NO', translations: nn },
  en: { name: 'English', htmlLang: 'en', translations: en },
} satisfies Record<
  string,
  {
    name: string;
    htmlLang: string;
    translations: typeof nb;
  }
>;

export type Language = keyof typeof languages;
export const defaultLang = 'nb' satisfies Language;
export const languageCodes = Object.keys(languages) as Language[];

export function isLanguage(value: string): value is Language {
  return Object.hasOwn(languages, value);
}

// Fail the build if any dictionary's keys, value types, or placeholders differ from the default language.
for (const language of languageCodes) {
  validateTranslations(
    language,
    languages[language].translations,
    languages[defaultLang].translations,
  );
}
