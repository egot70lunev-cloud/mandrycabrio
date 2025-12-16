import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple in-memory rate limit (IP -> last submission time)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 2 * 60 * 1000; // 2 minutes

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const lastSubmission = rateLimitMap.get(ip);
  const now = Date.now();
  
  if (lastSubmission && (now - lastSubmission) < RATE_LIMIT_MS) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(ip, now);
  return true; // Allowed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment, carSlug, language, honeypot } = body;

    // Honeypot check: if filled, silently ignore
    if (honeypot) {
      return NextResponse.json({ ok: true, message: 'Thank you for your review!' });
    }

    // Rate limit check
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Please wait before submitting another review.' },
        { status: 429 }
      );
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    if (comment.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const validLanguage = language === 'es' ? 'es' : 'en';

    // Create review (pending by default)
    const review = await prisma.review.create({
      data: {
        name: name.trim(),
        rating: Math.round(rating),
        comment: comment.trim(),
        carSlug: carSlug || null,
        language: validLanguage,
        isApproved: false,
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Thank you! Your review will appear after approval.',
      reviewId: review.id,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';
    const carSlug = searchParams.get('carSlug');
    const validLanguage = lang === 'es' ? 'es' : 'en';

    // Build query
    const where: any = {
      isApproved: true,
      language: validLanguage,
    };

    if (carSlug) {
      where.carSlug = carSlug;
    } else {
      // For general reviews (home page), only show reviews without carSlug
      where.carSlug = null;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent
    });

    // Calculate aggregate rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    const reviewCount = reviews.length;

    return NextResponse.json({
      ok: true,
      reviews,
      aggregateRating: {
        average: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        count: reviewCount,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}




