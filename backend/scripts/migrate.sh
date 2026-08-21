#!/bin/sh
# Resilient database migration / schema sync for Railway & Neon / Postgres

echo "=== [Database Sync] Running Prisma migration ==="

# Attempt 1: Standard migrate deploy
if npx prisma migrate deploy; then
  echo "=== [Database Sync] Migrations applied successfully via migrate deploy ==="
  exit 0
fi

echo "=== [Database Sync] migrate deploy encountered an issue, falling back to db push ==="

# Attempt 2: Schema push fallback (handles drift/locks gracefully)
if npx prisma db push --skip-generate; then
  echo "=== [Database Sync] Database schema synchronized successfully via db push ==="
  exit 0
fi

echo "=== [Database Sync] ERROR: All database sync attempts failed ===" >&2
exit 1
