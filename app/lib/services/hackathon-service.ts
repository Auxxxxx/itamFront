import { hackathonApiClient } from './api-client'
import { ApiError } from './api-client'
import type { Hackathon, ApiHackathon } from '../types/hackathon'
import { mapApiHackathonToHackathon } from '../types/hackathon'

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    console.log('Attempting to fetch hackathons from API...')
    const response = await hackathonApiClient.get<{ hackathons: ApiHackathon[] } | ApiHackathon[] | any>('/hackathon/')
    console.log('Raw hackathons response:', response)
    
    // Handle nested response structure based on API documentation
    let apiHackathons: ApiHackathon[] = [];
    
    if (Array.isArray(response)) {
      apiHackathons = response;
    } else if (typeof response === 'object') {
      // API returns { hackathons: [...] } according to HackathonGetAllResponse
      if (Array.isArray(response.hackathons)) {
        console.log('Extracted hackathons array from response', response.hackathons.length)
        apiHackathons = response.hackathons;
      } 
      // Fallback to items if present (for backward compatibility)
      else if (Array.isArray(response.items)) {
        console.log('Extracted hackathons from items array', response.items.length)
        apiHackathons = response.items;
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
    const apiHackathon = await hackathonApiClient.get<ApiHackathon>(`/hackathon/${id}`)
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
    // According to the API docs, winner solutions are submitted to /winner-solution/ endpoint
    await hackathonApiClient.post('/winner-solution/', {
      ...solution,
      hackathon_id: hackathonId
    })
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