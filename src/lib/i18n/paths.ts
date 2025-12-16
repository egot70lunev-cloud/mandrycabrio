/**
 * Path helpers for multilingual routing
 */

import { locales, defaultLocale, type Locale } from './locales';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com';

/**
 * Strip locale prefix from pathname
 * /en/cars -> /cars
 * /es -> /
 */
export function stripLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  const pathWithoutLocale = pathname.replace(localePattern, '') || '/';
  return pathWithoutLocale;
}

/**
 * Get localized path for a given locale
 * getLocalizedPath('/cars', 'es') -> '/es/cars'
 * getLocalizedPath('/en/cars', 'de') -> '/de/cars'
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = stripLocale(path);
  return `/${locale}${cleanPath}`;
}

/**
 * Generate alternate language links for hreflang
 * Returns object with locale -> URL mapping
 */
export function getAlternateLinks(path: string): Record<Locale, string> {
  const cleanPath = stripLocale(path);
  const alternates: Partial<Record<Locale, string>> = {};
  
  for (const locale of locales) {
    alternates[locale] = `${siteUrl}/${locale}${cleanPath}`;
  }
  
  return alternates as Record<Locale, string>;
}

/**
 * Get canonical URL for current path
 */
export function getCanonicalUrl(path: string, locale: Locale): string {
  const cleanPath = stripLocale(path);
  return `${siteUrl}/${locale}${cleanPath}`;
}

/**
 * Check if a path exists in a locale (for fallback logic)
 * Returns the localized path if it exists, or locale home if not
 */
export function getLocalizedPathOrHome(path: string, locale: Locale): string {
  // For now, assume all paths exist in all locales
  // In the future, this could check against a route manifest
  return getLocalizedPath(path, locale);
}


