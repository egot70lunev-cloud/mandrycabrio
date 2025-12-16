/**
 * Google Calendar integration using Service Account
 * Creates events in the shared calendar for bookings
 */

import { google } from 'googleapis';
import { env, loadServiceAccountKey } from './env';
import { getGoogleAuth, getCalendarClient } from './googleAuth';
import { formatEUR } from './format';

export type CreateBookingEventInput = {
  bookingId: string;
  carName: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  deposit?: number | null;
  total?: number | null;
  notes?: string | null;
  startISO: string;
  endISO: string;
};

export type CalendarEventResult = {
  ok: boolean;
  eventId?: string;
  htmlLink?: string;
  error?: string;
};


/**
 * Create a Google Calendar event for a booking
 * Uses Service Account authentication (JWT)
 * 
 * @param input Event details
 * @returns Result with eventId and htmlLink on success
 */
export async function createBookingEvent(
  input: CreateBookingEventInput
): Promise<CalendarEventResult> {
  // Check configuration
  if (!env.googleCalendarId) {
    const error = 'GOOGLE_CALENDAR_ID not configured';
    console.error('[GOOGLE_CALENDAR]', error);
    return { ok: false, error };
  }

  // Log calendar creation start
  console.log('CALENDAR_CREATE_START', { calendarId: env.googleCalendarId });

  // Get calendar client using helper
  const calendar = getCalendarClient();
  if (!calendar) {
    const error = 'Failed to initialize Google Calendar client. Check GOOGLE_SERVICE_ACCOUNT_KEY configuration.';
    console.error('[GOOGLE_CALENDAR]', error);
    return { ok: false, error };
  }

  try {

    // Build event description with all booking details
    const depositText = input.deposit !== null && input.deposit !== undefined ? formatEUR(input.deposit) : 'N/A';
    const totalText = input.total !== null && input.total !== undefined ? formatEUR(input.total) : 'On request';
    
    let description = `Booking ID: ${input.bookingId}

Customer: ${input.customerName}
Phone: ${input.customerPhone}
Pickup: ${input.pickupLocation}
Dropoff: ${input.dropoffLocation}
Deposit: ${depositText}
Total: ${totalText}`;

    if (input.notes) {
      description += `\n\nNotes: ${input.notes}`;
    }

    // Create event
    const event = {
      summary: `Mandry Cabrio – ${input.carName}`,
      description,
      start: {
        dateTime: input.startISO,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: input.endISO,
        timeZone: 'Europe/Madrid',
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: env.googleCalendarId,
      requestBody: event,
    });

    const eventId = response.data.id;
    const htmlLink = response.data.htmlLink;

    // Log the calendar event ID after creation
    console.log('[GOOGLE_CALENDAR] Event created successfully');
    console.log('[GOOGLE_CALENDAR] Event ID:', eventId);
    console.log('[GOOGLE_CALENDAR] Event Link:', htmlLink);
    console.log('[GOOGLE_CALENDAR] Calendar ID:', env.googleCalendarId);

    // Log success with structured format
    console.log('CALENDAR_CREATE_OK', { eventId: eventId || null, htmlLink: htmlLink || null });

    return {
      ok: true,
      eventId: eventId || undefined,
      htmlLink: htmlLink || undefined,
    };
  } catch (error) {
    // Log the exact Google API error
    console.error('[GOOGLE_CALENDAR] Error creating event');
    
    if (error instanceof Error) {
      console.error('[GOOGLE_CALENDAR] Error message:', error.message);
      console.error('[GOOGLE_CALENDAR] Error name:', error.name);
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      const gError = error as { response?: { data?: unknown; status?: number; statusText?: string } };
      console.error('[GOOGLE_CALENDAR] Google API Error Response:');
      console.error('[GOOGLE_CALENDAR] Status:', gError.response?.status, gError.response?.statusText);
      console.error('[GOOGLE_CALENDAR] Response Data:', JSON.stringify(gError.response?.data, null, 2));
    } else {
      console.error('[GOOGLE_CALENDAR] Full error object:', error);
    }

    // Log failure with structured format
    console.error('CALENDAR_CREATE_FAIL', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      ok: false,
      error: errorMessage,
    };
  }
}
