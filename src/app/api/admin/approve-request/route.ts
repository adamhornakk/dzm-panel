import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    // Set the password to "password"
    const tempPassword = "password";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: hashedPassword,
        role: 'MEMBER'
      }
    })

    // Update request status
    await prisma.userRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedBy: session.user.id,
        approvedAt: new Date()
      }
    })

    // TODO: Send email to user with temporary password
    // For now, we'll just return success

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      tempPassword // In production, this should be sent via email
    })

  } catch (error) {
    console.error('Approve request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
