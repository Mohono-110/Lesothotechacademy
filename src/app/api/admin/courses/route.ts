import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const parsedCourses = courses.map(course => ({
      ...course,
      objectives: JSON.parse(course.objectives),
      modules: JSON.parse(course.modules),
    }));

    return NextResponse.json({ courses: parsedCourses });
  } catch (error) {
    console.error('Admin courses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, isPublished } = body;

    const course = await db.course.update({
      where: { id: courseId },
      data: { isPublished },
    });

    return NextResponse.json({ course, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Course update error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}
