'use server'

import { z } from 'zod'
import type { ActionResponse } from '@/app/types/actions'

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
})

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
})

interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export async function register(formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    const validatedFields = registerSchema.safeParse({
      email,
      name,
      password,
      confirmPassword
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      }
    }

    const response = await fetch('http://45.10.41.58:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Ошибка при регистрации',
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Произошла ошибка при регистрации',
    }
  }
}

export async function login(formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validatedFields = loginSchema.safeParse({
      email,
      password
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      }
    }

    const response = await fetch('http://45.10.41.58:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Ошибка при входе',
      }
    }

    const data: AuthResponse = await response.json()
    
    // Store token in localStorage (this will be handled on the client side)
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Произошла ошибка при входе',
    }
  }
} 