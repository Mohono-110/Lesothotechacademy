import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/results?studentId=xxx
// Returns student info, their enrollments (with course + courseModules), and existing semester results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      // Return all students with enrollment info
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
          enrollments: {
            include: {
              course: { select: { id: true, title: true, slug: true } },
            },
          },
          _count: { select: { semesters: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ students });
    }

    // Get student with enrollments and course modules
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
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                courseModules: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get existing semester results
    const semesters = await db.academicSemester.findMany({
      where: { studentId },
      include: { modules: { orderBy: { code: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ student, semesters });
  } catch (error) {
    console.error('Results GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

// POST /api/admin/results — Create a semester with module results
// Body: { studentId, enrollmentId?, name, gpa, cgpa, creditsEarned, cumulativeCredits, modules: [{courseModuleId?, code, name, credits, grade}] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, enrollmentId, name, gpa, cgpa, creditsEarned, cumulativeCredits, modules } = body;

    if (!studentId || !name) {
      return NextResponse.json({ error: 'studentId and name are required' }, { status: 400 });
    }

    const semester = await db.academicSemester.create({
      data: {
        studentId,
        enrollmentId: enrollmentId || null,
        name,
        gpa: gpa || 0,
        cgpa: cgpa || 0,
        creditsEarned: creditsEarned || 0,
        cumulativeCredits: cumulativeCredits || 0,
        modules: {
          create: (modules || []).map((m: { courseModuleId?: string; code: string; name: string; credits: number; grade: string }) => ({
            courseModuleId: m.courseModuleId || null,
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
          courseModuleId: data.courseModuleId || null,
          code: data.code,
          name: data.name,
          credits: data.credits || 3,
          grade: data.grade || '',
        },
      });
      return NextResponse.json({ module: mod });
    }

    // Bulk save grades for a semester (from course modules)
    if (type === 'bulkGrades' && semesterId) {
      const grades: { moduleId: string; grade: string }[] = data.grades;
      const updates = grades.map((g) =>
        db.moduleResult.update({
          where: { id: g.moduleId },
          data: { grade: g.grade },
        })
      );
      await Promise.all(updates);
      return NextResponse.json({ message: 'Grades saved' });
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
