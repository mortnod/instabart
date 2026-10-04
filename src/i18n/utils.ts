import { defaultLang, isLanguage, languages, type Language } from './config';

type Translations = (typeof languages)[typeof defaultLang]['translations'];
type TextKey = {
  [Key in keyof Translations]: Translations[Key] extends string ? Key : never;
}[keyof Translations];

export function getLangFromUrl(url: URL): Language {
  const [, language] = url.pathname.split('/');
  return isLanguage(language) ? language : defaultLang;
}

export function useTranslations(language: Language) {
  return (key: TextKey, params?: Record<string, string>): string => {
    const translation = languages[language].translations[key];
    return params
      ? translation.replace(/\{(\w+)\}/g, (placeholder, name: string) => params[name] ?? placeholder)
      : translation;
  };
}

export function getTaglines(language: Language): string[] {
  return languages[language].translations.taglines;
}

export function getLocalizedUrl(url: string, targetLang: Language, currentLang: Language) {
  const prefix = `/${currentLang}`;
  const hasPrefix = currentLang !== defaultLang &&
    (url === prefix || url.startsWith(`${prefix}/`));
  const path = hasPrefix ? url.slice(prefix.length) || '/' : url;
  return targetLang === defaultLang ? path : `/${targetLang}${path === '/' ? '' : path}`;
}
