import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find student
    const student = await db.student.findUnique({ where: { email } });
    
    if (student && student.isActive) {
      const isValid = await bcrypt.compare(password, student.password);
      if (isValid) {
        const { password: _, ...studentData } = student;
        return NextResponse.json({
          message: 'Login successful',
          user: studentData,
          role: 'student',
        });
      }
    }

    // Check admin
    const admin = await db.admin.findUnique({ where: { email } });
    if (admin) {
      const isValid = await bcrypt.compare(password, admin.password);
      if (isValid) {
        return NextResponse.json({
          message: 'Admin login successful',
          user: admin,
          role: 'admin',
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
