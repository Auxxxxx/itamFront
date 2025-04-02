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

    console.log('Отправка запроса на регистрацию:', {
      url: 'http://45.10.41.58:8080/api/users/register',
      body: {
        email,
        name,
        password,
      }
    });

    const response = await fetch('http://45.10.41.58:8080/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
      // Нельзя использовать credentials: 'include', так как сервер не поддерживает
      cache: 'no-store',
    })

    console.log('Ответ сервера регистрации:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Ошибка при регистрации';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        console.error('Не удалось распарсить ошибку:', errorText);
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    const data = await response.json()
    console.log('Успешная регистрация:', data);
    
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    
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

    const response = await fetch('http://45.10.41.58:8080/api/users/login', {
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