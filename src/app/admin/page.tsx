import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import Header from '@/components/Header'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  // Fetch pending requests
  const pendingRequests = await prisma.userRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  })

  // Fetch all users
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Spravujte žádosti o přístup a uživatele.
            </p>
          </div>
          <AdminDashboard
            pendingRequests={pendingRequests}
            users={users}
          />
        </div>
      </main>
    </div>
  )
}