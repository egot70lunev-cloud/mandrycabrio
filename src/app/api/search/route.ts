import { NextRequest, NextResponse } from 'next/server';
import { getAvailableCars } from '@/lib/searchCars';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromISO = searchParams.get('from');
    const toISO = searchParams.get('to');
    const cat = searchParams.get('cat') || 'any';

    // Validate dates
    if (!fromISO || !toISO) {
      return NextResponse.json(
        { ok: false, error: 'Missing from or to parameters' },
        { status: 400 }
      );
    }

    const result = await getAvailableCars({
      from: fromISO,
      to: toISO,
      cat,
    });

    return NextResponse.json({
      ok: true,
      from: fromISO,
      to: toISO,
      cat,
      cars: result.cars,
      unavailableSlugs: result.unavailableSlugs,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in /api/search:', error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    );
  }
}

