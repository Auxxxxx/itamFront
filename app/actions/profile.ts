'use server'

import { z } from 'zod'
import type { ActionResponse } from '@/app/types/actions'
import { cookies } from 'next/headers'

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
    const token = cookies().get('auth_token')?.value
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated'
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

    // Получаем текущий профиль
    try {
      const response = await fetch('http://45.10.41.58:8000/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: 'Не удалось получить данные профиля'
        };
      }

      const currentProfile = await response.json();
      console.log('Current profile:', currentProfile);

      // Создаем имитацию обновленного профиля
      // Сохраняем все исходные данные и обновляем только те, которые изменились
      const updatedProfile = {
        ...currentProfile,
        Name: name,
        Email: email,
        Telegram: telegram || currentProfile.Telegram,
        About: about || currentProfile.About,
        Specification: specification || currentProfile.Specification
      };

      console.log('Simulated updated profile:', updatedProfile);

      // Отправляем обновленные данные обратно на клиент
      // Данные будут сохранены в localStorage на стороне клиента
      return {
        success: true,
        data: updatedProfile
      };
    } catch (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return {
        success: false,
        error: 'Ошибка при получении данных профиля'
      };
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Произошла ошибка при обновлении профиля'
    };
  }
} 