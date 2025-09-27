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
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'User with this email already exists' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'MEMBER',
      },
    });

    return new NextResponse(JSON.stringify({ message: 'User created successfully', user: newUser }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    console.error('User creation error:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}