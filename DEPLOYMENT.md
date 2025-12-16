# Deployment Instructions

## GitHub Repository Setup

The project is ready to be pushed to GitHub. To create the repository and push:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `mandrycabrio-v1`
   - Description: "MandryCabrio - Premium car rental website (Next.js)"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push the code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mandrycabrio-v1.git
   git push -u origin main
   ```

## Vercel Deployment

### Prerequisites
- GitHub repository created and code pushed
- Vercel account (sign up at https://vercel.com)

### Deployment Steps

1. **Import Project:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `mandrycabrio-v1` repository
   - Click "Import"

2. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

3. **Environment Variables:**
   Add the following environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your database connection string
   - `NEXT_PUBLIC_SITE_URL` - Your Vercel preview URL (e.g., `https://mandrycabrio-v1.vercel.app`)
   - `ADMIN_PASSWORD` - Password for admin routes
   - `RESEND_API_KEY` - Email service API key (if using Resend)
   - `GOOGLE_SERVICE_ACCOUNT_JSON` - Google Calendar service account JSON (if using)
   - Any other environment variables your app needs

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be available at `https://mandrycabrio-v1-*.vercel.app`

### Build Status

✅ **Build passes locally** - `npm run build` completes successfully

### Known Issues

- Booking pages require Suspense boundaries (already implemented)
- Some pages are dynamic and cannot be statically generated (expected behavior)

### Post-Deployment

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to match your production domain
2. Set up database (Prisma migrations will run automatically on first deploy)
3. Test all routes: `/en`, `/es`, `/de`, `/ru`, `/uk`
4. Verify API routes are working
5. Check admin routes are protected

## Notes

- The project uses Next.js 16 with App Router
- All locale routes (`/en`, `/es`, `/de`, `/ru`, `/uk`) are functional
- Database migrations run automatically via Prisma
- Static assets are served from `/public` directory


