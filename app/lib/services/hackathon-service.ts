import { ApiError } from './api-client'
import type { Hackathon, ApiHackathon } from '../types/hackathon'
import { mapApiHackathonToHackathon } from '../types/hackathon'

// Константа базового URL для API хакатонов
const HACKATHON_API_URL = 'http://45.10.41.58:8000'

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
    console.log('[Hackathon Service] Using authorization token:', token.substring(0, 15) + '...');
  } else {
    console.warn('[Hackathon Service] No authorization token found in localStorage!');
  }
  
  // Получаем ID пользователя
  try {
    const userProfileStr = localStorage.getItem('user_profile')
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr)
      if (userProfile?.ID) {
        headers['X-User-ID'] = userProfile.ID;
        console.log('[Hackathon Service] Added X-User-ID header:', userProfile.ID);
      }
    }
  } catch (error) {
    console.error('[Hackathon Service] Error parsing user profile for headers:', error)
  }
  
  console.log('[Hackathon Service] Request headers:', headers);
  return headers
}

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    console.log('Attempting to fetch hackathons from API...')
    console.log('Fetching hackathons at:', new Date().toISOString())
    
    const response = await fetch(`${HACKATHON_API_URL}/hackathon`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    console.log(`API Response status: ${response.status}`)
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch hackathons: ${response.status}`,
        response.status
      )
    }
    
    const data = await response.json()
    console.log('Raw hackathons response:', data)
    
    // Handle nested response structure based on API documentation
    let apiHackathons: ApiHackathon[] = [];
    
    if (Array.isArray(data)) {
      apiHackathons = data;
    } else if (typeof data === 'object') {
      // API returns { hackathons: [...] } according to HackathonGetAllResponse
      if (Array.isArray(data.hackathons)) {
        console.log('Extracted hackathons array from response', data.hackathons.length)
        apiHackathons = data.hackathons;
      } 
      // Fallback to items if present (for backward compatibility)
      else if (Array.isArray(data.items)) {
        console.log('Extracted hackathons from items array', data.items.length)
        apiHackathons = data.items;
      }
    }
    
    // Map API hackathons to our internal format
    const hackathons = apiHackathons.map(mapApiHackathonToHackathon);
    console.log('Mapped hackathons:', hackathons.length);
    
    return hackathons;
  } catch (error: unknown) {
    console.error('Не удалось загрузить хакатоны из API:', error)
    
    // Check for authentication error
    if (error instanceof ApiError && error.status === 401) {
      console.error('Authentication error: JWT token is invalid or missing')
      // If we're in a browser environment, redirect to login
      if (typeof window !== 'undefined') {
        // Clear invalid token
        localStorage.removeItem('auth_token')
        // Redirect to login page
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
      throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.')
    }
    
    throw new Error('Не удалось загрузить хакатоны. Пожалуйста, попробуйте позже.')
  }
}

export async function getHackathonById(id: string): Promise<Hackathon> {
  try {
    const response = await fetch(`${HACKATHON_API_URL}/hackathon/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch hackathon: ${response.status}`,
        response.status
      )
    }
    
    const apiHackathon = await response.json()
    return mapApiHackathonToHackathon(apiHackathon)
  } catch (error: unknown) {
    console.error(`Не удалось загрузить хакатон ${id}:`, error)
    
    // Check for authentication error
    if (error instanceof ApiError && error.status === 401) {
      console.error('Authentication error: JWT token is invalid or missing')
      // If we're in a browser environment, redirect to login
      if (typeof window !== 'undefined') {
        // Clear invalid token
        localStorage.removeItem('auth_token')
        // Redirect to login page
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
      throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.')
    }
    
    throw new Error('Не удалось загрузить детали хакатона. Пожалуйста, попробуйте позже.')
  }
}

/**
 * Adds a solution to a hackathon
 * @param hackathonId - The ID of the hackathon
 * @param solution - The solution details
 */
export async function addWinningSolution(
  hackathonId: string, 
  solution: { 
    team_id: string;
    link_to_solution: string;
    link_to_presentation: string;
    win_money: number;
    can_share: boolean;
  }
): Promise<void> {
  try {
    const response = await fetch(`${HACKATHON_API_URL}/winner-solution/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify({
        ...solution,
        hackathon_id: hackathonId
      })
    })
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to add winning solution: ${response.status}`,
        response.status
      )
    }
  } catch (error: unknown) {
    console.error(`Не удалось добавить решение для хакатона ${hackathonId}:`, error)
    
    // Check for authentication error
    if (error instanceof ApiError && error.status === 401) {
      console.error('Authentication error: JWT token is invalid or missing')
      // If we're in a browser environment, redirect to login
      if (typeof window !== 'undefined') {
        // Clear invalid token
        localStorage.removeItem('auth_token')
        // Redirect to login page
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
      throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.')
    }
    
    throw new Error('Не удалось добавить решение. Пожалуйста, попробуйте позже.')
  }
}