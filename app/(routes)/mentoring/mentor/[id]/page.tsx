'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getMentor, getMentorTimes } from '@/app/lib/services/mentor-service'
import type { Mentor, MentorTime } from '@/app/lib/types/mentor'
import BookingModal from './booking-modal'

export default function MentorProfilePage() {
  const { id } = useParams()
  const mentorId = Number(id)

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [mentorTimes, setMentorTimes] = useState<MentorTime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<MentorTime | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'call' | 'chat' | null>(null)
  
  useEffect(() => {
    async function loadMentor() {
      try {
        setIsLoading(true)
        const mentorData = await getMentor(mentorId)
        setMentor(mentorData)
        
        const timesData = await getMentorTimes(mentorId)
        setMentorTimes(timesData)
        
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить данные ментора')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (mentorId) {
      loadMentor()
    }
  }, [mentorId])
  
  function handleBooking(time: MentorTime, type: 'call' | 'chat') {
    setSelectedTime(time)
    setBookingType(type)
    setIsModalOpen(true)
  }
  
  function closeModal() {
    setIsModalOpen(false)
    setSelectedTime(null)
    setBookingType(null)
  }
  
  // Filter available time slots for calls or chats
  const callTimes = mentorTimes.filter(time => time.isAvailable && time.type === 'call')
  const chatTimes = mentorTimes.filter(time => time.isAvailable && time.type === 'chat')
  
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Профиль ментора</h1>
        <Link 
          href="/mentoring/find-mentor" 
          className="text-blue-600 hover:text-blue-800"
        >
          Назад к списку
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Загрузка профиля...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
          {error}
        </div>
      ) : mentor ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
                  {mentor.avatar ? (
                    <img src={mentor.avatar} alt={`${mentor.firstName} ${mentor.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-bold">
                      {mentor.firstName[0]}{mentor.lastName[0]}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-center">{mentor.firstName} {mentor.lastName}</h2>
                <p className="text-gray-600 text-center">{mentor.email}</p>
              </div>
              
              {mentor.bio && (
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">О себе</h3>
                  <p className="text-gray-700">{mentor.bio}</p>
                </div>
              )}
              
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Специализация</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((exp, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Availability */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Забронировать звонок</h2>
              {callTimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {callTimes.map(time => (
                    <div key={time.id} className="border border-gray-200 rounded p-4">
                      <p className="font-medium mb-2">{formatDateTime(time.startTime)}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        Продолжительность: {
                          Math.round((new Date(time.endTime).getTime() - new Date(time.startTime).getTime()) / (1000 * 60))
                        } мин
                      </p>
                      <button
                        onClick={() => handleBooking(time, 'call')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Забронировать
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Нет доступных слотов для звонка.</p>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Забронировать чат</h2>
              {chatTimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chatTimes.map(time => (
                    <div key={time.id} className="border border-gray-200 rounded p-4">
                      <p className="font-medium mb-2">{formatDateTime(time.startTime)}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        Продолжительность: {
                          Math.round((new Date(time.endTime).getTime() - new Date(time.startTime).getTime()) / (1000 * 60))
                        } мин
                      </p>
                      <button
                        onClick={() => handleBooking(time, 'chat')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Забронировать
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Нет доступных слотов для чата.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600">
          Ментор не найден
        </div>
      )}
      
      {isModalOpen && selectedTime && bookingType && (
        <BookingModal
          mentorTime={selectedTime}
          mentor={mentor!}
          bookingType={bookingType}
          onClose={closeModal}
        />
      )}
    </div>
  )
} 