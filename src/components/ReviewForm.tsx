'use client';

import { useState } from 'react';
import { Button, Card } from './ui';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n';

type ReviewFormProps = {
  carSlug?: string;
  onSuccess?: () => void;
};

export function ReviewForm({ carSlug, onSuccess }: ReviewFormProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const lang = locale === 'es' ? 'es' : 'en';

  const [name, setName] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot field
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          rating,
          comment,
          carSlug: carSlug || null,
          language: lang,
          honeypot, // Honeypot field
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Success
      setSuccess(true);
      setName('');
      setRating(null);
      setComment('');
      setHoneypot('');

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarInput = () => {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--color-primary)]">
          {lang === 'es' ? 'Calificación:' : 'Rating:'}
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`
                transition-all duration-200
                ${rating && star <= rating 
                  ? 'text-[var(--accent)] scale-110' 
                  : 'text-[var(--border)] hover:text-[var(--accent)]'
                }
              `}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {rating && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            {rating} {lang === 'es' ? 'estrellas' : 'stars'}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
        {lang === 'es' ? 'Deja tu reseña' : 'Leave a Review'}
      </h3>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {lang === 'es' 
            ? '¡Gracias! Tu reseña aparecerá después de la aprobación.' 
            : 'Thank you! Your review will appear after approval.'}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field (hidden from users) */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
            {lang === 'es' ? 'Nombre' : 'Name'}
          </label>
          <input
            id="review-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
            placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
          />
        </div>

        <div>
          {renderStarInput()}
          {!rating && (
            <p className="text-xs text-red-600 mt-1">
              {lang === 'es' ? 'Selecciona una calificación' : 'Please select a rating'}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
            {lang === 'es' ? 'Comentario' : 'Comment'}
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all resize-none"
            placeholder={lang === 'es' ? 'Escribe tu comentario...' : 'Write your comment...'}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {comment.length}/1000 {lang === 'es' ? 'caracteres' : 'characters'}
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading || !rating || !name.trim() || !comment.trim()}
          className="w-full"
        >
          {loading 
            ? (lang === 'es' ? 'Enviando...' : 'Submitting...') 
            : (lang === 'es' ? 'Enviar reseña' : 'Submit Review')}
        </Button>
      </form>
    </Card>
  );
}



