import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// One-time password reset endpoint
// Call with POST body: { "key": "lta-reset-2026", "newPassword": "admin123" }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, newPassword } = body;

    if (key !== 'lta-reset-2026') {
      return NextResponse.json({ error: 'Invalid reset key' }, { status: 403 });
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const admin = await db.admin.findFirst();

    if (!admin) {
      return NextResponse.json({ error: 'No admin account found' }, { status: 404 });
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
