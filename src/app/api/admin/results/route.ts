import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/results?studentId=xxx — Get all semesters & modules for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      // Return all students with their semester count
      const students = await db.student.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          gender: true,
          country: true,
          isActive: true,
          _count: { select: { semesters: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ students });
    }

    const semesters = await db.academicSemester.findMany({
      where: { studentId },
      include: { modules: { orderBy: { code: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    const student = await db.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        country: true,
        city: true,
        createdAt: true,
        enrollments: {
          include: { course: { select: { title: true, slug: true } } },
        },
      },
    });

    return NextResponse.json({ student, semesters });
  } catch (error) {
    console.error('Results GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

// POST /api/admin/results — Create a semester with modules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, name, gpa, cgpa, creditsEarned, cumulativeCredits, modules } = body;

    if (!studentId || !name) {
      return NextResponse.json({ error: 'studentId and name are required' }, { status: 400 });
    }

    const semester = await db.academicSemester.create({
      data: {
        studentId,
        name,
        gpa: gpa || 0,
        cgpa: cgpa || 0,
        creditsEarned: creditsEarned || 0,
        cumulativeCredits: cumulativeCredits || 0,
        modules: {
          create: (modules || []).map((m: { code: string; name: string; credits: number; grade: string }) => ({
            code: m.code,
            name: m.name,
            credits: m.credits || 3,
            grade: m.grade || '',
          })),
        },
      },
      include: { modules: true },
    });

    return NextResponse.json({ semester });
  } catch (error) {
    console.error('Results POST error:', error);
    return NextResponse.json({ error: 'Failed to create semester' }, { status: 500 });
  }
}

// PUT /api/admin/results — Update a semester or module
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, semesterId, moduleId, data } = body;

    if (type === 'semester' && semesterId) {
      const semester = await db.academicSemester.update({
        where: { id: semesterId },
        data: {
          name: data.name,
          gpa: data.gpa,
          cgpa: data.cgpa,
          creditsEarned: data.creditsEarned,
          cumulativeCredits: data.cumulativeCredits,
        },
      });
      return NextResponse.json({ semester });
    }

    if (type === 'module' && moduleId) {
      const mod = await db.moduleResult.update({
        where: { id: moduleId },
        data: {
          code: data.code,
          name: data.name,
          credits: data.credits,
          grade: data.grade,
        },
      });
      return NextResponse.json({ module: mod });
    }

    // Add a module to a semester
    if (type === 'addModule' && semesterId) {
      const mod = await db.moduleResult.create({
        data: {
          semesterId,
          code: data.code,
          name: data.name,
          credits: data.credits || 3,
          grade: data.grade || '',
        },
      });
      return NextResponse.json({ module: mod });
    }

    return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
  } catch (error) {
    console.error('Results PUT error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/admin/results — Delete a semester or module
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, semesterId, moduleId } = body;

    if (type === 'semester' && semesterId) {
      await db.moduleResult.deleteMany({ where: { semesterId } });
      await db.academicSemester.delete({ where: { id: semesterId } });
      return NextResponse.json({ message: 'Semester deleted' });
    }

    if (type === 'module' && moduleId) {
      await db.moduleResult.delete({ where: { id: moduleId } });
      return NextResponse.json({ message: 'Module deleted' });
    }

    return NextResponse.json({ error: 'Invalid delete type' }, { status: 400 });
  } catch (error) {
    console.error('Results DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
