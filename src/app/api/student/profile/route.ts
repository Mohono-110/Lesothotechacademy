import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      country,
      bio,
      password,
      confirmPassword,
    } = body;

    // Validation: id is required
    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existing = await db.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Password validation
    let hashedPassword: string | undefined;
    if (password || confirmPassword) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: 'Password and confirm password do not match' },
          { status: 400 }
        );
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Email uniqueness check
    if (email && email !== existing.email) {
      const emailTaken = await db.student.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json(
          { error: 'This email is already taken by another student' },
          { status: 400 }
        );
      }
    }

    // Build update data with only provided fields
    const updateData: Record<string, string> = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (hashedPassword !== undefined) updateData.password = hashedPassword;

    // Update student
    const updated = await db.student.update({
      where: { id },
      data: updateData,
    });

    // Return updated student without password
    const { password: _, ...studentWithoutPassword } = updated;

    return NextResponse.json({
      message: 'Profile updated successfully',
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
