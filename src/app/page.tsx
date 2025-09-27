import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CommunityDirectory from '@/components/CommunityDirectory'
import Header from '@/components/Header'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
        </div>
        <CommunityDirectory />
      </main>
    </div>
  )
}