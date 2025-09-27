import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ message: 'User ID and role are required' }, { status: 400 })
    }

    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return NextResponse.json({ message: 'Cannot change your own role' }, { status: 400 })
    }

    // Check if user exists
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToUpdate) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    return NextResponse.json({
      message: 'User role updated successfully'
    })

  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
