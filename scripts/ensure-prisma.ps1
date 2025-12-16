# PowerShell script to ensure Prisma Client is generated before starting dev server
# Usage: .\scripts\ensure-prisma.ps1

$prismaClientPath = "node_modules\.prisma\client\index.js"

if (-not (Test-Path $prismaClientPath)) {
    Write-Host "Prisma Client not found. Generating..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
    Write-Host "Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "Prisma Client found" -ForegroundColor Green
}
