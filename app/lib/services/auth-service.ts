import { z } from 'zod'
import { ApiError } from './api-client'

// Константа базового URL для API аутентификации
const AUTH_API_URL = 'http://45.10.41.58:8080'

// Типы данных для аутентификации
export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface UserProfile {
  ID: string | number
  Name?: string
  Email: string
  [key: string]: any
}

// Валидационные схемы
const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
})

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
})

// Получение заголовков для запросов
function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Получение заголовков авторизации
function getAuthHeaders(token: string): Record<string, string> {
  const headers = getHeaders()
  
  // Добавляем токен в заголовок Authorization
  if (token) {
    if (token.startsWith('Bearer ')) {
      headers['Authorization'] = token
    } else {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

/**
 * Регистрация нового пользователя
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    // Валидация данных
    const validationResult = registerSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message
      }
    }

    console.log('[Auth Service] Регистрация пользователя:', {
      email: data.email,
      name: data.name
    })

    const response = await fetch(`${AUTH_API_URL}/api/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-store'
    })

    if (!response.ok) {
      let errorMessage = 'Ошибка при регистрации'
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        const text = await response.text()
        console.error('[Auth Service] Ошибка разбора ответа сервера:', text)
      }
      
      console.error('[Auth Service] Ошибка регистрации:', {
        status: response.status,
        message: errorMessage
      })
      
      return {
        success: false,
        error: errorMessage
      }
    }

    const responseData = await response.json()
    console.log('[Auth Service] Успешная регистрация:', responseData)
    
    return {
      success: true,
      data: responseData
    }
  } catch (error) {
    console.error('[Auth Service] Исключение при регистрации:', error)
    
    return {
      success: false,
      error: 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.'
    }
  }
}

/**
 * Авторизация пользователя
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    // Валидация данных
    const validationResult = loginSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message
      }
    }

    console.log('[Auth Service] Авторизация пользователя:', { email: data.email })

    const response = await fetch(`${AUTH_API_URL}/api/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-store'
    })

    if (!response.ok) {
      let errorMessage = 'Ошибка при входе'
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        console.error('[Auth Service] Ошибка разбора ответа сервера:', e)
      }
      
      console.error('[Auth Service] Ошибка авторизации:', {
        status: response.status,
        message: errorMessage
      })
      
      return {
        success: false,
        error: errorMessage
      }
    }

    const tokenData: TokenResponse = await response.json()
    console.log('[Auth Service] Успешная авторизация, получен токен')
    
    return {
      success: true,
      data: tokenData
    }
  } catch (error) {
    console.error('[Auth Service] Исключение при авторизации:', error)
    
    return {
      success: false,
      error: 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.'
    }
  }
}

/**
 * Получение данных текущего пользователя
 */
export async function getCurrentUser(token: string): Promise<AuthResponse> {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Не найден токен авторизации'
      }
    }

    console.log('[Auth Service] Получение данных текущего пользователя')

    const response = await fetch(`${AUTH_API_URL}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      mode: 'cors',
      cache: 'no-store'
    })

    if (!response.ok) {
      let errorMessage = 'Ошибка получения данных пользователя'
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        console.error('[Auth Service] Ошибка разбора ответа сервера:', e)
      }
      
      console.error('[Auth Service] Ошибка получения данных:', {
        status: response.status,
        message: errorMessage
      })
      
      return {
        success: false,
        error: errorMessage
      }
    }

    const userData: UserProfile = await response.json()
    console.log('[Auth Service] Успешно получены данные пользователя:', userData)
    
    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('[Auth Service] Исключение при получении данных пользователя:', error)
    
    return {
      success: false,
      error: 'Произошла ошибка при получении данных пользователя.'
    }
  }
}

/**
 * Сохранение данных авторизации в localStorage
 */
export function saveAuthData(tokenData: TokenResponse, userData?: UserProfile): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('auth_token', tokenData.access_token)
  localStorage.setItem('token_type', tokenData.token_type)
  localStorage.setItem('expires_in', tokenData.expires_in.toString())
  
  if (userData) {
    localStorage.setItem('user_profile', JSON.stringify(userData))
  }
  
  // Оповещаем другие компоненты о изменении состояния авторизации
  window.dispatchEvent(new Event('authStateChanged'))
}

/**
 * Выход из системы
 */
export function logout(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('expires_in')
  localStorage.removeItem('user_profile')
  
  // Оповещаем другие компоненты о изменении состояния авторизации
  window.dispatchEvent(new Event('authStateChanged'))
} 