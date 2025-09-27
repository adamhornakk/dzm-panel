import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
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

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json({ message: 'Cannot delete yourself' }, { status: 400 })
    }

    // Check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToDelete) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Delete user (this will cascade delete profile, accounts, sessions)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
