/**
 * Locale configuration
 */

export type Locale = 'en' | 'es' | 'de' | 'ru' | 'uk';

export const locales: Locale[] = ['en', 'es', 'de', 'ru', 'uk'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  ru: 'Русский',
  uk: 'Українська',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  ru: '🇷🇺',
  uk: '🇺🇦',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}


