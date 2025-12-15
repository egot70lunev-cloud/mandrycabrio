import { env } from './env';
import { formatEUR } from './format';

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'North Airport (TFN)',
  'south-airport-tfs': 'South Airport (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  'other': 'Other (by agreement)',
};

export type CalendarBookingParams = {
  bookingId: string;
  carName: string;
  fromISO: string;
  toISO: string;
  pickup: string;
  dropoff: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  deposit: number;
  total?: number | null;
  status: 'PENDING' | 'CONFIRMED';
  extrasSummary?: {
    items: Array<{ id: string; label: string; price: number | null }>;
    extrasTotal: number;
    hasByAgreement: boolean;
  };
};

/**
 * Create a Google Calendar event for a booking
 * Non-blocking: never throws, logs errors but doesn't break the booking flow
 */
export async function createCalendarEvent(p: CalendarBookingParams): Promise<void> {
  // Check if Google Calendar is configured
  if (!env.googleCalendarId || !env.googleServiceAccountJson) {
    console.log('[CALENDAR] Not configured', p.bookingId);
    return;
  }

  try {
    // Parse service account JSON
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(env.googleServiceAccountJson);
    } catch (parseError) {
      console.error('[CALENDAR] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', parseError);
      return;
    }

    // Initialize Google Calendar API
    const { google } = await import('googleapis');
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Build event description
    const pickupLabel = locationLabels[p.pickup] || p.pickup;
    const dropoffLabel = locationLabels[p.dropoff] || p.dropoff;
    const totalText = p.total !== null && p.total !== undefined ? formatEUR(p.total) : 'On request';

    const description = `Booking ID: ${p.bookingId}

Car: ${p.carName}
Pickup: ${pickupLabel}
Dropoff: ${dropoffLabel}

Client:
Name: ${p.clientName}
Email: ${p.clientEmail}
Phone: ${p.clientPhone}

Deposit: ${formatEUR(p.deposit)}
Estimated total: ${totalText}
${p.extrasSummary && p.extrasSummary.items.length > 0 ? `
Extras:
${p.extrasSummary.items.map(item => {
  if (item.price === null) {
    return `- ${item.label} (by agreement)`;
  }
  if (item.price === 0) {
    return `- ${item.label} (free)`;
  }
  return `- ${item.label} (€${item.price})`;
}).join('\n')}
${p.extrasSummary.extrasTotal > 0 ? `Extras total: €${p.extrasSummary.extrasTotal}` : ''}
${p.extrasSummary.hasByAgreement ? '(Some services require price confirmation)' : ''}
` : ''}
Status: ${p.status}`;

    // Create calendar event
    const event = {
      summary: `${p.status} — ${p.carName} — ${p.clientName}`,
      description: description.trim(),
      start: {
        dateTime: p.fromISO,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: p.toISO,
        timeZone: 'Europe/Madrid',
      },
    };

    const response = await calendar.events.insert({
      calendarId: env.googleCalendarId,
      requestBody: event,
    });

    console.log(`[CALENDAR] Event created: ${response.data.htmlLink} (ID: ${response.data.id})`);
  } catch (error) {
    // Log error but don't throw - calendar is optional
    console.error('[CALENDAR] Error creating calendar event:', error);
    if (error instanceof Error) {
      console.error('[CALENDAR] Error details:', {
        name: error.name,
        message: error.message,
      });
    }
  }
}

