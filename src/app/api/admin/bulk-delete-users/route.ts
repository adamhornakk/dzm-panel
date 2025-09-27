import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return new NextResponse(JSON.stringify({ message: 'Users deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to delete users' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}