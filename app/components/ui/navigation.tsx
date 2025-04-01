"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useAuth()

  console.log("Navigation component - user:", user);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                ИТ-Платформа
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoading ? (
              <div className="text-gray-500">Загрузка...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <User size={18} className="mr-1" />
                  {user.email}
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    window.dispatchEvent(new Event('authStateChanged'))
                    window.location.href = '/'
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn size={18} className="mr-1" />
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Открыть меню</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t">
            {isLoading ? (
              <div className="px-3 py-2 text-gray-500">Загрузка...</div>
            ) : user ? (
              <>
                <div className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600">
                  {user.email}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    window.dispatchEvent(new Event('authStateChanged'))
                    window.location.href = '/'
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 bg-blue-50 text-base font-medium text-blue-700"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 