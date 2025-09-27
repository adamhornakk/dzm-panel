import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UserProfile from '@/components/UserProfile'
import Header from '@/components/Header'

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  })

  if (!user || !user.profile?.isPublic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <UserProfile user={user} />
        </div>
      </main>
    </div>
  )
}
