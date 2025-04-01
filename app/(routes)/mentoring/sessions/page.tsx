'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserReservations, getMentorReservations } from '@/app/lib/services/mentor-service'
import type { MentorTimeReservation } from '@/app/lib/types/mentor'

export default function MentorSessionsPage() {
  const [activeTab, setActiveTab] = useState<'mentee' | 'mentor'>('mentee')
  const [reservations, setReservations] = useState<MentorTimeReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Mock userId - in a real app, this would come from auth
  const userId = 1
  
  useEffect(() => {
    async function loadReservations() {
      try {
        setIsLoading(true)
        
        if (activeTab === 'mentee') {
          const data = await getUserReservations(userId)
          setReservations(data)
        } else {
          const data = await getMentorReservations(userId)
          setReservations(data)
        }
        
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить список сессий')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadReservations()
  }, [activeTab])
  
  // Format date for display
  function formatDateTime(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Get status label and color based on status
  function getStatusDetails(status: string) {
    switch(status) {
      case 'pending':
        return { label: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-800' }
      case 'confirmed':
        return { label: 'Подтверждено', color: 'bg-green-100 text-green-800' }
      case 'cancelled':
        return { label: 'Отменено', color: 'bg-red-100 text-red-800' }
      case 'completed':
        return { label: 'Завершено', color: 'bg-blue-100 text-blue-800' }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' }
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Менторские сессии</h1>
        <Link 
          href="/mentoring" 
          className="text-blue-600 hover:text-blue-800"
        >
          Назад
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 ${activeTab === 'mentee' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('mentee')}
          >
            Я - Менти
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'mentor' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('mentor')}
          >
            Я - Ментор
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Загрузка сессий...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            {activeTab === 'mentee' 
              ? 'У вас пока нет забронированных сессий с менторами. Найдите ментора и забронируйте время.'
              : 'У вас пока нет забронированных сессий в качестве ментора.'}
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map(reservation => (
              <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{reservation.topic || 'Без темы'}</h3>
                    <p className="text-gray-600">{formatDateTime(reservation.created)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusDetails(reservation.status).color} inline-block mt-2 md:mt-0`}>
                    {getStatusDetails(reservation.status).label}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {reservation.status === 'confirmed' && (
                    <>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Подключиться к сессии
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                        Отменить
                      </button>
                    </>
                  )}
                  
                  {reservation.status === 'pending' && activeTab === 'mentor' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Подтвердить
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors">
                        Отклонить
                      </button>
                    </>
                  )}
                  
                  {reservation.status === 'pending' && activeTab === 'mentee' && (
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors">
                      Отменить
                    </button>
                  )}
                  
                  {reservation.status === 'completed' && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                      Оставить отзыв
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 