'use client'

import { useState, FormEvent } from 'react'
import { updateProfile } from '@/app/actions/profile'

interface User {
  ID: number
  Name?: string
  Email: string
  Telegram?: string | null
  PhotoURL?: string | null
  About?: string | null
  Specification?: string
}

interface EditProfileFormProps {
  user: User
  onUpdate: (updatedUser: User) => void
  onCancel: () => void
}

export function EditProfileForm({ user, onUpdate, onCancel }: EditProfileFormProps) {
  const [name, setName] = useState(user.Name || '')
  const [email, setEmail] = useState(user.Email || '')
  const [telegram, setTelegram] = useState(user.Telegram || '')
  const [about, setAbout] = useState(user.About || '')
  const [specification, setSpecification] = useState(user.Specification || '')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Требуется авторизация')
        setIsLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('token', token)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('telegram', telegram)
      formData.append('about', about)
      formData.append('specification', specification)

      console.log('Submitting form data:', {
        name, email, telegram, about, specification
      });

      const result = await updateProfile(formData)
      console.log('Update result:', result);

      if (!result.success) {
        setError(result.error || 'Ошибка при обновлении профиля')
        setIsLoading(false)
        return
      }

      // Сохраняем обновленные данные профиля в localStorage
      localStorage.setItem('user_profile', JSON.stringify(result.data))

      setSuccessMessage('Профиль успешно обновлен (изменения сохранены локально)')
      setTimeout(() => {
        onUpdate(result.data)
      }, 2000) // Увеличенная задержка, чтобы пользователь успел прочитать сообщение
    } catch (err) {
      console.error('Client-side error updating profile:', err)
      setError('Произошла ошибка при обновлении профиля')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Редактирование профиля</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-3 text-sm">
            {successMessage}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Введите ваше имя"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Введите ваш email"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="telegram" className="block text-sm font-medium mb-1">
            Telegram
          </label>
          <input
            id="telegram"
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Введите ваш Telegram"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="specification" className="block text-sm font-medium mb-1">
            Специализация
          </label>
          <select
            id="specification"
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          >
            <option value="">Выберите специализацию</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Mobile">Mobile</option>
            <option value="DevOps">DevOps</option>
            <option value="QA">QA</option>
            <option value="Design">Design</option>
            <option value="PM">Project Manager</option>
            <option value="Other">Другое</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="about" className="block text-sm font-medium mb-1">
            О себе
          </label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Расскажите о себе"
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
} 