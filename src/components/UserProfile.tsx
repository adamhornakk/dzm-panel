import { User, Profile } from '@prisma/client'
import Link from 'next/link'
import { getProfileImage } from '@/lib/imageUtils'

interface UserProfileProps {
  user: User & { profile: Profile | null }
}

export default function UserProfile({ user }: UserProfileProps) {
  if (!user.profile) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profil není dostupný
          </h2>
          <p className="text-gray-600">
            Tento uživatel si zatím nenastavil účet
          </p>
        </div>
      </div>
    )
  }

  const socialLinks = [
    { name: 'Website', url: user.profile.website, icon: '🌐' },
    { name: 'LinkedIn', url: user.profile.linkedin, icon: '💼' },
    { name: 'Twitter', url: user.profile.twitter, icon: '🐦' },
    { name: 'Instagram', url: user.profile.instagram, icon: '📷' },
    { name: 'GitHub', url: user.profile.github, icon: '💻' },
  ].filter(link => link.url)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            {getProfileImage(user, 'large') ? (
              <img
                src={getProfileImage(user, 'large')}
                alt={user.name || 'User'}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-bold text-3xl">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">
              {user.name || 'Anonymous User'}
            </h1>
            <p className="text-blue-100 text-lg">{user.email}</p>
            {user.profile.location && (
              <div className="flex items-center mt-2 text-blue-100">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.profile.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {user.profile.bio && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{user.profile.bio}</p>
          </div>
        )}

        {user.profile.skills && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.split(',').map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Connect</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-gray-700 font-medium">{link.name}</span>
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {user.profile.phone && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                href={`tel:${user.profile.phone}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {user.profile.phone}
              </a>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>
    </div>
  )
}
