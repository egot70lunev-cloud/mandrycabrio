import { env } from './env';
import type { Booking } from '@prisma/client';
import type { Car } from '@/data/cars';
import { formatEUR } from './format';

type PricingSummary = {
  days: number;
  dailyRate: number | null;
  total: number | null;
  monthPrice: number | null;
  onRequestMonth: boolean;
};

export async function createCalendarEvent(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary
): Promise<void> {
  if (!env.googleCalendarId || !env.googleServiceAccountKey) {
    console.log('[GCAL] Would create calendar event:', {
      title: `${booking.status} — ${car.name} — ${booking.name}`,
      start: booking.startAt,
      end: booking.endAt,
      description: buildEventDescription(booking, car, pricingSummary),
    });
    return;
  }

  try {
    // TODO: Implement Google Calendar API integration
    // const { google } = require('googleapis');
    // const serviceAccount = JSON.parse(env.googleServiceAccountKey);
    // const auth = new google.auth.JWT(
    //   serviceAccount.client_email,
    //   null,
    //   serviceAccount.private_key,
    //   ['https://www.googleapis.com/auth/calendar']
    // );
    // const calendar = google.calendar({ version: 'v3', auth });
    // await calendar.events.insert({
    //   calendarId: env.googleCalendarId,
    //   requestBody: {
    //     summary: `${booking.status} — ${car.name} — ${booking.name}`,
    //     description: buildEventDescription(booking, car, pricingSummary),
    //     start: {
    //       dateTime: booking.startAt.toISOString(),
    //       timeZone: 'Europe/Madrid',
    //     },
    //     end: {
    //       dateTime: booking.endAt.toISOString(),
    //       timeZone: 'Europe/Madrid',
    //     },
    //   },
    // });
    
    console.log('[GCAL] Calendar event created (stub)');
  } catch (error) {
    console.error('[GCAL] Error creating calendar event:', error);
    // Don't throw - calendar is optional
  }
}

function buildEventDescription(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary
): string {
  const startDate = new Date(booking.startAt).toLocaleString('en-US');
  const endDate = new Date(booking.endAt).toLocaleString('en-US');

  return `
Booking ID: ${booking.id}
Status: ${booking.status}

Car: ${car.name}
Dates: ${startDate} - ${endDate} (${pricingSummary.days} ${pricingSummary.days === 1 ? 'day' : 'days'})

Pickup: ${booking.pickupLocation}
Dropoff: ${booking.dropoffLocation}

Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
${booking.whatsapp ? `WhatsApp: ${booking.whatsapp}\n` : ''}
${booking.flightNumber ? `Flight Number: ${booking.flightNumber}\n` : ''}

Deposit: ${formatEUR(car.deposit)}
Estimated Total: ${pricingSummary.total !== null ? formatEUR(pricingSummary.total) : 'On request'}
${pricingSummary.dailyRate !== null ? `Daily Rate: ${formatEUR(pricingSummary.dailyRate)}/day` : ''}
${pricingSummary.monthPrice !== null ? `Monthly Rate: ${formatEUR(pricingSummary.monthPrice)}` : ''}
${pricingSummary.onRequestMonth ? 'Monthly price on request' : ''}
  `.trim();
}




