import { google } from 'googleapis';
import { env } from './env';
import { formatEUR } from './format';

export type CalendarEventResult = {
  eventId?: string;
  htmlLink?: string;
  status: 'created' | 'skipped' | 'failed';
  error?: string;
};

export type CreateBookingEventInput = {
  booking: {
    id: string;
    startAt: string; // ISO
    endAt: string;   // ISO
    pickupLocation: string;
    dropoffLocation: string;
    total?: number | null;
    deposit?: number | null;
    status?: 'PENDING' | 'CONFIRMED';
    notes?: string | null;
    paymentMethod?: string | null;
    extras?: {
      items: Array<{ id: string; label: string; price: number | null }>;
      extrasTotal: number;
      hasByAgreement: boolean;
    } | null;
  };
  car: {
    name: string;
    slug?: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string | null;
  };
};

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'North Airport (TFN)',
  'south-airport-tfs': 'South Airport (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  other: 'Other (by agreement)',
};

function normalizePrivateKey(key: string): string {
  // Handle Windows-style escaped newlines
  return key.replace(/\\n/g, '\n');
}

function buildDescription(input: CreateBookingEventInput): string {
  const { booking, car, customer } = input;
  const pickupLabel = locationLabels[booking.pickupLocation] || booking.pickupLocation;
  const dropoffLabel = locationLabels[booking.dropoffLocation] || booking.dropoffLocation;
  const totalText =
    booking.total !== null && booking.total !== undefined ? formatEUR(booking.total) : 'On request';
  const depositText =
    booking.deposit !== null && booking.deposit !== undefined ? formatEUR(booking.deposit) : 'N/A';

  const extrasBlock =
    booking.extras && booking.extras.items.length > 0
      ? `Extras:
${booking.extras.items
  .map((item) => {
    if (item.price === null) return `- ${item.label} (by agreement)`;
    if (item.price === 0) return `- ${item.label} (free)`;
    return `- ${item.label} (${formatEUR(item.price)})`;
  })
  .join('\n')}
${booking.extras.extrasTotal > 0 ? `Extras total: ${formatEUR(booking.extras.extrasTotal)}` : ''}
${booking.extras.hasByAgreement ? '(Some services require price confirmation)' : ''}`
      : '';

  const notesBlock = booking.notes ? `\nNotes:\n${booking.notes}` : '';
  const paymentBlock = booking.paymentMethod ? `\nPayment: ${booking.paymentMethod}` : '';

  return `Booking ID: ${booking.id}

Car: ${car.name}${car.slug ? ` (${car.slug})` : ''}
Pickup: ${pickupLabel}
Dropoff: ${dropoffLabel}

Client:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
WhatsApp: ${customer.whatsapp || 'N/A'}

Deposit: ${depositText}
Estimated total: ${totalText}
${extrasBlock}
Status: ${booking.status || 'PENDING'}${paymentBlock}${notesBlock}`;
}

export async function createBookingEvent(
  input: CreateBookingEventInput
): Promise<CalendarEventResult> {
  if (!env.googleCalendarId) {
    console.log('[CALENDAR] Skipped: GOOGLE_CALENDAR_ID not set');
    return { status: 'skipped', error: 'missing_calendar_id' };
  }
  const { loadServiceAccountKey } = require('./env');
  const serviceAccount = loadServiceAccountKey();
  
  if (!serviceAccount) {
    console.log('[CALENDAR] Skipped: service account envs missing');
    return { status: 'skipped', error: 'missing_service_account_envs' };
  }

  try {
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const description = buildDescription(input);
    const event = {
      summary: `Mandry Cabrio — ${input.car.name} — ${input.customer.name}`,
      description,
      start: {
        dateTime: input.booking.startAt,
        timeZone: 'Atlantic/Canary',
      },
      end: {
        dateTime: input.booking.endAt,
        timeZone: 'Atlantic/Canary',
      },
      location: input.booking.pickupLocation,
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: env.googleCalendarId,
      requestBody: event,
    });

    const eventId = response.data.id || undefined;
    const htmlLink = response.data.htmlLink || undefined;

    console.log(`[CALENDAR] Event created: ${htmlLink} (ID: ${eventId})`);
    return { status: 'created', eventId, htmlLink };
  } catch (error) {
    console.error('[CALENDAR] Error creating calendar event:', error);
    if (error instanceof Error) {
      console.error('[CALENDAR] Error details:', { name: error.name, message: error.message });
      return { status: 'failed', error: error.message };
    }
    return { status: 'failed', error: 'unknown_error' };
  }
}

export async function createDummyCalendarEvent(): Promise<CalendarEventResult> {
  const now = new Date();
  const start = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
  const end = new Date(now.getTime() + 90 * 60 * 1000).toISOString();

  return createBookingEvent({
    booking: {
      id: 'dummy-booking',
      startAt: start,
      endAt: end,
      pickupLocation: 'north-airport-tfn',
      dropoffLocation: 'north-airport-tfn',
      total: 200,
      deposit: 100,
      status: 'PENDING',
      extras: null,
      notes: 'Dev test event',
      paymentMethod: 'cash',
    },
    car: { name: 'Test Cabrio' },
    customer: {
      name: 'Dev Tester',
      email: 'test@example.com',
      phone: '+0000000000',
      whatsapp: '+0000000000',
    },
  });
}

