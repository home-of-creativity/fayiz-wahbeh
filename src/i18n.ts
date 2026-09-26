import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import type { Language } from '@/types';

export const LANGUAGES: Language[] = ['en', 'ar'];
export const STORAGE_KEY = 'fw-lang';

export function applyDocumentLanguage(lang: string): void {
  const code: Language = lang.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    fallbackLng: 'en',
    supportedLngs: LANGUAGES,
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    initAsync: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

applyDocumentLanguage(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', applyDocumentLanguage);

export function currentLanguage(): Language {
  return (i18n.resolvedLanguage ?? 'en').startsWith('ar') ? 'ar' : 'en';
}

/** Reads a string array from the locale files with a runtime guard. */
export function tList(key: string): string[] {
  const value: unknown = i18n.t(key, { returnObjects: true });
  return Array.isArray(value) ? value.map(String) : [];
}

export interface TitleText {
  title: string;
  text: string;
}

/** Reads an array of `{ title, text }` objects from the locale files. */
export function tItems(key: string): TitleText[] {
  const value: unknown = i18n.t(key, { returnObjects: true });
  if (!Array.isArray(value)) return [];
  return value.map((item: unknown) => {
    const record = (item ?? {}) as Partial<TitleText>;
    return { title: String(record.title ?? ''), text: String(record.text ?? '') };
  });
}

export default i18n;
