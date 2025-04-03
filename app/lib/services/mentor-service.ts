import { ApiError } from './api-client'
import type { Mentor, MentorTime, MentorTimeReservation, User, ApiMentorsResponse, ApiMentor } from '../types/mentor'

// Константа базового URL для API менторства
const MENTOR_API_URL = 'http://45.10.41.58:8001'

// Константы для сообщений об ошибках
const API_ERROR_MESSAGES = {
  AUTH: 'Требуется авторизация. Пожалуйста, войдите в систему.',
  MENTORS_FETCH: 'Не удалось загрузить список менторов. Пожалуйста, попробуйте позже.',
  MENTOR_FETCH: 'Не удалось загрузить профиль ментора. Пожалуйста, попробуйте позже.',
  MENTOR_CREATE: 'Не удалось создать профиль ментора. Пожалуйста, проверьте данные и попробуйте снова.',
  MENTOR_UPDATE: 'Не удалось обновить профиль ментора. Пожалуйста, попробуйте позже.',
  MENTOR_TIMES_FETCH: 'Не удалось загрузить расписание ментора. Пожалуйста, попробуйте позже.',
  USER_FETCH: 'Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже.',
  RESERVATION_CREATE: 'Не удалось создать бронирование. Пожалуйста, попробуйте позже.',
  RESERVATION_UPDATE: 'Не удалось обновить бронирование. Пожалуйста, попробуйте позже.',
  RESERVATIONS_FETCH: 'Не удалось загрузить список бронирований. Пожалуйста, попробуйте позже.'
}

// Получение заголовков авторизации
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  if (typeof window !== 'undefined') {
    try {
      const userProfileStr = localStorage.getItem('user_profile')
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr)
        if (userProfile?.ID) {
          headers['X-User-ID'] = userProfile.ID
          console.log('[Mentor Service] Added X-User-ID header:', userProfile.ID);
        }
      }
      
      const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token')
      if (token) {
        if (token.startsWith('Bearer ')) {
          headers['Authorization'] = token
        } else {
          headers['Authorization'] = `Bearer ${token}`
        }
        console.log('[Mentor Service] Added Authorization Bearer token');
      } else {
        console.warn('[Mentor Service] No auth token found for request');
      }
    } catch (error) {
      console.error('Error getting auth headers:', error)
    }
  }

  return headers
}

// Обновленная функция для выполнения запросов к API
async function makeApiRequest<T>(
  url: string, 
  method: string = 'GET', 
  body?: any
): Promise<T> {
  // Удаляем предварительный OPTIONS запрос, так как сервер не поддерживает этот метод
  // await sendOptionsRequest(url);
  
  // Убеждаемся, что в конце URL нет слеша (если это не корневой URL)
  const normalizedUrl = url.endsWith('/') && !url.endsWith('://') 
    ? url.slice(0, -1) 
    : url;
  
  const headers = getAuthHeaders();
  
  // Логирование запроса
  console.log(`[Mentor Service] Making ${method} request to ${normalizedUrl}`, 
    body ? `with body: ${JSON.stringify(body)}` : '');
  
  try {
    // Выполняем запрос с настройками как в других сервисах
    const response = await fetch(normalizedUrl, {
      method,
      headers,
      mode: 'cors',
      body: body ? JSON.stringify(body) : undefined,
      // Добавляем cache: 'no-cache' чтобы избежать проблем с кешированием
      cache: 'no-cache'
    });
    
    console.log(`[Mentor Service] Response status: ${response.status}`);
    
    // Проверяем статус ответа
    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.status}`, response.status);
    }
    
    try {
      // Парсим ответ
      const data = await response.json();
      console.log(`[Mentor Service] Response data:`, data);
      return data as T;
    } catch (parseError) {
      console.error(`[Mentor Service] Error parsing JSON response:`, parseError);
      // Если не удается разобрать JSON, возвращаем пустой массив или объект в зависимости от ожидаемого типа
      return (Array.isArray([] as any as T) ? [] : {}) as T;
    }
  } catch (error) {
    console.error(`[Mentor Service] Error making request to ${normalizedUrl}:`, error);
    throw error;
  }
}

export async function getMentors(): Promise<Mentor[]> {
  try {
    console.log('[Mentor Service] Fetching mentors list')
    
    // Запрашиваем данные с API, используем новый интерфейс ApiMentorsResponse
    const apiResponse = await makeApiRequest<ApiMentorsResponse>(`${MENTOR_API_URL}/mentor`);
    
    // Проверяем наличие поля mentors в ответе
    if (!apiResponse || !apiResponse.mentors) {
      console.error('[Mentor Service] API response missing mentors field:', apiResponse);
      throw new Error('Invalid API response format');
    }
    
    console.log('[Mentor Service] API returned mentors:', apiResponse.mentors);
    
    // Преобразуем данные из формата API в формат приложения
    const mentors: Mentor[] = apiResponse.mentors.map((apiMentor: ApiMentor) => {
      // Разбиваем полное имя на имя и фамилию (если возможно)
      const nameParts = apiMentor.name ? apiMentor.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      return {
        // Преобразуем string id в number (если возможно), или генерируем случайный id
        id: parseInt(apiMentor.id, 10) || Math.floor(Math.random() * 10000),
        userId: parseInt(apiMentor.id, 10) || Math.floor(Math.random() * 10000),
        firstName: firstName,
        lastName: lastName,
        email: apiMentor.telegram_id || '',
        bio: apiMentor.info || '',
        expertise: apiMentor.info ? [apiMentor.info] : [],
        available: true,
        created: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };
    });
    
    console.log('[Mentor Service] Transformed mentors:', mentors);
    return mentors;
  } catch (error) {
    console.error('[Mentor Service] Error fetching mentors:', error)
    
    // Возвращаем мок-данные в случае ошибки
    console.log('[Mentor Service] Returning mock mentors data')
    return [
      {
        id: 1,
        userId: 101,
        firstName: 'Алексей',
        lastName: 'Иванов',
        email: 'alex@example.com',
        bio: 'Эксперт по машинному обучению и анализу данных',
        expertise: ['ML', 'Python', 'Data Science'],
        available: true,
        created: '2023-01-01T00:00:00Z',
        lastUpdate: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        userId: 102,
        firstName: 'Мария',
        lastName: 'Петрова',
        email: 'maria@example.com',
        bio: 'Опытный разработчик веб-приложений',
        expertise: ['React', 'TypeScript', 'Node.js'],
        available: true,
        created: '2023-01-02T00:00:00Z',
        lastUpdate: '2023-01-02T00:00:00Z'
      },
      {
        id: 3,
        userId: 103,
        firstName: 'Иван',
        lastName: 'Сидоров',
        email: 'ivan@example.com',
        bio: 'Специалист по кибербезопасности',
        expertise: ['Security', 'Penetration Testing', 'Cryptography'],
        available: true,
        created: '2023-01-03T00:00:00Z',
        lastUpdate: '2023-01-03T00:00:00Z'
      }
    ]
  }
}

export async function getMentor(mentorId: number): Promise<Mentor> {
  try {
    console.log(`[Mentor Service] Fetching mentor with ID: ${mentorId}`)
    
    const data = await makeApiRequest<Mentor>(`${MENTOR_API_URL}/mentor/${mentorId}`);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error fetching mentor ${mentorId}:`, error)
    
    // Возвращаем мок-данные в случае ошибки
    return {
      id: mentorId,
      userId: 100 + mentorId,
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'mentor@example.com',
      bio: 'Информация о менторе недоступна',
      expertise: ['Технологии'],
      available: true,
      created: '2023-01-01T00:00:00Z',
      lastUpdate: '2023-01-01T00:00:00Z'
    }
  }
}

export async function createMentor(mentor: Omit<Mentor, 'id' | 'created' | 'lastUpdate'>): Promise<Mentor> {
  try {
    console.log('[Mentor Service] Creating mentor with data:', mentor)
    
    const data = await makeApiRequest<Mentor>(`${MENTOR_API_URL}/mentor`, 'POST', mentor);
    return data;
  } catch (error) {
    console.error('[Mentor Service] Error creating mentor:', error)
    throw new Error(API_ERROR_MESSAGES.MENTOR_CREATE)
  }
}

export async function updateMentor(mentorId: number, mentor: Partial<Mentor>): Promise<Mentor> {
  try {
    console.log(`[Mentor Service] Updating mentor ${mentorId} with data:`, mentor)
    
    const data = await makeApiRequest<Mentor>(`${MENTOR_API_URL}/mentor/${mentorId}`, 'PUT', mentor);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error updating mentor ${mentorId}:`, error)
    throw new Error(API_ERROR_MESSAGES.MENTOR_UPDATE)
  }
}

export async function getMentorTimes(mentorId: number): Promise<MentorTime[]> {
  try {
    console.log(`[Mentor Service] Fetching times for mentor ${mentorId}`)
    
    const data = await makeApiRequest<MentorTime[]>(`${MENTOR_API_URL}/mentor/${mentorId}/times`);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error fetching mentor times for mentor ${mentorId}:`, error)
    
    // Возвращаем мок-данные в случае ошибки
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return [
      {
        id: 1,
        mentorId: mentorId,
        startTime: tomorrow.toISOString(),
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
        isAvailable: true,
        type: 'call',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      },
      {
        id: 2,
        mentorId: mentorId,
        startTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        isAvailable: true,
        type: 'chat',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      }
    ]
  }
}

export async function createMentorTime(mentorTime: Omit<MentorTime, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTime> {
  try {
    console.log('[Mentor Service] Creating mentor time with data:', mentorTime)
    
    const data = await makeApiRequest<MentorTime>(`${MENTOR_API_URL}/mentor-times`, 'POST', mentorTime);
    return data;
  } catch (error) {
    console.error('[Mentor Service] Error creating mentor time:', error)
    throw error
  }
}

export async function updateMentorTime(mentorTimeId: number, mentorTime: Partial<MentorTime>): Promise<MentorTime> {
  try {
    console.log(`[Mentor Service] Updating mentor time ${mentorTimeId} with data:`, mentorTime)
    
    const data = await makeApiRequest<MentorTime>(`${MENTOR_API_URL}/mentor-times/${mentorTimeId}`, 'PUT', mentorTime);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error updating mentor time ${mentorTimeId}:`, error)
    throw error
  }
}

export async function reserveMentorTime(reservation: Omit<MentorTimeReservation, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTimeReservation> {
  try {
    console.log('[Mentor Service] Creating reservation with data:', reservation)
    
    const data = await makeApiRequest<MentorTimeReservation>(`${MENTOR_API_URL}/reservations`, 'POST', reservation);
    return data;
  } catch (error) {
    console.error('[Mentor Service] Error reserving mentor time:', error)
    throw new Error(API_ERROR_MESSAGES.RESERVATION_CREATE)
  }
}

export async function getUserReservations(userId: number): Promise<MentorTimeReservation[]> {
  try {
    console.log(`[Mentor Service] Fetching reservations for user ${userId}`)
    
    const data = await makeApiRequest<MentorTimeReservation[]>(`${MENTOR_API_URL}/users/${userId}/reservations`);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error fetching reservations for user ${userId}:`, error)
    
    // Возвращаем мок-данные в случае ошибки
    const now = new Date()
    return [
      {
        id: 1,
        mentorTimeId: 1,
        menteeId: userId,
        status: 'confirmed',
        topic: 'Консультация по карьерному росту',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      },
      {
        id: 2,
        mentorTimeId: 2,
        menteeId: userId,
        status: 'pending',
        topic: 'Обсуждение проекта',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      }
    ]
  }
}

export async function getMentorReservations(mentorId: number): Promise<MentorTimeReservation[]> {
  try {
    console.log(`[Mentor Service] Fetching reservations for mentor ${mentorId}`)
    
    const data = await makeApiRequest<MentorTimeReservation[]>(`${MENTOR_API_URL}/mentor/${mentorId}/reservations`);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error fetching reservations for mentor ${mentorId}:`, error)
    
    // Возвращаем мок-данные в случае ошибки
    const now = new Date()
    return [
      {
        id: 3,
        mentorTimeId: 3,
        menteeId: 201,
        status: 'confirmed',
        topic: 'Консультация по проекту',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      },
      {
        id: 4,
        mentorTimeId: 4,
        menteeId: 202,
        status: 'pending',
        topic: 'Вопросы по технологиям',
        created: now.toISOString(),
        lastUpdate: now.toISOString()
      }
    ]
  }
}

export async function updateReservation(reservationId: number, reservation: Partial<MentorTimeReservation>): Promise<MentorTimeReservation> {
  try {
    console.log(`[Mentor Service] Updating reservation ${reservationId} with data:`, reservation)
    
    const data = await makeApiRequest<MentorTimeReservation>(`${MENTOR_API_URL}/reservations/${reservationId}`, 'PUT', reservation);
    return data;
  } catch (error) {
    console.error(`[Mentor Service] Error updating reservation ${reservationId}:`, error)
    throw new Error(API_ERROR_MESSAGES.RESERVATION_UPDATE)
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    console.log('[Mentor Service] Fetching current user')
    
    const data = await makeApiRequest<User>(`${MENTOR_API_URL}/users/me`);
    return data;
  } catch (error) {
    console.error('[Mentor Service] Error fetching current user:', error)
    
    // Возвращаем мок-данные в случае ошибки
    return {
      id: 100,
      token: '',
      email: 'user@example.com',
      firstName: 'Пользователь',
      lastName: 'Тестовый',
      created: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      privacyAccepted: true,
      approved: true
    }
  }
}