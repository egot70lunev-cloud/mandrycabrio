import { NextResponse } from 'next/server';
import { createBookingEvent } from '@/lib/googleCalendar';

/**
 * Test endpoint to create a dummy calendar event
 * Only available in development mode
 * GET /api/calendar/test
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    // Create a dummy event starting in 10 minutes, duration 30 minutes
    const now = new Date();
    const startDate = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes duration

    const result = await createBookingEvent({
      bookingId: 'test-booking-1',
      carName: 'Test Car',
      customerName: 'Test Customer',
      customerPhone: '+34600000000',
      pickupLocation: 'North Airport (TFN)',
      dropoffLocation: 'South Airport (TFS)',
      startISO: startDate.toISOString(),
      endISO: endDate.toISOString(),
    });

    if (result.ok) {
      return NextResponse.json({
        ok: true,
        eventId: result.eventId,
        htmlLink: result.htmlLink,
        message: 'Test event created successfully',
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          error: result.error || 'Failed to create test event',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CALENDAR_TEST] Error:', errorMessage);
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
