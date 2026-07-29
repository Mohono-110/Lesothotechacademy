import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({
        message: 'You are already subscribed!',
        subscribed: true,
      });
    }

    // Create subscriber
    await db.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    });

    return NextResponse.json({
      message: 'Successfully subscribed!',
      subscribed: true,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to subscribe', details: msg }, { status: 500 });
  }
}
