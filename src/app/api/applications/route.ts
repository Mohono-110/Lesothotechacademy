import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId, motivationalLetter, educationLevel, experience } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existing = await db.application.findFirst({
      where: { studentId, courseId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied for this course' },
        { status: 409 }
      );
    }

    // Create application
    const application = await db.application.create({
      data: {
        studentId,
        courseId,
        motivationalLetter,
        educationLevel,
        experience,
      },
      include: {
        course: true,
        student: true,
      },
    });

    return NextResponse.json({
      message: 'Application submitted successfully! Please proceed to make the M300 registration payment.',
      application,
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (studentId) {
      const applications = await db.application.findMany({
        where: { studentId },
        include: { course: true, payments: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ applications });
    }

    // Return all applications (for admin)
    const applications = await db.application.findMany({
      include: { course: true, student: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
