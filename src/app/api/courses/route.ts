import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
    });

    // Parse JSON strings back to objects
    const parsedCourses = courses.map(course => ({
      ...course,
      objectives: JSON.parse(course.objectives),
      modules: JSON.parse(course.modules),
    }));

    return NextResponse.json({ courses: parsedCourses });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function GET_ONE(slug: string) {
  try {
    const course = await db.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...course,
      objectives: JSON.parse(course.objectives),
      modules: JSON.parse(course.modules),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
