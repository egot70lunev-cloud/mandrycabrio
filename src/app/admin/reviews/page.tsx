'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  carSlug: string | null;
  language: string;
  isApproved: boolean;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const stored = sessionStorage.getItem('admin-password');
    if (stored) {
      setAdminPassword(stored);
      setIsAuthenticated(true);
      fetchReviews(stored);
    }
  }, []);

  const fetchReviews = async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'x-admin-password': pwd,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Store password in sessionStorage
    sessionStorage.setItem('admin-password', password);
    setAdminPassword(password);
    setIsAuthenticated(true);
    fetchReviews(password);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'POST',
        headers: {
          'x-admin-password': adminPassword,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve review');
      }

      // Refresh reviews
      fetchReviews(adminPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Refresh reviews
      fetchReviews(adminPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#2B2B2B] mb-4">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2B2B2B] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#E5E5E5] bg-white text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]/20"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg text-[var(--accent)] text-sm">
                {error}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const approvedReviews = reviews.filter((r) => r.isApproved);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B2B2B]">Reviews Management</h1>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('admin-password');
              setIsAuthenticated(false);
              setAdminPassword('');
            }}
          >
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg text-[var(--accent)]">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-[#6B6B6B]">Loading reviews...</p>
          </div>
        )}

        {/* Pending Reviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">
            Pending Reviews ({pendingReviews.length})
          </h2>
          {pendingReviews.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-[#6B6B6B]">No pending reviews</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-[#2B2B2B]">{review.name}</h3>
                        <span className="text-sm text-[#6B6B6B]">
                          {review.rating}/5 ⭐
                        </span>
                        <span className="text-xs px-2 py-1 bg-[#FFF9C4] rounded">
                          {review.language.toUpperCase()}
                        </span>
                        {review.carSlug && (
                          <span className="text-xs px-2 py-1 bg-[#E5E5E5] rounded">
                            {review.carSlug}
                          </span>
                        )}
                      </div>
                      <p className="text-[#6B6B6B] mb-2">{review.comment}</p>
                      <p className="text-xs text-[#9B9B9B]">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Approved Reviews */}
        <div>
          <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">
            Approved Reviews ({approvedReviews.length})
          </h2>
          {approvedReviews.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-[#6B6B6B]">No approved reviews</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-[#2B2B2B]">{review.name}</h3>
                        <span className="text-sm text-[#6B6B6B]">
                          {review.rating}/5 ⭐
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          APPROVED
                        </span>
                        <span className="text-xs px-2 py-1 bg-[#FFF9C4] rounded">
                          {review.language.toUpperCase()}
                        </span>
                        {review.carSlug && (
                          <span className="text-xs px-2 py-1 bg-[#E5E5E5] rounded">
                            {review.carSlug}
                          </span>
                        )}
                      </div>
                      <p className="text-[#6B6B6B] mb-2">{review.comment}</p>
                      <p className="text-xs text-[#9B9B9B]">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



