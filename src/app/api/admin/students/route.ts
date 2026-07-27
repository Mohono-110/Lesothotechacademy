import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        applications: { include: { course: true, payments: true } },
        enrollments: { include: { course: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Remove passwords from response
    const sanitized = students.map(({ password: _, ...student }) => student);
    return NextResponse.json({ students: sanitized });
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, isActive, isVerified } = body;

    const student = await db.student.update({
      where: { id: studentId },
      data: { ...(isActive !== undefined && { isActive }), ...(isVerified !== undefined && { isVerified }) },
    });

    const { password: _, ...studentData } = student;
    return NextResponse.json({ student: studentData, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Student update error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
