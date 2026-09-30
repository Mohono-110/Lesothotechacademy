import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/course-modules?courseId=xxx — Get modules for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      // Return all courses with their module count
      const courses = await db.course.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          _count: { select: { courseModules: true } },
        },
        orderBy: { title: 'asc' },
      });
      return NextResponse.json({ courses });
    }

    const modules = await db.courseModule.findMany({
      where: { courseId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ modules });
  } catch (error) {
    console.error('CourseModules GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

// POST /api/admin/course-modules — Add a module to a course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, code, name, credits, sortOrder } = body;

    if (!courseId || !code || !name) {
      return NextResponse.json({ error: 'courseId, code, and name are required' }, { status: 400 });
    }

    const mod = await db.courseModule.create({
      data: {
        courseId,
        code,
        name,
        credits: credits || 3,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ module: mod });
  } catch (error) {
    console.error('CourseModules POST error:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

// PUT /api/admin/course-modules — Update a module
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, data } = body;

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
    }

    const mod = await db.courseModule.update({
      where: { id: moduleId },
      data: {
        code: data.code,
        name: data.name,
        credits: data.credits,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json({ module: mod });
  } catch (error) {
    console.error('CourseModules PUT error:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

// DELETE /api/admin/course-modules — Delete a module
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId } = body;

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
    }

    await db.courseModule.delete({ where: { id: moduleId } });
    return NextResponse.json({ message: 'Module deleted' });
  } catch (error) {
    console.error('CourseModules DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
