import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'Missing user ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return new NextResponse(JSON.stringify({ message: 'Password reset successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to reset password' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}