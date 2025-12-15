/**
 * Schema.org structured data helpers
 */

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  areaServed: {
    '@type': string;
    name: string;
  };
  telephone: string;
  url: string;
  address?: {
    '@type': string;
    addressCountry: string;
    addressLocality: string;
  };
}

export interface RentalCarSchema {
  '@context': string;
  '@type': string;
  name: string;
  brand: {
    '@type': string;
    name: string;
  };
  description: string;
  offers?: {
    '@type': string;
    priceCurrency: string;
    price?: string;
    priceRange?: string;
    availability: string;
  };
}

export function buildLocalBusinessSchema(siteUrl: string): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MandryCabrio',
    areaServed: {
      '@type': 'City',
      name: 'Tenerife',
    },
    telephone: '+34 692 735 125',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
      addressLocality: 'Tenerife',
    },
  };
}

export function buildRentalCarSchema(
  carName: string,
  brand: string,
  description: string,
  priceRange?: string,
  price?: number
): RentalCarSchema {
  const schema: RentalCarSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: carName,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  if (price) {
    schema.offers!.price = price.toString();
  } else if (priceRange) {
    schema.offers!.priceRange = priceRange;
  }

  return schema;
}

export interface ReviewSchema {
  '@context': string;
  '@type': string;
  author: {
    '@type': string;
    name: string;
  };
  reviewBody: string;
  reviewRating: {
    '@type': string;
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  datePublished: string;
}

export interface AggregateRatingSchema {
  '@type': string;
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  reviewCount: number;
}

export function buildReviewSchema(review: {
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}): ReviewSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.name,
    },
    reviewBody: review.comment,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: new Date(review.createdAt).toISOString(),
  };
}

export function buildAggregateRatingSchema(
  averageRating: number,
  reviewCount: number
): AggregateRatingSchema {
  return {
    '@type': 'AggregateRating',
    ratingValue: averageRating,
    bestRating: 5,
    worstRating: 1,
    reviewCount,
  };
}

