import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Approve or reject application and enroll student
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, adminNote } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Update application status
    const application = await db.application.update({
      where: { id: applicationId },
      data: { status },
      include: { student: true, course: true, payments: true },
    });

    // If approved, create enrollment
    if (status === 'enrolled') {
      const existingEnrollment = await db.enrollment.findFirst({
        where: { applicationId },
      });

      if (!existingEnrollment) {
        await db.enrollment.create({
          data: {
            studentId: application.studentId,
            courseId: application.courseId,
            applicationId: application.id,
            status: 'active',
            progress: 0,
          },
        });

        // Verify student
        await db.student.update({
          where: { id: application.studentId },
          data: { isVerified: true },
        });
      }
    }

    return NextResponse.json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await db.application.findMany({
      include: { student: true, course: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Admin applications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
