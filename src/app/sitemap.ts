import { MetadataRoute } from 'next';
import { cars } from '@/data/cars';
import { locales } from '@/lib/i18n/locales';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com';

// Define all static routes (without locale prefix)
const staticRoutes = [
  '', // home
  '/cars',
  '/search',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate car pages for all locales
  const carPages = locales.flatMap(locale =>
    cars.map((car) => {
      const alternates: Record<string, string> = {};
      locales.forEach(loc => {
        alternates[loc] = `${siteUrl}/${loc}/cars/${car.slug}`;
      });
      
      return {
        url: `${siteUrl}/${locale}/cars/${car.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      };
    })
  );

  // Generate static pages for all locales
  const staticPages = staticRoutes.flatMap(route => {
    return locales.map(locale => {
      const alternates: Record<string, string> = {};
      locales.forEach(loc => {
        alternates[loc] = `${siteUrl}/${loc}${route}`;
      });
      
      // Determine priority and changeFrequency based on route
      let priority = 0.8;
      let changeFrequency: 'weekly' | 'daily' | 'monthly' = 'weekly';
      
      if (route === '') {
        priority = 1.0;
      } else if (route === '/cars') {
        priority = 0.9;
      } else if (route === '/search') {
        priority = 0.7;
        changeFrequency = 'daily';
      } else if (route === '/terms') {
        priority = 0.6;
        changeFrequency = 'monthly';
      }
      
      return {
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: alternates,
        },
      };
    });
  });

  return [...staticPages, ...carPages];
}
