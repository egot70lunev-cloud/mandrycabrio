/**
 * Google Calendar API authentication helpers (server-only)
 * Provides JWT authentication and calendar client initialization
 */

import { google } from 'googleapis';
import { loadServiceAccountKey } from './env';
import type { JWT } from 'google-auth-library';
import type { calendar_v3 } from 'googleapis';

export type GoogleAuth = JWT;
export type CalendarClient = calendar_v3.Calendar;

/**
 * Get Google JWT authentication instance
 * Uses Service Account credentials from environment
 * 
 * @returns JWT auth instance or null if credentials are invalid
 */
export function getGoogleAuth(): GoogleAuth | null {
  const serviceAccount = loadServiceAccountKey();
  
  if (!serviceAccount) {
    console.error('[GOOGLE_AUTH] Failed to load service account key');
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    console.log('[GOOGLE_AUTH] JWT auth initialized for:', serviceAccount.client_email);
    return auth;
  } catch (error) {
    console.error('[GOOGLE_AUTH] Failed to initialize JWT auth:', error);
    return null;
  }
}

/**
 * Get Google Calendar API client
 * Initializes calendar client with JWT authentication
 * 
 * @returns Calendar client instance or null if auth fails
 */
export function getCalendarClient(): CalendarClient | null {
  const auth = getGoogleAuth();
  
  if (!auth) {
    return null;
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('[GOOGLE_AUTH] Calendar client initialized');
    return calendar;
  } catch (error) {
    console.error('[GOOGLE_AUTH] Failed to initialize calendar client:', error);
    return null;
  }
}
