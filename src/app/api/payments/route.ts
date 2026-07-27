import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationId = formData.get('applicationId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const paymentMethod = formData.get('paymentMethod') as string;
    const transactionRef = formData.get('transactionRef') as string;
    const screenshot = formData.get('screenshot') as File | null;

    if (!applicationId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Application ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    let screenshotUrl = '';

    if (screenshot) {
      const bytes = await screenshot.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${applicationId}_${Date.now()}_${screenshot.name}`;
      const filepath = path.join(process.cwd(), 'upload', 'screenshots', filename);
      await writeFile(filepath, buffer);
      screenshotUrl = `/screenshots/${filename}`;
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        applicationId,
        amount,
        currency: 'M',
        paymentMethod,
        transactionRef,
        screenshotUrl,
        status: 'pending',
      },
    });

    return NextResponse.json({
      message: 'Payment proof submitted successfully! Your payment is being reviewed by our admin team.',
      payment,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    const where = applicationId ? { applicationId } : {};
    const payments = await db.payment.findMany({
      where,
      include: { application: { include: { course: true, student: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
