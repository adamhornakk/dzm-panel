import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        bio: data.bio,
        skills: data.skills,
        location: data.location,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        instagram: data.instagram,
        github: data.github,
        phone: data.phone,
        profileImage: data.profileImage,
        isPublic: data.isPublic,
      },
      create: {
        userId: session.user.id,
        bio: data.bio,
        skills: data.skills,
        location: data.location,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        instagram: data.instagram,
        github: data.github,
        phone: data.phone,
        profileImage: data.profileImage,
        isPublic: data.isPublic,
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
