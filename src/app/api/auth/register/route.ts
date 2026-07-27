import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, address } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existing = await db.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await db.student.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        address,
      },
    });

    // Return student without password
    const { password: _, ...studentWithoutPassword } = student;

    return NextResponse.json({
      message: 'Registration successful! Welcome to Lesotho Tech Academy.',
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
