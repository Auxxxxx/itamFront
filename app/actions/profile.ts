'use server'

import { z } from 'zod'
import type { ActionResponse } from '@/app/types/actions'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  telegram: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  specification: z.string().nullable().optional()
})

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  try {
    // Эти данные должны быть получены на клиенте и переданы сюда
    const token = formData.get('token') as string
    if (!token) {
      return {
        success: false,
        error: 'Требуется авторизация'
      }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const telegram = formData.get('telegram') as string
    const about = formData.get('about') as string
    const specification = formData.get('specification') as string

    const validatedFields = updateProfileSchema.safeParse({
      name,
      email,
      telegram: telegram || null,
      about: about || null,
      specification: specification || null
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      }
    }

    // Здесь будет запрос к API для обновления профиля
    // Пока API для обновления не упоминалось, сделаем заглушку
    // В реальном приложении здесь должен быть запрос к API
    
    const mockResponse = {
      ID: 1,
      Name: name,
      Email: email,
      Telegram: telegram || null,
      About: about || null,
      Specification: specification || null,
      PhotoURL: null
    }

    return {
      success: true,
      data: mockResponse
    }
  } catch (error) {
    return {
      success: false,
      error: 'Произошла ошибка при обновлении профиля'
    }
  }
} 