import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, adminNote } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID and status are required' },
        { status: 400 }
      );
    }

    const payment = await db.payment.update({
      where: { id: paymentId },
      data: { status, adminNote },
      include: { application: { include: { course: true, student: true } } },
    });

    return NextResponse.json({
      message: `Payment ${status} successfully`,
      payment,
    });
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: { application: { include: { course: true, student: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Admin payments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
