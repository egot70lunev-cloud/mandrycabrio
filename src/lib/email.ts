import { env } from './env';
import type { Booking } from '@prisma/client';
import type { Car } from '@/data/cars';
import { formatEUR } from './format';
import type { ExtrasSummary } from '@/lib/extras';

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'North Airport (TFN)',
  'south-airport-tfs': 'South Airport (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  'other': 'Other (by agreement)',
};

type PricingSummary = {
  days: number;
  dailyRate: number | null;
  total: number | null;
  monthPrice: number | null;
  onRequestMonth: boolean;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; errorMessage: string; errorName?: string };

/**
 * Send email using Resend if API key is configured, otherwise log to console.
 * Never throws – errors are logged but don't break the flow.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { to, subject, html, text } = input;

  console.log('[EMAIL] sending', { to, from: env.emailFrom, subject });

  if (env.resendApiKey && env.resendApiKey.trim() !== '') {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(env.resendApiKey);

      const { data, error } = await resend.emails.send({
        from: env.emailFrom,
        to,
        subject,
        html,
        text,
      });

      console.log('[EMAIL] result', { id: data?.id, error: error ?? null });

      if (error) {
        const errorMessage = (error as Error)?.message ?? 'Unknown Resend error';
        const errorName = (error as Error)?.name;
        console.error('[EMAIL] Failed to send via Resend:', error);
        return { ok: false, errorMessage, errorName };
      }

      return { ok: true, id: data?.id };
    } catch (error) {
      // Log error but don't throw - email failure shouldn't break booking
      console.error('[EMAIL] Failed to send via Resend:', error);
      const errorMessage = (error as Error)?.message ?? 'Unknown Resend error';
      const errorName = (error as Error)?.name;
      return { ok: false, errorMessage, errorName };
    }
  } else {
    // Fallback: log in development
    console.log('[EMAIL Fallback]', subject, to);
    console.log(text);
    return { ok: true };
  }
}

export function buildClientEmail(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary,
  extrasSummary?: ExtrasSummary | null
): { subject: string; html: string; text: string } {
  const startDate = new Date(booking.startAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(booking.endAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = 'MandryCabrio — Booking request received';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2B2B2B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2B2B2B; color: white; padding: 20px; text-align: center; }
        .content { background: #F5F5F5; padding: 20px; }
        .section { margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px; }
        .highlight { background: #FFF9C4; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MandryCabrio</h1>
        </div>
        <div class="content">
          <h2>Booking Request Received</h2>
          <p>Dear ${booking.name},</p>
          <p>Thank you for your booking request. We have received your reservation details:</p>
          
          <div class="section">
            <h3>Booking Details</h3>
            <p><strong>Car:</strong> ${car.name}</p>
            <p><strong>Dates:</strong> ${startDate} - ${endDate} (${pricingSummary.days} ${pricingSummary.days === 1 ? 'day' : 'days'})</p>
            <p><strong>Pickup:</strong> ${locationLabels[booking.pickupLocation] || booking.pickupLocation}</p>
            <p><strong>Dropoff:</strong> ${locationLabels[booking.dropoffLocation] || booking.dropoffLocation}</p>
            ${booking.flightNumber ? `<p><strong>Flight Number:</strong> ${booking.flightNumber}</p>` : ''}
          </div>

          <div class="section">
            <h3>Pricing Summary</h3>
            <p><strong>Deposit:</strong> ${formatEUR(car.deposit)}</p>
            ${pricingSummary.total !== null ? `<p><strong>Estimated Total:</strong> ${formatEUR(pricingSummary.total)}</p>` : ''}
            ${pricingSummary.dailyRate !== null ? `<p><em>(${formatEUR(pricingSummary.dailyRate)}/day × ${pricingSummary.days} days)</em></p>` : ''}
            ${pricingSummary.monthPrice !== null ? `<p><strong>Monthly Rate:</strong> ${formatEUR(pricingSummary.monthPrice)}</p>` : ''}
            ${pricingSummary.onRequestMonth ? `<p><em>Monthly price on request</em></p>` : ''}
          </div>

          <div class="highlight">
            <h3>Next Steps</h3>
            <ul>
              <li><strong>Prepayment €100</strong> required to confirm booking</li>
              <li><strong>Payment methods:</strong> Privat24 / Mono / USDT / Santander / BBVA / Caixa</li>
              <li>Apple Pay link available on request</li>
              <li>Rental payment + deposit on pickup</li>
            </ul>
            <p style="margin-top: 15px;">
              <strong>Contact us on WhatsApp:</strong> <a href="https://wa.me/34692735125" style="color: #2B2B2B; text-decoration: underline;">+34 692 735 125</a>
            </p>
          </div>

          <p>We will contact you shortly to confirm your booking and provide payment instructions.</p>
          <p>Booking ID: <strong>${booking.id}</strong></p>
        </div>
        <div class="footer">
          <p>MandryCabrio — Premium Car Rental in Tenerife</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
MandryCabrio — Booking Request Received

Dear ${booking.name},

Thank you for your booking request. We have received your reservation details:

Booking Details:
- Car: ${car.name}
- Dates: ${startDate} - ${endDate} (${pricingSummary.days} ${pricingSummary.days === 1 ? 'day' : 'days'})
- Pickup: ${locationLabels[booking.pickupLocation] || booking.pickupLocation}
- Dropoff: ${locationLabels[booking.dropoffLocation] || booking.dropoffLocation}
${booking.flightNumber ? `- Flight Number: ${booking.flightNumber}` : ''}

Pricing Summary:
- Deposit: ${formatEUR(car.deposit)}
${pricingSummary.total !== null ? `- Estimated Total: ${formatEUR(pricingSummary.total)}` : ''}
${pricingSummary.dailyRate !== null ? `  (${formatEUR(pricingSummary.dailyRate)}/day × ${pricingSummary.days} days)` : ''}
${pricingSummary.monthPrice !== null ? `- Monthly Rate: ${formatEUR(pricingSummary.monthPrice)}` : ''}
${pricingSummary.onRequestMonth ? '- Monthly price on request' : ''}

Next Steps:
- Prepayment €100 required to confirm booking
- Payment methods: Privat24 / Mono / USDT / Santander / BBVA / Caixa
- Apple Pay link available on request
- Rental payment + deposit on pickup
- Contact us on WhatsApp: +34 692 735 125

We will contact you shortly to confirm your booking and provide payment instructions.

Booking ID: ${booking.id}

MandryCabrio — Premium Car Rental in Tenerife
  `.trim();

  return { subject, html, text };
}

export function buildAdminEmail(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary,
  extrasSummary?: ExtrasSummary | null
): { subject: string; html: string; text: string } {
  const startDate = new Date(booking.startAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(booking.endAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = `New booking request — ${car.name} — ${startDate} to ${endDate}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2B2B2B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2B2B2B; color: white; padding: 20px; text-align: center; }
        .content { background: #F5F5F5; padding: 20px; }
        .section { margin: 20px 0; }
        .highlight { background: #FFF9C4; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request</h1>
        </div>
        <div class="content">
          <div class="section">
            <h3>Car & Dates</h3>
            <p><strong>Car:</strong> ${car.name}</p>
            <p><strong>Dates:</strong> ${startDate} - ${endDate} (${pricingSummary.days} ${pricingSummary.days === 1 ? 'day' : 'days'})</p>
            <p><strong>Pickup:</strong> ${locationLabels[booking.pickupLocation] || booking.pickupLocation}</p>
            <p><strong>Dropoff:</strong> ${locationLabels[booking.dropoffLocation] || booking.dropoffLocation}</p>
          </div>

          <div class="section">
            <h3>Client Information</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            ${booking.whatsapp ? `<p><strong>WhatsApp:</strong> ${booking.whatsapp}</p>` : ''}
            ${booking.flightNumber ? `<p><strong>Flight Number:</strong> ${booking.flightNumber}</p>` : ''}
          </div>

          <div class="section">
            <h3>Pricing</h3>
            <p><strong>Deposit:</strong> ${formatEUR(car.deposit)}</p>
            ${pricingSummary.total !== null ? `<p><strong>Estimated Total:</strong> ${formatEUR(pricingSummary.total)}</p>` : ''}
            ${pricingSummary.dailyRate !== null ? `<p><em>(${formatEUR(pricingSummary.dailyRate)}/day × ${pricingSummary.days} days)</em></p>` : ''}
            ${pricingSummary.monthPrice !== null ? `<p><strong>Monthly Rate:</strong> ${formatEUR(pricingSummary.monthPrice)}</p>` : ''}
            ${pricingSummary.onRequestMonth ? `<p><em>Monthly price on request</em></p>` : ''}
          </div>

          <div class="highlight">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Created:</strong> ${new Date(booking.createdAt).toLocaleString('en-US')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Booking Request

Car & Dates:
- Car: ${car.name}
- Dates: ${startDate} - ${endDate} (${pricingSummary.days} ${pricingSummary.days === 1 ? 'day' : 'days'})
- Pickup: ${locationLabels[booking.pickupLocation] || booking.pickupLocation}
- Dropoff: ${locationLabels[booking.dropoffLocation] || booking.dropoffLocation}

Client Information:
- Name: ${booking.name}
- Email: ${booking.email}
- Phone: ${booking.phone}
${booking.whatsapp ? `- WhatsApp: ${booking.whatsapp}` : ''}
${booking.flightNumber ? `- Flight Number: ${booking.flightNumber}` : ''}

Pricing:
- Deposit: ${formatEUR(car.deposit)}
${pricingSummary.total !== null ? `- Estimated Total: ${formatEUR(pricingSummary.total)}` : ''}
${pricingSummary.dailyRate !== null ? `  (${formatEUR(pricingSummary.dailyRate)}/day × ${pricingSummary.days} days)` : ''}
        ${pricingSummary.monthPrice !== null ? `- Monthly Rate: ${formatEUR(pricingSummary.monthPrice)}` : ''}
        ${pricingSummary.onRequestMonth ? '- Monthly price on request' : ''}
        ${extrasSummary && extrasSummary.items.length > 0 ? `
        
        Extras:
        ${extrasSummary.items.map(item => {
          if (item.price === null) {
            return `- ${item.label} (by agreement)`;
          }
          if (item.price === 0) {
            return `- ${item.label} (free)`;
          }
          return `- ${item.label} (${formatEUR(item.price)})`;
        }).join('\n')}
        ${extrasSummary.extrasTotal > 0 ? `- Extras total: ${formatEUR(extrasSummary.extrasTotal)}` : ''}
        ${extrasSummary.hasByAgreement ? '- Some services require price confirmation' : ''}
        ${pricingSummary.total !== null && extrasSummary.extrasTotal > 0 ? `- Total (incl. extras): ${formatEUR(pricingSummary.total + extrasSummary.extrasTotal)}` : ''}
        ` : ''}

        Booking ID: ${booking.id}
Status: ${booking.status}
Created: ${new Date(booking.createdAt).toLocaleString('en-US')}
  `.trim();

  return { subject, html, text };
}

export async function sendClientEmail(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary,
  extrasSummary?: ExtrasSummary | null
): Promise<SendEmailResult> {
  const email = buildClientEmail(booking, car, pricingSummary, extrasSummary);
  return sendEmail({
    to: booking.email,
    ...email,
  });
}

export async function sendAdminEmail(
  booking: Booking,
  car: Car,
  pricingSummary: PricingSummary,
  extrasSummary?: ExtrasSummary | null
): Promise<SendEmailResult> {
  const email = buildAdminEmail(booking, car, pricingSummary, extrasSummary);
  return sendEmail({
    to: env.adminEmail,
    ...email,
  });
}

