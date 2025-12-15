import type { Metadata } from 'next';
import { getAlternateLinks, getCanonicalUrl, stripLocale } from '@/lib/i18n/paths';
import { locales, type Locale } from '@/lib/i18n/locales';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com';
const siteName = 'MandryCabrio';
const defaultDescription = 'Premium car rental in Tenerife. Cabrio, SUV, and luxury vehicles available for rent. Book your perfect ride today.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Car Rental in Tenerife | MandryCabrio',
    template: '%s | MandryCabrio',
  },
  description: defaultDescription,
  keywords: ['car rental', 'tenerife', 'cabrio', 'suv', 'luxury car rental', 'tenerife car hire'],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: 'Car Rental in Tenerife | MandryCabrio',
    description: defaultDescription,
    images: [
      {
        url: '/hero/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'MandryCabrio - Premium Car Rental in Tenerife',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Rental in Tenerife | MandryCabrio',
    description: defaultDescription,
    images: ['/hero/hero.jpg'],
  },
  icons: {
    icon: [
      { url: '/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo/logo.png',
    shortcut: '/logo/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generatePageMetadata({
  title,
  description,
  path = '',
  noIndex = false,
  locale = 'en',
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  locale?: Locale;
}): Metadata {
  // Normalize path (ensure it has locale prefix)
  const normalizedPath = path.startsWith(`/${locale}`) ? path : `/${locale}${path}`;
  const canonicalUrl = getCanonicalUrl(normalizedPath, locale);
  
  // Generate alternate language URLs using helper
  const alternateLinks = getAlternateLinks(normalizedPath);
  
  // Determine OpenGraph locale
  const ogLocaleMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
    de: 'de_DE',
    ru: 'ru_RU',
    uk: 'uk_UA',
  };
  const ogLocale = ogLocaleMap[locale];
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLinks,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      locale: ogLocale,
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  };
}

