# PowerShell script to start Next.js dev server cleanly on Windows
# Usage: .\scripts\start-dev.ps1

Write-Host "=== Starting Next.js Dev Server ===" -ForegroundColor Cyan

# Step 1: Stop any running Node processes
Write-Host "`n[1/5] Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Check Prisma Client
Write-Host "[2/5] Checking Prisma Client..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\.prisma\client\index.js")) {
    Write-Host "  Prisma Client not found. Generating..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
}

# Step 3: Clean .next directory (optional, uncomment if needed)
# Write-Host "[3/5] Cleaning .next directory..." -ForegroundColor Yellow
# if (Test-Path ".next") {
#     Remove-Item -Recurse -Force .next
#     Write-Host "  .next directory removed" -ForegroundColor Green
# }

# Step 4: Verify environment
Write-Host "[3/5] Checking environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local") -and -not (Test-Path ".env")) {
    Write-Host "  WARNING: No .env.local or .env file found" -ForegroundColor Yellow
}

# Step 5: Start dev server
Write-Host "[4/5] Starting Next.js dev server..." -ForegroundColor Yellow
Write-Host "  Server will start on http://localhost:3000" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop`n" -ForegroundColor Gray

npm run dev
