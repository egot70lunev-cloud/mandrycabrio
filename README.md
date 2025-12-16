# MandryCabrio Next.js (App Router)

## Setup

### 1. Install dependencies
```bash
npm install
```
This will automatically run `prisma generate` via postinstall script.

### 2. Environment variables (`.env.local`)

Create `.env.local` in the project root with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Google Calendar Integration (Service Account)
# Use either GOOGLE_CALENDAR_ID or CALENDAR_ID (both supported)
GOOGLE_CALENDAR_ID=ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com
# OR
CALENDAR_ID=ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com

# Service Account Key - use ONE of these formats:
# Format A: JSON string (single line)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
# Format B: Base64 encoded JSON (alternative)
# GOOGLE_SERVICE_ACCOUNT_KEY_BASE64="eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii..."

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=bookings@mandrycabrio.com
ADMIN_EMAIL=egot.70.lunev@gmail.com

# WhatsApp
WHATSAPP_PHONE=34692735125
WHATSAPP_PROVIDER=
WHATSAPP_API_KEY=

# Site URL
NEXT_PUBLIC_SITE_URL=https://mandrycabrio.com
```

**Important notes:**
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Must be a valid JSON string containing the full service account credentials (use single quotes to wrap the JSON string in .env files)
- The calendar ID `ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com` must be shared with the service account email with "Make changes to events" permission.

### 3. Prisma setup

```bash
# Generate Prisma Client (runs automatically on npm install)
npx prisma generate

# Apply migrations if needed
npx prisma migrate dev
```

## Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Google Calendar Integration

### Overview
- Uses Google Service Account authentication (no user OAuth)
- Automatically creates calendar events for confirmed bookings
- Timezone: `Europe/Madrid`
- Reminders: Default Google Calendar reminders

### How it works
1. When a booking is created via `/api/booking`, a calendar event is automatically created
2. Event includes: car name, client details, pickup/dropoff locations, dates, pricing, extras
3. Event ID and HTML link are stored in the booking record
4. If calendar creation fails, the booking still succeeds (non-blocking)

### Testing

#### Test endpoint (development only)
```bash
GET http://localhost:3000/api/calendar/test
```

This creates a dummy event starting in 10 minutes, duration 30 minutes.

Response:
```json
{
  "ok": true,
  "eventId": "...",
  "htmlLink": "https://calendar.google.com/...",
  "message": "Test event created successfully"
}
```

#### Test with real booking
1. Create a booking through the booking flow
2. Check server logs for `[GOOGLE_CALENDAR]` messages
3. Verify event appears in the calendar `ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com`

### Google Calendar Setup Checklist

1. **Calendar ID**
   - Use: `ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com`
   - Set in `.env.local`: `GOOGLE_CALENDAR_ID=ac54c0be94984c70c010762c05b7529eb087eb2dd6503623aac9b1b3lfd824c6@group.calendar.google.com`

2. **Share Calendar**
   - Open Google Calendar → Settings → Share with specific people
   - Add the service account email (from `GOOGLE_SERVICE_ACCOUNT_KEY` JSON)
   - Permission: **"Make changes to events"**
   - Click "Send"

3. **Service Account Key**
   - Get the full JSON key file from Google Cloud Console
   - Set as single-line JSON string in `.env.local`: `GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'`

## Troubleshooting

### Dev Server Stops/Crashes (ERR_CONNECTION_REFUSED)

**Quick Fix:**
```bash
# Windows (PowerShell)
.\scripts\start-dev.ps1

# Or manually:
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Regenerate Prisma Client
npx prisma generate

# 3. Clean cache (if needed)
rmdir /s /q .next

# 4. Start server
npm run dev
```

**Common Causes:**
- Prisma Client not generated → Run `npx prisma generate`
- Port 3000 in use → Kill process: `taskkill /F /IM node.exe`
- Corrupted .next cache → Delete `.next` folder and restart
- Missing env vars → Check `.env.local` exists

### Prisma "did not initialize yet"
```bash
# Stop dev server, then:
npx prisma generate
npm run dev
```

**Prevention:** Prisma Client is auto-generated on `npm install` via postinstall script.

### Calendar events not created
- Check `.env.local` has all Google Calendar variables set
- Verify calendar is shared with service account email
- Check server logs for `[GOOGLE_CALENDAR]` error messages
- Test with `/api/calendar/test` endpoint

### Hydration errors
- Ensure only `src/app/layout.tsx` contains `<html>` and `<body>`
- All locale layouts (`src/app/[lang]/layout.tsx`) should only return fragments or divs

### Server Stability
- **Turbopack is disabled** - Using Webpack (`--webpack` flag) for stability
- **Prisma singleton** - Prevents multiple client instances
- **Error handling** - Calendar/DB errors don't crash the server
- **Graceful shutdown** - Prisma disconnects cleanly on exit
