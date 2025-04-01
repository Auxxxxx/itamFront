'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { EditProfileForm } from '@/app/components/profile/EditProfileForm'
import Image from 'next/image'

interface UserProfile {
  ID: number
  Name?: string
  Email: string
  Telegram?: string | null
  PhotoURL?: string | null
  About?: string | null
  Specification?: string
  CreatedAt?: string
  UpdatedAt?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfileLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('http://45.10.41.58:8080/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Не удалось получить данные профиля')
        }

        const data = await response.json()
        console.log('Received profile data:', data)
        setProfile(data)
      } catch (err) {
        setError('Ошибка при загрузке профиля')
        console.error('Error fetching profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    if (!isLoading) {
      if (!user) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        router.push('/login')
      } else {
        fetchProfile()
      }
    }
  }, [user, isLoading, router])

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    setIsEditing(false)
  }

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
        
        {profile && (
          <>
            {isEditing ? (
              <EditProfileForm 
                user={profile} 
                onUpdate={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-6">
                  {profile.PhotoURL ? (
                    <div className="w-16 h-16 rounded-full mr-4 overflow-hidden">
                      <Image 
                        src={profile.PhotoURL} 
                        alt={profile.Name || "Аватар пользователя"} 
                        width={64} 
                        height={64} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                      {profile.Name ? profile.Name.charAt(0).toUpperCase() : (profile.Email?.charAt(0) || '?').toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{profile.Name || 'Пользователь'}</h2>
                    <p className="text-gray-600">{profile.Email}</p>
                    {profile.Specification && (
                      <p className="text-sm text-blue-600">{profile.Specification}</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Информация профиля</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Имя</p>
                      <p className="font-medium">{profile.Name || 'Не указано'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile.Email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telegram</p>
                      <p className="font-medium">{profile.Telegram || 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Специализация</p>
                      <p className="font-medium">{profile.Specification || 'Не указана'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">О себе</p>
                      <p className="font-medium">{profile.About || 'Информация отсутствует'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID пользователя</p>
                      <p className="font-medium">{profile.ID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Дата регистрации</p>
                      <p className="font-medium">{profile.CreatedAt ? new Date(profile.CreatedAt).toLocaleDateString() : 'Не указана'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}