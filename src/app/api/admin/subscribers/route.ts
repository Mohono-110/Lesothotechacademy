import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/subscribers - Fetch all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const total = subscribers.length;

    // Group by month for chart data
    const monthly: Record<string, number> = {};
    subscribers.forEach((s) => {
      const month = new Date(s.createdAt).toLocaleDateString('en-GB', {
        month: 'short',
        year: '2-digit',
      });
      monthly[month] = (monthly[month] || 0) + 1;
    });

    return NextResponse.json({
      subscribers,
      total,
      monthly,
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch subscribers', details: msg }, { status: 500 });
  }
}

// DELETE /api/admin/subscribers?id=xxx - Delete a subscriber
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    await db.newsletterSubscriber.delete({ where: { id } });

    return NextResponse.json({ message: 'Subscriber deleted', deleted: true });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete subscriber', details: msg }, { status: 500 });
  }
}
