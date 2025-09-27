import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
