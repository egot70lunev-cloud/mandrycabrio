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

export type WhatsAppBookingParams = {
  bookingId: string;
  carName: string;
  fromISO: string;
  toISO: string;
  days: number;
  pickup: string;
  dropoff: string;
  deposit: number;
  total: number | null;
  dailyRate: number | null;
  client: {
    name: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
  flightNumber?: string;
  extrasSummary?: {
    items: Array<{ id: string; label: string; price: number | null }>;
    extrasTotal: number;
    hasByAgreement: boolean;
  };
};

/**
 * Build a formatted WhatsApp message for admin notification
 * Format: Clear, readable, compact with emojis
 */
export function buildAdminWhatsAppMessage(p: WhatsAppBookingParams): string {
  const startDate = new Date(p.fromISO);
  const endDate = new Date(p.toISO);

  const startFormatted = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endFormatted = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const pickupLabel = locationLabels[p.pickup] || p.pickup;
  const dropoffLabel = locationLabels[p.dropoff] || p.dropoff;

  const totalText = p.total !== null ? formatEUR(p.total) : 'On request';
  const dailyRateText = p.dailyRate !== null ? ` (${formatEUR(p.dailyRate)}/day)` : '';

  let message = `🚗 New booking (PENDING)\n\n`;
  message += `Booking ID: ${p.bookingId}\n`;
  message += `Car: ${p.carName}\n\n`;
  message += `Dates: ${startFormatted} ${startTime} → ${endFormatted} ${endTime} (${p.days} ${p.days === 1 ? 'day' : 'days'})\n`;
  message += `Pickup: ${pickupLabel}\n`;
  message += `Dropoff: ${dropoffLabel}\n\n`;
  message += `Client:\n${p.client.name}\n`;
  message += `Phone: ${p.client.phone}\n`;
  message += `Email: ${p.client.email}\n`;
  if (p.client.whatsapp) {
    message += `WhatsApp: ${p.client.whatsapp}\n`;
  }
  if (p.flightNumber) {
    message += `\nFlight: ${p.flightNumber}\n`;
  }
  message += `\nDeposit: ${formatEUR(p.deposit)}\n`;
  message += `Estimated total: ${totalText}${dailyRateText}`;
  
  if (p.extrasSummary && p.extrasSummary.items.length > 0) {
    message += `\n\nExtras:\n`;
    p.extrasSummary.items.forEach(item => {
      if (item.price === null) {
        message += `• ${item.label} (by agreement)\n`;
      } else if (item.price === 0) {
        message += `• ${item.label} (free)\n`;
      } else {
        message += `• ${item.label} (€${item.price})\n`;
      }
    });
    if (p.extrasSummary.extrasTotal > 0) {
      message += `Extras total: €${p.extrasSummary.extrasTotal}\n`;
    }
    if (p.extrasSummary.hasByAgreement) {
      message += `(Some services require price confirmation)\n`;
    }
  }

  return message;
}

/**
 * Build a WhatsApp link for client with pre-filled message
 * Returns: https://wa.me/34692735125?text=...
 */
export function buildClientWhatsAppLink(p: {
  bookingId: string;
  carName: string;
  fromISO: string;
  toISO: string;
}): string {
  const startDate = new Date(p.fromISO);
  const endDate = new Date(p.toISO);

  const startFormatted = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endFormatted = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const message = `Hello MandryCabrio,

I have sent a booking request.
Booking ID: ${p.bookingId}
Car: ${p.carName}
Dates: ${startFormatted} → ${endFormatted}

Thank you!`;

  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Send WhatsApp message to admin
 * API-ready: Supports Twilio, 360dialog, or other providers
 * Never throws - errors are logged but don't break the flow
 */
export async function sendWhatsAppAdmin(message: string): Promise<void> {
  if (env.whatsappProvider && env.whatsappApiKey && env.whatsappApiKey.trim() !== '') {
    try {
      // API-ready stub for future integration
      // Example implementations (commented out):

      // Twilio WhatsApp:
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, env.whatsappApiKey);
      // await client.messages.create({
      //   body: message,
      //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      //   to: `whatsapp:+${env.whatsappPhone}`,
      // });

      // 360dialog:
      // const response = await fetch('https://waba-api.360dialog.io/v1/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${env.whatsappApiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     to: `+${env.whatsappPhone}`,
      //     type: 'text',
      //     text: { body: message },
      //   }),
      // });

      // For now, log that API would be called
      console.log('[WHATSAPP ADMIN] API provider configured but not implemented:', {
        provider: env.whatsappProvider,
        phone: env.whatsappPhone,
        messageLength: message.length,
      });
      console.log('[WHATSAPP ADMIN] Message:', message);
    } catch (error) {
      // Log error but don't throw - WhatsApp failure shouldn't break booking
      console.error('[WHATSAPP ADMIN] Failed to send via API:', error);
      console.log('[WHATSAPP ADMIN] Fallback:', message);
    }
  } else {
    // Fallback: log in development
    console.log('[WHATSAPP ADMIN]', message);
  }
}
