import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function formatMonth(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(formatMonth(d));
  }
  return months;
}

function groupByMonth<T extends { createdAt: Date }>(
  records: T[],
  allMonths: string[]
): { month: string; count: number }[] {
  const counts: Record<string, number> = {};
  allMonths.forEach((m) => (counts[m] = 0));
  records.forEach((r) => {
    const key = formatMonth(r.createdAt);
    if (key in counts) {
      counts[key]++;
    }
  });
  return allMonths.map((month) => ({ month, count: counts[month] }));
}

export async function GET() {
  try {
    const last6 = getLast6Months();

    const [
      totalStudents,
      totalApplications,
      totalMessages,
      unreadMessages,
      revenueResult,
      activeEnrollments,
      allStudents,
      allApplications,
      allMessages,
      recentStudents,
      recentMessages,
      recentApplications,
      courses,
    ] = await Promise.all([
      db.student.count(),
      db.application.count(),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { isRead: false } }),
      db.payment.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true },
      }),
      db.enrollment.count({ where: { status: 'active' } }),
      db.student.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      db.application.findMany({
        select: { createdAt: true, status: true, course: { select: { title: true } } },
      }),
      db.contactMessage.findMany({
        select: { createdAt: true },
      }),
      db.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      db.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      db.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, firstName: true, lastName: true, email: true } },
          course: { select: { id: true, title: true } },
        },
      }),
      db.course.findMany({
        include: {
          _count: { select: { applications: true, enrollments: true } },
        },
      }),
    ]);

    // Group applications by status
    const statusCounts: Record<string, number> = {};
    allApplications.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });
    const applicationsByStatus = Object.entries(statusCounts).map(
      ([status, count]) => ({ status, count })
    );

    // Group applications by course
    const courseCounts: Record<string, number> = {};
    allApplications.forEach((a) => {
      const title = a.course.title;
      courseCounts[title] = (courseCounts[title] || 0) + 1;
    });
    const applicationsByCourse = Object.entries(courseCounts).map(
      ([courseTitle, count]) => ({ courseTitle, count })
    );

    // Revenue per course
    const courseRevenueMap: Record<string, number> = {};
    const approvedPayments = await db.payment.findMany({
      where: { status: 'approved' },
      include: { application: { include: { course: { select: { title: true } } } } },
    });
    approvedPayments.forEach((p) => {
      const title = p.application.course.title;
      courseRevenueMap[title] = (courseRevenueMap[title] || 0) + p.amount;
    });

    const courseStats = courses.map((c) => ({
      title: c.title,
      totalApplications: c._count.applications,
      totalEnrolled: c._count.enrollments,
      revenue: courseRevenueMap[c.title] || 0,
    }));

    // Remove passwords from recent students
    const sanitizedRecentStudents = recentStudents.map(
      ({ password: _, ...student }) => student
    );

    return NextResponse.json({
      totalStudents,
      totalApplications,
      totalMessages,
      unreadMessages,
      totalRevenue: revenueResult._sum.amount || 0,
      activeEnrollments,
      studentsByMonth: groupByMonth(allStudents, last6),
      applicationsByStatus,
      applicationsByCourse,
      messagesByMonth: groupByMonth(allMessages, last6),
      recentStudents: sanitizedRecentStudents,
      recentMessages,
      recentApplications,
      courseStats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
