'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/app/actions/auth'
import type { FormEvent } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (!result.success) {
      setError(result.error || 'Произошла ошибка при входе')
      setIsLoading(false)
      return
    }

    console.log("Login successful:", result.data);

    // Store token in localStorage
    localStorage.setItem('auth_token', result.data.access_token)
    localStorage.setItem('token_type', result.data.token_type)
    localStorage.setItem('expires_in', result.data.expires_in.toString())

    // Dispatch event and then do a full page reload
    window.dispatchEvent(new Event('authStateChanged'))
    
    // Force a full page reload
    window.location.href = '/'
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Вход</h1>
          <p className="text-gray-600">
            Войдите в свою учетную запись
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Электронная почта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full p-2 border rounded-md"
                required
                disabled={isLoading}
              />
            </div>

            <div className="!mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
} 