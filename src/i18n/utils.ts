// Import all translation files
import en from './en.json';
import nb from './nb.json';
import nn from './nn.json';

// Dynamically import any additional translation files
// To add a new language, just add a JSON file and import it here
const allTranslations = {
  en,
  nb,
  nn,
  // Add new languages here by importing their JSON files
  // fr: () => import('./fr.json').then(m => m.default),
} as const;

// Language display names - add new languages here too
export const languages = {
  en: 'English',
  nb: 'Bokmål',
  nn: 'Nynorsk',
  // Add new language display names here
} as const;

export const defaultLang = 'nb';

// Build the ui object from imported translations
export const ui = allTranslations;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(
    key: keyof (typeof ui)[typeof defaultLang],
    params?: Record<string, string>,
  ): string {
    const translation = (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key];
    // Handle arrays by returning the first item as default, or join them
    if (Array.isArray(translation)) {
      return translation[0] || '';
    }

    let result = (translation as string) || '';

    // Handle string interpolation if params are provided
    if (params && typeof result === 'string') {
      Object.entries(params).forEach(([placeholder, value]) => {
        result = result.replace(new RegExp(`{${placeholder}}`, 'g'), value);
      });
    }

    return result;
  };
}

export function getTaglines(lang: keyof typeof ui): string[] {
  const taglines = ui[lang]['taglines'] || ui[defaultLang]['taglines'];
  return Array.isArray(taglines) ? taglines : [];
}

export function getLocalizedUrl(
  url: string,
  targetLang: keyof typeof ui,
  currentLang: keyof typeof ui,
) {
  // Remove current language prefix if it exists
  let cleanUrl = url;
  if (currentLang !== defaultLang) {
    cleanUrl = url.replace(`/${currentLang}`, '') || '/';
  }

  // Add target language prefix if it's not the default
  if (targetLang === defaultLang) {
    return cleanUrl;
  }

  return `/${targetLang}${cleanUrl === '/' ? '' : cleanUrl}`;
}
