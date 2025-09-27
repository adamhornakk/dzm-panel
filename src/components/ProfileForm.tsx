'use client'

import { useState } from 'react'
import { User, Profile } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { getOptimizedImageUrl } from '@/lib/imageUtils'

interface ProfileFormProps {
  user: User & { profile: Profile | null }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    bio: user.profile?.bio || '',
    skills: user.profile?.skills || '',
    location: user.profile?.location || '',
    website: user.profile?.website || '',
    linkedin: user.profile?.linkedin || '',
    twitter: user.profile?.twitter || '',
    instagram: user.profile?.instagram || '',
    github: user.profile?.github || '',
    phone: user.profile?.phone || '',
    profileImage: user.profile?.profileImage || '',
    isPublic: user.profile?.isPublic ?? true,
  })
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Nové heslo a potvrzení hesla se neshodují.');
      return;
    }

    setIsPasswordLoading(true);
    setPasswordMessage('');

    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setPasswordMessage('Heslo bylo úspěšně aktualizováno!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.json();
        setPasswordMessage(error.message || 'Aktualizace hesla se nezdařila. Zkuste to prosím znovu.');
      }
    } catch (error) {
      setPasswordMessage('Něco se pokazilo. Zkuste to prosím znovu.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          profileImage: data.url
        }))
        setMessage('Profilový obrázek byl úspěšně aktualizován!')
      } else {
        const error = await response.json()
        setMessage(error.message || 'Nahrání obrázku se nezdařilo')
      }
    } catch (error) {
      setMessage('Nahrání obrázku se nezdařilo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Profil byl úspěšně aktualizován!')
        router.refresh()
      } else {
        setMessage('Aktualizace profilu se nezdařila. Zkuste to prosím znovu.')
      }
    } catch (error) {
      setMessage('Něco se pokazilo. Zkuste to prosím znovu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('úspěšně') 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Picture Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profilový obrázek
          </label>
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={getOptimizedImageUrl(formData.profileImage, 'medium')}
                  alt="Profile"
                  className="h-20 w-20 object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG nebo GIF. Maximální velikost 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Celé jméno
            </label>
            <input
              type="text"
              id="name"
              value={user.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Jméno nelze změnit</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email nelze změnit</p>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Řekněte nám něco o sobě..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Dovednosti
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="např. React, Node.js, Design, Marketing"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Oddělte dovednosti čárkami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Město
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Město"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+420 608 123 456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Webová stránka
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
              X (Twitter)
            </label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://x.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub
            </label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Zveřejnit můj profil komunitě
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ukládání...' : 'Uložit profil'}
          </button>
        </div>
      </form>
      {/* Password Change Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Změnit heslo</h3>
        {passwordMessage && (
          <div className={`p-4 rounded-md ${
            passwordMessage.includes('úspěšně')
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {passwordMessage}
          </div>
        )}
        <form className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Staré heslo
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nové heslo
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Potvrdit nové heslo
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isPasswordLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasswordLoading ? 'Měním...' : 'Změnit heslo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
