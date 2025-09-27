import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return new NextResponse(JSON.stringify({ message: 'Missing old or new password' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!user.password) {
      return new NextResponse(JSON.stringify({ message: 'User has no password set' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return new NextResponse(JSON.stringify({ message: 'Invalid old password' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return new NextResponse(JSON.stringify({ message: 'Password updated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    console.error('Password update error:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to update password' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}