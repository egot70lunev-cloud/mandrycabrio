'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui';

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type AggregateRating = {
  average: number;
  count: number;
};

type ReviewsListProps = {
  lang: 'en' | 'es';
  carSlug?: string;
  showForm?: boolean;
};

export function ReviewsList({ lang, carSlug, showForm = false }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregateRating, setAggregateRating] = useState<AggregateRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const params = new URLSearchParams({ lang });
        if (carSlug) {
          params.set('carSlug', carSlug);
        }

        const response = await fetch(`/api/reviews?${params.toString()}`);
        const data = await response.json();

        if (data.ok) {
          setReviews(data.reviews);
          setAggregateRating(data.aggregateRating);
        } else {
          setError(data.error || 'Failed to load reviews');
        }
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [lang, carSlug]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6B6B6B]">{lang === 'es' ? 'Cargando reseñas...' : 'Loading reviews...'}</p>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail, don't show error to users
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-[var(--accent)]' : 'text-[var(--border)]'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Aggregate Rating */}
      {aggregateRating && aggregateRating.count > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#2B2B2B] mb-1">
                {aggregateRating.average.toFixed(1)}
              </h3>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(aggregateRating.average))}
                <span className="text-sm text-[#6B6B6B]">
                  ({aggregateRating.count} {lang === 'es' ? 'reseñas' : 'reviews'})
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-[#6B6B6B]">
            {lang === 'es' 
              ? 'Aún no hay reseñas. Sé el primero en dejar una reseña.' 
              : 'No reviews yet. Be the first to leave a review.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-[#2B2B2B] mb-1">{review.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-[#9B9B9B]">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed">{review.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



