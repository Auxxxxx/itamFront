import { hackathonApiClient } from './api-client'
import { ApiError } from './api-client'

// Constants
const API_ERROR_MESSAGES = {
  AUTH: 'Требуется авторизация. Пожалуйста, войдите в систему.',
  HACKER_FETCH: 'Не удалось загрузить данные участника. Пожалуйста, попробуйте позже.',
  HACKER_UPDATE: 'Не удалось обновить данные участника. Пожалуйста, попробуйте позже.',
  USER_ID_MISSING: 'Не удалось получить ID пользователя'
}

// External API base URL
const HACKATHON_API_URL = 'http://45.10.41.58:8000'

// Types for API responses and requests
interface HackerResponse {
  id: string
  name?: string
  email?: string
}

interface HackerUpdatePayload {
  name?: string
  email?: string
  skills?: string[]
}

// Helper function to get user profile ID from localStorage
function getUserProfileId(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userProfileStr = localStorage.getItem('user_profile')
    if (!userProfileStr) return null
    
    const userProfile = JSON.parse(userProfileStr)
    return userProfile?.ID || null
  } catch (error) {
    console.error('Error parsing user profile from localStorage:', error)
    return null
  }
}

// Helper function to handle authentication errors
function handleAuthError(error: unknown): never {
  console.error('Authentication error: JWT token is invalid or missing')
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
  }
  
  throw new Error(API_ERROR_MESSAGES.AUTH)
}

// Helper function to get authorization headers
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  
  const accessToken = localStorage.getItem('access_token')
  return accessToken 
    ? { Authorization: `Bearer ${accessToken}` }
    : {}
}

/**
 * Updates current hacker or ensures they exist in the system
 * This function is called when viewing hackathons to ensure the user is registered as a hacker
 */
export async function upsetCurrentHacker(): Promise<void> {
  try {
    const userId = getUserProfileId()
    if (!userId) {
      console.log('No user ID found, skipping hacker registration')
      return
    }
    
    console.log('Ensuring current user is registered as a hacker')
    
    // Check if hacker already exists - direct API call
    const response = await fetch(`${HACKATHON_API_URL}/hacker/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })
    
    // If hacker exists, no need to create
    if (response.ok) {
      console.log('User already registered as a hacker')
      return
    }
    
    // If hacker doesn't exist (404) or other error, try to create
    console.log('Registering user as a hacker')
    
    const createResponse = await fetch(`${HACKATHON_API_URL}/hacker/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        id: userId,
        // Add any other default fields needed for hacker creation
      })
    })
    
    if (!createResponse.ok) {
      console.error('Error registering user as hacker, status:', createResponse.status)
      // Don't throw, just log error since this is a background operation
      console.error('Failed to register user as hacker')
      return
    }
    
    console.log('Successfully registered user as a hacker')
  } catch (error) {
    // Just log the error and continue, since this is a background operation
    console.error('Error in hacker registration:', error)
  }
}

/**
 * Get current hacker information
 */
export async function getCurrentHacker() {
  try {
    const userId = getUserProfileId()
    if (!userId) {
      throw new Error(API_ERROR_MESSAGES.USER_ID_MISSING)
    }
    
    const response = await fetch(`${HACKATHON_API_URL}/hacker/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })
    
    if (!response.ok) {
      console.error('Error fetching hacker data, status:', response.status)
      throw new Error(`Ошибка при получении данных участника: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error('Не удалось загрузить данные участника:', error)
    
    const apiError = error as ApiError
    if (error instanceof Error && apiError.status === 401) {
      return handleAuthError(error)
    }
    
    throw new Error(API_ERROR_MESSAGES.HACKER_FETCH)
  }
}

/**
 * Update hacker information
 */
export async function updateHacker(payload: HackerUpdatePayload) {
  try {
    const userId = getUserProfileId()
    if (!userId) {
      throw new Error(API_ERROR_MESSAGES.USER_ID_MISSING)
    }
    
    const response = await fetch(`${HACKATHON_API_URL}/hacker/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      console.error('Error updating hacker data, status:', response.status)
      throw new Error(`Ошибка при обновлении данных участника: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error('Не удалось обновить данные участника:', error)
    
    const apiError = error as ApiError
    if (error instanceof Error && apiError.status === 401) {
      return handleAuthError(error)
    }
    
    throw new Error(API_ERROR_MESSAGES.HACKER_UPDATE)
  }
} 