import { ApiError } from './api-client'
import type { Mentor, MentorTime, MentorTimeReservation, User } from '../types/mentor'

// Константа базового URL для API менторства
const MENTOR_API_URL = 'http://45.10.41.58:8001'

// Получение заголовков авторизации
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  // Получаем токен из localStorage - сначала auth_token, затем access_token
  const authToken = localStorage.getItem('auth_token');
  const accessToken = localStorage.getItem('access_token');
  
  const token = authToken || accessToken;
  
  if (token) {
    // Убедимся, что токен правильно форматирован как Bearer
    if (token.startsWith('Bearer ')) {
      headers['Authorization'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('[Mentor Service] Using authorization token:', token.substring(0, 15) + '...');
  } else {
    console.warn('[Mentor Service] No authorization token found in localStorage!');
  }
  
  // Получаем ID пользователя
  try {
    const userProfileStr = localStorage.getItem('user_profile')
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr)
      if (userProfile?.ID) {
        headers['X-User-ID'] = userProfile.ID;
        console.log('[Mentor Service] Added X-User-ID header:', userProfile.ID);
      }
    }
  } catch (error) {
    console.error('[Mentor Service] Error parsing user profile for headers:', error)
  }
  
  console.log('[Mentor Service] Request headers:', headers);
  return headers
}

export async function getMentors(): Promise<Mentor[]> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch mentors: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching mentors:', error)
    throw error
  }
}

export async function getMentor(mentorId: number): Promise<Mentor> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors/${mentorId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch mentor: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching mentor ${mentorId}:`, error)
    throw error
  }
}

export async function createMentor(mentor: Omit<Mentor, 'id' | 'created' | 'lastUpdate'>): Promise<Mentor> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(mentor)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to create mentor: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating mentor:', error)
    throw error
  }
}

export async function updateMentor(mentorId: number, mentor: Partial<Mentor>): Promise<Mentor> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors/${mentorId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(mentor)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to update mentor: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error updating mentor ${mentorId}:`, error)
    throw error
  }
}

export async function getMentorTimes(mentorId: number): Promise<MentorTime[]> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors/${mentorId}/times`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch mentor times: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching mentor times for mentor ${mentorId}:`, error)
    throw error
  }
}

export async function createMentorTime(mentorTime: Omit<MentorTime, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTime> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentor-times`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(mentorTime)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to create mentor time: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating mentor time:', error)
    throw error
  }
}

export async function updateMentorTime(mentorTimeId: number, mentorTime: Partial<MentorTime>): Promise<MentorTime> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentor-times/${mentorTimeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(mentorTime)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to update mentor time: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error updating mentor time ${mentorTimeId}:`, error)
    throw error
  }
}

export async function reserveMentorTime(reservation: Omit<MentorTimeReservation, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTimeReservation> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(reservation)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to reserve mentor time: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error reserving mentor time:', error)
    throw error
  }
}

export async function getUserReservations(userId: number): Promise<MentorTimeReservation[]> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/users/${userId}/reservations`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch user reservations: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching reservations for user ${userId}:`, error)
    throw error
  }
}

export async function getMentorReservations(mentorId: number): Promise<MentorTimeReservation[]> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/mentors/${mentorId}/reservations`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch mentor reservations: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching reservations for mentor ${mentorId}:`, error)
    throw error
  }
}

export async function updateReservation(reservationId: number, reservation: Partial<MentorTimeReservation>): Promise<MentorTimeReservation> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(reservation)
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to update reservation: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error updating reservation ${reservationId}:`, error)
    throw error
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${MENTOR_API_URL}/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch current user: ${response.status}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching current user:', error)
    throw error
  }
} 