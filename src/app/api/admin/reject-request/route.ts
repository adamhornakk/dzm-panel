import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ message: 'Request ID is required' }, { status: 400 })
    }

    // Get the request
    const userRequest = await prisma.userRequest.findUnique({
      where: { id: requestId }
    })

    if (!userRequest) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    if (userRequest.status !== 'PENDING') {
      return NextResponse.json({ message: 'Request already processed' }, { status: 400 })
    }

    // Update request status
    await prisma.userRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvedBy: session.user.id,
        approvedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Request rejected successfully'
    })

  } catch (error) {
    console.error('Reject request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
