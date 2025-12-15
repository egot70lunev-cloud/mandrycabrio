/**
 * i18n helper - Multi-language support
 * Supports: en, es, de, ru, uk
 */

import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import deTranslations from '@/locales/de.json';
import ruTranslations from '@/locales/ru.json';
import ukTranslations from '@/locales/uk.json';
import { defaultLocale, type Locale } from './i18n/locales';

// Re-export locale utilities
export { locales, defaultLocale, localeNames, localeFlags, type Locale } from './i18n/locales';
export * from './i18n/paths';

type Translations = typeof enTranslations;

const translations: Record<string, Translations> = {
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
  ru: ruTranslations,
  uk: ukTranslations,
};

export function t(key: string, locale: string = defaultLocale): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations[defaultLocale];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function getLocale(): string {
  // For now, always return 'en'
  // In the future, this can detect from URL, headers, or user preference
  return defaultLocale;
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname.startsWith('/es')) {
    return 'es';
  }
  if (pathname.startsWith('/de')) {
    return 'de';
  }
  if (pathname.startsWith('/ru')) {
    return 'ru';
  }
  if (pathname.startsWith('/uk')) {
    return 'uk';
  }
  // Default to English for /en or root
  return 'en';
}

