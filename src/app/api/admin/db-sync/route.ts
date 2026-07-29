import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Safe schema sync endpoint for production (Neon PostgreSQL)
// Adds missing tables/columns without needing prisma db push
export async function GET() {
  try {
    const results: Record<string, boolean> = {};

    // 1. Add profileImage column to Admin if missing
    const profileImageCol = await db.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Admin' AND column_name = 'profileImage'
    `;
    if (profileImageCol.length === 0) {
      await db.$executeRaw`ALTER TABLE "Admin" ADD COLUMN "profileImage" TEXT`;
      results.addedProfileImage = true;
    }

    // 2. Create NewsletterSubscriber table if missing
    const subscriberTable = await db.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE tablename = 'NewsletterSubscriber'
    `;
    if (subscriberTable.length === 0) {
      await db.$executeRaw`
        CREATE TABLE "NewsletterSubscriber" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "NewsletterSubscriber_email_key" UNIQUE("email")
        )
      `;
      results.createdNewsletterSubscriber = true;
    }

    return NextResponse.json({
      message: 'Database synced successfully',
      synced: true,
      changes: results,
    });
  } catch (error) {
    console.error('DB sync error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to sync database', details: msg }, { status: 500 });
  }
}
