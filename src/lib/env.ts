/**
 * Environment variables with safe defaults for development
 */

export const env = {
  adminEmail: process.env.ADMIN_EMAIL || 'egot.70.lunev@gmail.com',
  whatsappPhone: process.env.WHATSAPP_PHONE || '34692735125',
  whatsappProvider: process.env.WHATSAPP_PROVIDER || '',
  whatsappApiKey: process.env.WHATSAPP_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'bookings@mandrycabrio.com',
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID || '',
  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
} as const;

