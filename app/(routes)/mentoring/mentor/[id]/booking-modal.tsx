'use client'

import { useState } from 'react'
import type { Mentor, MentorTime } from '@/app/lib/types/mentor'
import { reserveMentorTime } from '@/app/lib/services/mentor-service'

interface BookingModalProps {
  mentorTime: MentorTime
  mentor: Mentor
  bookingType: 'call' | 'chat'
  onClose: () => void
}

export default function BookingModal({ mentorTime, mentor, bookingType, onClose }: BookingModalProps) {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!topic.trim()) {
      setError('Пожалуйста, укажите тему сессии')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      await reserveMentorTime({
        mentorTimeId: mentorTime.id,
        menteeId: 1, // In a real app, this would be the current user's ID
        status: 'pending',
        topic
      })
      
      setIsSuccess(true)
    } catch (err) {
      setError('Не удалось забронировать время. Пожалуйста, попробуйте позже.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Бронирование {bookingType === 'call' ? 'звонка' : 'чата'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isSuccess ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Бронирование успешно!</h3>
              <p className="text-gray-600 mb-6">
                Ваш запрос на бронирование времени с ментором был отправлен.
              </p>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="text-gray-700"><strong>Ментор:</strong> {mentor.firstName} {mentor.lastName}</p>
                <p className="text-gray-700"><strong>Дата и время:</strong> {formatDateTime(mentorTime.startTime)}</p>
                <p className="text-gray-700">
                  <strong>Продолжительность:</strong> {
                    Math.round((new Date(mentorTime.endTime).getTime() - new Date(mentorTime.startTime).getTime()) / (1000 * 60))
                  } мин
                </p>
                <p className="text-gray-700">
                  <strong>Тип:</strong> {bookingType === 'call' ? 'Звонок' : 'Чат'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-100 p-3 rounded text-red-700 mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
                  Тема сессии
                </label>
                <textarea
                  id="topic"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Опишите тему, которую хотите обсудить с ментором"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Бронирование...' : 'Забронировать'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 