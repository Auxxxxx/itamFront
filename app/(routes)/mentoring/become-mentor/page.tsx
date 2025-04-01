'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { createMentor } from '@/app/lib/services/mentor-service'
import type { MentorProfileFormData } from '@/app/lib/types/mentor'

export default function BecomeMentorPage() {
  const [formData, setFormData] = useState<MentorProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    expertise: []
  })
  const [newExpertise, setNewExpertise] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  function addExpertise() {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }))
      setNewExpertise('')
    }
  }
  
  function removeExpertise(index: number) {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }))
  }
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.bio) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Пожалуйста, введите корректный email')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      // In a real app, we would get userId from auth
      await createMentor({
        userId: 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio,
        expertise: formData.expertise,
        available: true
      })
      
      setSuccess(true)
    } catch (err) {
      setError('Не удалось создать профиль ментора. Пожалуйста, попробуйте позже.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Стать ментором</h1>
        <Link 
          href="/mentoring" 
          className="text-blue-600 hover:text-blue-800"
        >
          Назад
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Что значит быть ментором?</h2>
        <p className="text-gray-700 mb-4">
          Менторы — это опытные профессионалы, которые делятся своими знаниями, опытом и советами с теми, кто только начинает 
          свой путь или стремится улучшить свои навыки в определенной области.
        </p>
        <p className="text-gray-700">
          Став ментором, вы сможете помогать другим участникам развиваться, отвечать на их вопросы и делиться ценными знаниями 
          во время видеозвонков или в чате.
        </p>
      </div>
      
      {success ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Профиль ментора создан!</h3>
            <p className="text-gray-600 mb-6">
              Спасибо за желание стать ментором. Ваш профиль создан и теперь вы можете устанавливать свою доступность для менторских сессий.
            </p>
            <Link 
              href="/mentoring"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Вернуться к менторству
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Создать профиль ментора</h2>
          
          {error && (
            <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                  Фамилия *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                О себе *
              </label>
              <textarea
                id="bio"
                name="bio"
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Расскажите о своем опыте, навыках и о том, чем вы можете помочь другим"
                value={formData.bio}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Специализация
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-grow p-3 border border-gray-300 rounded-lg"
                  placeholder="Добавьте навык или специализацию"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Добавить
                </button>
              </div>
              
              {formData.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.expertise.map((exp, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded flex items-center">
                      <span>{exp}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? 'Создание профиля...' : 'Создать профиль'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 