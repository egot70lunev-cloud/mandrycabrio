#!/bin/bash
# Bash script to start Next.js dev server cleanly on Unix/Mac
# Usage: ./scripts/start-dev.sh

echo "=== Starting Next.js Dev Server ==="

# Step 1: Stop any running Node processes
echo ""
echo "[1/5] Stopping existing Node processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Step 2: Check Prisma Client
echo "[2/5] Checking Prisma Client..."
if [ ! -f "node_modules/.prisma/client/index.js" ]; then
    echo "  Prisma Client not found. Generating..."
    npx prisma generate
    if [ $? -ne 0 ]; then
        echo "  ERROR: Failed to generate Prisma Client"
        exit 1
    fi
fi

# Step 3: Clean .next directory (optional, uncomment if needed)
# echo "[3/5] Cleaning .next directory..."
# rm -rf .next

# Step 4: Verify environment
echo "[3/5] Checking environment..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "  WARNING: No .env.local or .env file found"
fi

# Step 5: Start dev server
echo "[4/5] Starting Next.js dev server..."
echo "  Server will start on http://localhost:3000"
echo "  Press Ctrl+C to stop"
echo ""

npm run dev
