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
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID || process.env.CALENDAR_ID || 'ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com',
  // Support both JSON string and Base64 encoded formats
  googleServiceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '',
  googleServiceAccountKeyBase64: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 || '',
} as const;

/**
 * Load and parse Google Service Account key from environment
 * Supports two formats:
 * A) GOOGLE_SERVICE_ACCOUNT_KEY: JSON string (single line)
 * B) GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: Base64 encoded JSON string
 * 
 * @returns Parsed service account with client_email and private_key, or null if invalid
 */
export function loadServiceAccountKey(): { client_email: string; private_key: string } | null {
  let rawKey = env.googleServiceAccountKey;

  // Try Base64 format if JSON format is empty
  if ((!rawKey || rawKey.trim() === '') && env.googleServiceAccountKeyBase64) {
    try {
      const decoded = Buffer.from(env.googleServiceAccountKeyBase64, 'base64').toString('utf-8');
      rawKey = decoded;
      console.log('[GOOGLE_CALENDAR] Loaded service account key from Base64 format');
    } catch (base64Error) {
      console.error('[GOOGLE_CALENDAR] Failed to decode GOOGLE_SERVICE_ACCOUNT_KEY_BASE64:', base64Error);
      return null;
    }
  }

  if (!rawKey || rawKey.trim() === '') {
    console.error('[GOOGLE_CALENDAR] Neither GOOGLE_SERVICE_ACCOUNT_KEY nor GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is set');
    return null;
  }

  try {
    const parsed = JSON.parse(rawKey);
    
    if (!parsed.client_email || !parsed.private_key) {
      console.error('[GOOGLE_CALENDAR] Service account JSON missing required fields');
      console.error('[GOOGLE_CALENDAR] Required: client_email, private_key');
      console.error('[GOOGLE_CALENDAR] Found:', Object.keys(parsed));
      return null;
    }

    // Normalize private key: handle escaped newlines
    const normalizedKey = parsed.private_key.replace(/\\n/g, '\n');

    // Validate private key format
    if (!normalizedKey.includes('BEGIN PRIVATE KEY') || !normalizedKey.includes('END PRIVATE KEY')) {
      console.error('[GOOGLE_CALENDAR] Private key format invalid (missing BEGIN/END markers)');
      return null;
    }

    return {
      client_email: parsed.client_email,
      private_key: normalizedKey,
    };
  } catch (parseError) {
    console.error('[GOOGLE_CALENDAR] Failed to parse service account key as JSON');
    console.error('[GOOGLE_CALENDAR] Error:', parseError instanceof Error ? parseError.message : parseError);
    return null;
  }
}

/**
 * Validate that Google Service Account key is configured
 * Returns validation result with helpful error message
 */
export function validateGoogleServiceAccountKey(): {
  isValid: boolean;
  error?: string;
  hasKey: boolean;
  isParseable: boolean;
} {
  const key = loadServiceAccountKey();

  if (!key) {
    const hasJsonKey = !!(env.googleServiceAccountKey && env.googleServiceAccountKey.trim() !== '');
    const hasBase64Key = !!(env.googleServiceAccountKeyBase64 && env.googleServiceAccountKeyBase64.trim() !== '');

    if (!hasJsonKey && !hasBase64Key) {
      return {
        isValid: false,
        error: 'GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not set in environment variables. Please add it to .env.local',
        hasKey: false,
        isParseable: false,
      };
    }

    return {
      isValid: false,
      error: 'GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON or missing required fields (client_email, private_key)',
      hasKey: true,
      isParseable: false,
    };
  }

  return {
    isValid: true,
    hasKey: true,
    isParseable: true,
  };
}

