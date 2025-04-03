'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { getMentors } from '@/app/lib/services/mentor-service'
import type { Mentor } from '@/app/lib/types/mentor'

export default function FindMentorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    async function loadMentors() {
      try {
        setIsLoading(true)
        const data = await getMentors()
        
        // Проверяем, что data - это массив, иначе используем пустой массив
        if (data && Array.isArray(data)) {
          setMentors(data)
        } else {
          console.error('[FindMentorPage] getMentors returned non-array data:', data)
          setMentors([])
          setError('Некорректные данные от сервера. Пожалуйста, попробуйте позже.')
        }
      } catch (err) {
        console.error('[FindMentorPage] Error loading mentors:', err)
        setMentors([]) // Устанавливаем пустой массив, чтобы избежать ошибок при фильтрации
        setError('Не удалось загрузить список менторов')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMentors()
  }, [])
  
  // Проверяем, что mentors - это массив перед вызовом filter
  const filteredMentors = Array.isArray(mentors) 
    ? mentors.filter((mentor: Mentor) => 
        mentor && 
        (mentor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         mentor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (Array.isArray(mentor.expertise) && mentor.expertise.some((exp: string) => 
           exp?.toLowerCase().includes(searchTerm.toLowerCase())
         ))
        )
      )
    : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Найти ментора</h1>
        <Link 
          href="/mentoring" 
          className="text-blue-600 hover:text-blue-800"
        >
          Назад
        </Link>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по имени или специализации..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Загрузка менторов...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
          {error}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          {searchTerm ? 'Менторы не найдены. Попробуйте изменить параметры поиска.' : 'Нет доступных менторов.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor: Mentor) => (
            <div key={mentor.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  {mentor.avatar ? (
                    <img src={mentor.avatar} alt={`${mentor.firstName} ${mentor.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-bold">
                      {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{mentor.firstName} {mentor.lastName}</h2>
                  <p className="text-gray-600">{mentor.email}</p>
                </div>
              </div>
              
              {mentor.bio && (
                <p className="text-gray-700 mb-4">{mentor.bio}</p>
              )}
              
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Специализация:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((exp: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Link 
                href={`/mentoring/mentor/${mentor.id}`} 
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Посмотреть профиль
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 