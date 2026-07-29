import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, name, email, currentPassword, newPassword } = body;

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Find the admin
    const existingAdmin = await db.admin.findUnique({ where: { id: adminId } });
    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, string> = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.trim()) {
      // Check if email is taken by another admin
      if (email.trim() !== existingAdmin.email) {
        const emailTaken = await db.admin.findFirst({ where: { email: email.trim(), id: { not: adminId } } });
        if (emailTaken) {
          return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
        }
      }
      updateData.email = email.trim();
    }

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const isValid = await bcrypt.compare(currentPassword, existingAdmin.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const updatedAdmin = await db.admin.update({
      where: { id: adminId },
      data: updateData,
    });

    // Return without password
    const { password: _, ...adminData } = updatedAdmin;

    return NextResponse.json({
      admin: adminData,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
