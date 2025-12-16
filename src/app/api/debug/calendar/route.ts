import { NextResponse } from 'next/server';
import { env, validateGoogleServiceAccountKey, loadServiceAccountKey } from '@/lib/env';
import { getCalendarClient } from '@/lib/googleAuth';

/**
 * Debug endpoint to verify Google Calendar writes
 * GET /api/debug/calendar
 * 
 * Creates a test event in the configured calendar to verify integration works
 */
export async function GET() {
  const calendarIdUsed = env.googleCalendarId;

  // Check configuration
  if (!calendarIdUsed) {
    return NextResponse.json(
      {
        ok: false,
        calendarIdUsed: null,
        errorMessage: 'GOOGLE_CALENDAR_ID not configured',
        errorCode: 'MISSING_CALENDAR_ID',
        errorDetails: null,
      },
      { status: 400 }
    );
  }

  // Validate service account key with detailed feedback
  const keyValidation = validateGoogleServiceAccountKey();
  if (!keyValidation.isValid) {
    console.error('[DEBUG_CALENDAR] Service account key validation failed:', keyValidation.error);
    console.error('[DEBUG_CALENDAR] Has key:', keyValidation.hasKey);
    console.error('[DEBUG_CALENDAR] Is parseable:', keyValidation.isParseable);
    console.error('[DEBUG_CALENDAR] Raw env value length:', env.googleServiceAccountKey?.length || 0);
    console.error('[DEBUG_CALENDAR] Raw env value preview:', env.googleServiceAccountKey?.substring(0, 50) || 'empty');
    console.error('[DEBUG_CALENDAR] process.env.GOOGLE_SERVICE_ACCOUNT_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    console.error('[DEBUG_CALENDAR] process.env.GOOGLE_SERVICE_ACCOUNT_KEY length:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0);

    return NextResponse.json(
      {
        ok: false,
        calendarIdUsed,
        errorMessage: keyValidation.error || 'GOOGLE_SERVICE_ACCOUNT_KEY not configured',
        errorCode: keyValidation.hasKey 
          ? (keyValidation.isParseable ? 'INVALID_SERVICE_ACCOUNT_KEY' : 'INVALID_JSON_FORMAT')
          : 'MISSING_SERVICE_ACCOUNT_KEY',
        errorDetails: {
          hasKey: keyValidation.hasKey,
          isParseable: keyValidation.isParseable,
          keyLength: env.googleServiceAccountKey?.length || 0,
          keyPreview: env.googleServiceAccountKey?.substring(0, 100) || 'empty',
          help: 'Set GOOGLE_SERVICE_ACCOUNT_KEY in .env.local as a JSON string. Example: GOOGLE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account","client_email":"...","private_key":"..."}\'',
        },
      },
      { status: 400 }
    );
  }

  try {
    // Load service account key
    const serviceAccount = loadServiceAccountKey();
    if (!serviceAccount) {
      return NextResponse.json(
        {
          ok: false,
          calendarIdUsed,
          errorMessage: 'Failed to load service account key',
          errorCode: 'INVALID_SERVICE_ACCOUNT_KEY',
          errorDetails: {
            help: 'Check that GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is set correctly in .env.local',
          },
        },
        { status: 400 }
      );
    }

    // Get calendar client using helper
    const calendar = getCalendarClient();
    if (!calendar) {
      return NextResponse.json(
        {
          ok: false,
          calendarIdUsed,
          errorMessage: 'Failed to initialize Google Calendar client',
          errorCode: 'CALENDAR_CLIENT_INIT_FAILED',
          errorDetails: {
            serviceAccountEmail: serviceAccount.client_email,
          },
        },
        { status: 500 }
      );
    }

    // Test calendar access by getting calendar details
    console.log('[DEBUG_CALENDAR] Testing calendar access for:', calendarIdUsed);
    let calendarInfo;
    try {
      calendarInfo = await calendar.calendars.get({
        calendarId: calendarIdUsed,
      });
      console.log('[DEBUG_CALENDAR] Calendar access verified:', {
        calendarId: calendarInfo.data.id,
        summary: calendarInfo.data.summary,
        timeZone: calendarInfo.data.timeZone,
      });
    } catch (calendarAccessError) {
      console.error('[DEBUG_CALENDAR] Failed to access calendar:', calendarAccessError);
      
      let errorMessage = 'Unknown error';
      let errorCode = 'CALENDAR_ACCESS_FAILED';
      let errorDetails: unknown = null;

      if (calendarAccessError instanceof Error) {
        errorMessage = calendarAccessError.message;
      }

      if (calendarAccessError && typeof calendarAccessError === 'object' && 'response' in calendarAccessError) {
        const gError = calendarAccessError as { response?: { data?: unknown; status?: number; statusText?: string } };
        errorCode = `GOOGLE_API_${gError.response?.status || 'UNKNOWN'}`;
        errorDetails = {
          status: gError.response?.status,
          statusText: gError.response?.statusText,
          data: gError.response?.data,
        };
        
        // Provide helpful error messages for common issues
        if (gError.response?.status === 403) {
          errorMessage = 'Permission denied. Make sure the calendar is shared with the service account email with "Make changes to events" permission.';
        } else if (gError.response?.status === 404) {
          errorMessage = 'Calendar not found. Check that CALENDAR_ID is correct.';
        }
      }

      return NextResponse.json(
        {
          ok: false,
          calendarIdUsed,
          errorMessage,
          errorCode,
          errorDetails: {
            ...errorDetails,
            serviceAccountEmail: serviceAccount.client_email,
          },
        },
        { status: 500 }
      );
    }

    // Create test event (start: now+5min, end: now+35min)
    const now = new Date();
    const startDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    const endDate = new Date(now.getTime() + 35 * 60 * 1000); // 35 minutes from now

    const event = {
      summary: 'TEST – MandryCabrio Calendar',
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Madrid',
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarIdUsed,
      requestBody: event,
    });

    const eventId = response.data.id;
    const htmlLink = response.data.htmlLink;

    console.log('[DEBUG_CALENDAR] Test event created successfully:', {
      calendarId: calendarIdUsed,
      eventId,
      htmlLink,
      serviceAccountEmail: serviceAccount.client_email,
    });

    return NextResponse.json({
      ok: true,
      calendarIdUsed,
      serviceAccountEmail: serviceAccount.client_email,
      hasKey: true,
      eventId: eventId || null,
      htmlLink: htmlLink || null,
    });
  } catch (error) {
    // Log full error
    console.error('[DEBUG_CALENDAR] Error creating test event:', error);

    let errorMessage = 'Unknown error';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails: unknown = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorCode = error.name;
      errorDetails = error.stack;
    }

    // Extract Google API error details if available
    if (error && typeof error === 'object' && 'response' in error) {
      const gError = error as { response?: { data?: unknown; status?: number; statusText?: string } };
      errorCode = `GOOGLE_API_${gError.response?.status || 'UNKNOWN'}`;
      errorDetails = {
        status: gError.response?.status,
        statusText: gError.response?.statusText,
        data: gError.response?.data,
      };
      console.error('[DEBUG_CALENDAR] Google API error details:', errorDetails);
    }

    return NextResponse.json(
      {
        ok: false,
        calendarIdUsed,
        errorMessage,
        errorCode,
        errorDetails,
      },
      { status: 500 }
    );
  }
}
