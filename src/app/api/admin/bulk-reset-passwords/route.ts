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
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Missing user IDs' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    await prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        password: hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify({ message: 'Passwords reset successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Bulk password reset error:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to reset passwords' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}