'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token_type')
    localStorage.removeItem('expires_in')
    window.dispatchEvent(new Event('authStateChanged'))
    window.location.href = '/'
  }

  console.log("Auth state:", { user, isLoading })

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Главная
            </Link>
            <Link 
              href="/hackathons" 
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/hackathons') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Хакатоны
            </Link>
            <Link 
              href="/about" 
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/about') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              О нас
            </Link>
          </div>

          <div className="flex items-center">
            {isLoading ? (
              <div className="text-gray-500">Загрузка...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className={`text-sm font-medium ${
                    isActive('/login') 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Войти
                </Link>
                <Link 
                  href="/register" 
                  className={`text-sm font-medium ${
                    isActive('/register') 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 