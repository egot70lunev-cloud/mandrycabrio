import { buildReviewSchema, buildAggregateRatingSchema } from '@/lib/schema';
import { prisma } from '@/lib/db';

type ReviewsSchemaProps = {
  lang: 'en' | 'es';
  carSlug?: string;
};

export async function ReviewsSchema({ lang, carSlug }: ReviewsSchemaProps) {
  try {
    // Ensure prisma is available
    if (!prisma) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Prisma client not available, skipping reviews schema');
      }
      return null;
    }

    const where: any = {
      isApproved: true,
      language: lang,
    };

    if (carSlug) {
      where.carSlug = carSlug;
    } else {
      where.carSlug = null;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit for schema
    });

    if (reviews.length === 0) {
      return null;
    }

    // Calculate aggregate rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    const reviewCount = reviews.length;

    // Build schema
    const aggregateRating = buildAggregateRatingSchema(
      Math.round(averageRating * 10) / 10,
      reviewCount
    );

    const reviewSchemas = reviews.map((review) =>
      buildReviewSchema({
        name: review.name,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt.toISOString(),
      })
    );

    // Combine into a single schema object
    const schema = {
      '@context': 'https://schema.org',
      '@type': carSlug ? 'Product' : 'LocalBusiness',
      aggregateRating,
      review: reviewSchemas,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error building reviews schema:', error);
    }
    return null;
  }
}

