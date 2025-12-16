import { NextResponse } from 'next/server';
import { createDummyCalendarEvent } from '@/lib/calendar';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const result = await createDummyCalendarEvent();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('[CALENDAR-TEST] Error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to create test event' }, { status: 500 });
  }
}
