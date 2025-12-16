/**
 * Generate SEO-optimized alt text for car images based on locale
 */

type Locale = 'en' | 'es' | 'de' | 'ru' | 'uk';

const altTemplates: Record<Locale, (carName: string, category: string) => string> = {
  en: (carName, category) => {
    const categoryLabel = category === 'cabrio' ? 'convertible' : category === 'suv' ? 'SUV' : category.toLowerCase();
    return `${carName} ${categoryLabel} rental in Tenerife`;
  },
  es: (carName, category) => {
    const categoryLabel = category === 'cabrio' ? 'descapotable' : category === 'suv' ? 'SUV' : category === 'economy' ? 'económico' : category.toLowerCase();
    return `Alquiler ${carName} ${categoryLabel} en Tenerife`;
  },
  de: (carName, category) => {
    const categoryLabel = category === 'cabrio' ? 'Cabrio' : category === 'suv' ? 'SUV' : category === 'economy' ? 'Economy' : category.toLowerCase();
    return `${carName} ${categoryLabel} mieten auf Teneriffa`;
  },
  ru: (carName, category) => {
    const categoryLabel = category === 'cabrio' ? 'кабриолет' : category === 'suv' ? 'внедорожник' : category === 'economy' ? 'эконом' : category.toLowerCase();
    return `Аренда ${carName} ${categoryLabel} на Тенерифе`;
  },
  uk: (carName, category) => {
    const categoryLabel = category === 'cabrio' ? 'кабріолет' : category === 'suv' ? 'позашляховик' : category === 'economy' ? 'економ' : category.toLowerCase();
    return `Оренда ${carName} ${categoryLabel} на Тенеріфе`;
  },
};

export function getCarImageAlt(carName: string, category: string, locale: Locale = 'en'): string {
  return altTemplates[locale](carName, category);
}

/**
 * Get car image path based on slug
 */
export function getCarImagePath(slug: string, imageIndex: number = 1): string {
  return `/cars/${slug}/${imageIndex}.jpg`;
}

/**
 * Check if car image exists (for fallback handling)
 */
export function getCarImageSrc(slug: string, imageIndex: number = 1): string {
  // In production, this would check if file exists
  // For now, return the path - Next.js will handle 404s
  return getCarImagePath(slug, imageIndex);
}




