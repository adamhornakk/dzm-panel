'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Profile } from '@prisma/client'
import { getProfileImage } from '@/lib/imageUtils'

interface UserWithProfile extends User {
  profile: Profile | null
}

export default function CommunityDirectory() {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    if (!user.profile?.isPublic) return false
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.profile?.skills?.toLowerCase().includes(searchLower) ||
      user.profile?.location?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, skills, or location..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                {getProfileImage(user, 'small') ? (
                  <img
                    src={getProfileImage(user, 'small')}
                    alt={user.name || 'User'}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-blue-600 font-semibold text-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name || 'Anonymous User'}
                </h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>

            {user.profile && (
              <div className="space-y-2">
                {user.profile.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {user.profile.bio}
                  </p>
                )}
                
                {user.profile.skills && (
                  <div className="flex flex-wrap gap-1">
                    {user.profile.skills.split(',').slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {user.profile.skills.split(',').length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{user.profile.skills.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {user.profile.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.profile.location}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              {user.profile?.linkedin && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(user.profile?.linkedin, '_blank', 'noopener,noreferrer')
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              )}
              {user.profile?.twitter && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(user.profile?.twitter, '_blank', 'noopener,noreferrer')
                  }}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
              )}
              {user.profile?.github && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (user.profile?.github) window.open(user.profile.github, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nebyli nalezeni žádní členové komunity</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Zkuste upravit hledané výrazy.' : 'Buďte první, kdo se připojí ke komunitě!'}
          </p>
        </div>
      )}
    </div>
  )
}
