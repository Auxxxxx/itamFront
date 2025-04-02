import { hackathonApiClient } from './api-client'
import { ApiError } from './api-client'
import type { Team } from '../types/team'

// Constants
const API_ERROR_MESSAGES = {
  AUTH: 'Требуется авторизация. Пожалуйста, войдите в систему.',
  TEAMS_FETCH: 'Не удалось загрузить команды. Пожалуйста, попробуйте позже.',
  TEAM_FETCH: 'Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.',
  TEAM_CREATE: 'Не удалось создать команду. Пожалуйста, проверьте данные и попробуйте снова.',
  TEAM_JOIN: 'Не удалось присоединиться к команде. Пожалуйста, попробуйте позже.',
  HACKATHON_TEAMS_FETCH: 'Не удалось загрузить команды хакатона. Пожалуйста, попробуйте позже.',
  USER_ID_MISSING: 'Не удалось получить ID пользователя',
  INVALID_RESPONSE: 'Неверный формат ответа от сервера',
  TEAM_NAME_MISSING: 'Не удалось создать команду: отсутствует название команды',
  TEAM_ID_REQUIRED: 'Team ID is required'
}

// External API base URL
const HACKATHON_API_URL = 'http://45.10.41.58:8000'

// Types for API responses and requests
interface TeamResponse {
  id: string
  name: string
  description?: string
  hackathon_id?: string
  hackathonId?: string
  ownerID?: string
  owner_id?: string
  max_size?: number
  hacker_ids?: string[]
  members?: Array<string | { id: string }>
}

interface TeamCreatePayload {
  name: string
  max_size?: number
}

interface AddHackerPayload {
  team_id: string
  hacker_id: string
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
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  // Try to get tokens in order of preference
  const authToken = localStorage.getItem('auth_token');
  const accessToken = localStorage.getItem('access_token');
  
  const token = authToken || accessToken;
  
  if (token) {
    // Ensure proper Bearer format
    if (token.startsWith('Bearer ')) {
      headers['Authorization'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('[Team Service] Using authorization token:', token.substring(0, 15) + '...');
  } else {
    console.warn('[Team Service] No authorization token found in localStorage!');
  }
  
  // Add X-Auth-Token header as well if available
  if (authToken) {
    headers['X-Auth-Token'] = authToken;
    console.log('[Team Service] Added X-Auth-Token header');
  }
  
  // Get user profile ID and add it as a header
  try {
    const userProfileStr = localStorage.getItem('user_profile')
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr)
      if (userProfile?.ID) {
        headers['X-User-ID'] = userProfile.ID;
        console.log('[Team Service] Added X-User-ID header:', userProfile.ID);
      }
    }
  } catch (error) {
    console.error('[Team Service] Error parsing user profile for headers:', error)
  }
  
  console.log('[Team Service] Final request headers:', headers);
  return headers
}

// Helper functions for parsing API responses
function parseTeamsResponse(data: any): Team[] {
  let teamsArray: any[] = []
  
  // Check if response has a teams property
  if (data && data.teams && Array.isArray(data.teams)) {
    teamsArray = data.teams
  } else if (Array.isArray(data)) {
    teamsArray = data
  } else if (data && typeof data === 'object') {
    teamsArray = [data] // Handle case when single team is returned
  }
  
  // Map each team to our client model
  return teamsArray.map(mapTeamToClientModel)
}

function mapTeamToClientModel(team: TeamResponse): Team {
  const userProfileId = getUserProfileId()
  
  return {
      id: team.id,
      name: team.name,
      description: team.description || team.name, // Use name as description if missing
      hackathonId: team.hackathon_id || team.hackathonId || '1', // Support both snake_case and camelCase
    members: team.hacker_ids ? team.hacker_ids.map(id => ({
        id,
      name: id === userProfileId ? "Вы" : `Участник ${id.substring(0, 4)}`,
        role: id === (team.ownerID || team.owner_id) ? 'Владелец' : 'Участник'
      })) : [],
      ownerID: team.ownerID || team.owner_id,
      max_size: team.max_size,
      hacker_ids: team.hacker_ids
  }
}

// Main service functions
export async function getTeams(): Promise<Team[]> {
  try {
    console.log("Fetching user's teams from my-teams endpoint")
    
    // Get auth headers and log them for debugging
    const headers = getAuthHeaders()
    console.log("Request headers for my-teams:", headers)
    
    // Check if tokens are available
    if (typeof window !== 'undefined') {
      console.log("Access token available:", !!localStorage.getItem('access_token'))
      console.log("Auth token available:", !!localStorage.getItem('auth_token'))
      console.log("User profile available:", !!localStorage.getItem('user_profile'))
    }
    
    // Use the external API endpoint directly with CORS mode
    const response = await fetch(`${HACKATHON_API_URL}/team/my-teams`, {
      method: 'GET',
      headers,
      mode: 'cors'
      // Removed credentials: 'include' to fix CORS error
    })
    
    console.log("Response status for my-teams:", response.status)
    console.log("Response headers:", Object.fromEntries([...response.headers]))
    
    if (!response.ok) {
      console.error('Error fetching teams, status:', response.status)
      throw new Error(`Ошибка при получении команд: ${response.status}`)
    }
    
    const data = await response.json()
    console.log("My teams response:", data)
    
    return parseTeamsResponse(data)
  } catch (error: unknown) {
    console.error('Не удалось загрузить команды:', error)
    
    const apiError = error as ApiError
    if (error instanceof Error && apiError.status === 401) {
      return handleAuthError(error)
    }
    
    // Return mock data as fallback
    console.log("Returning mock teams data")
    return [
      {
        id: 'mock-1',
        name: 'Команда 1 (мок)',
        description: 'Мок данные при ошибке API',
        hackathonId: '1',
        members: [
          { id: '1', name: 'Вы', role: 'Владелец' }
        ],
        ownerID: '1',
        max_size: 5
      }
    ]
  }
}

export async function getTeamById(id: string): Promise<Team> {
  if (!id) throw new Error(API_ERROR_MESSAGES.TEAM_ID_REQUIRED)
  
  try {
    console.log(`[Team Service] Fetching team with ID: ${id}`)
    
    const headers = getAuthHeaders()
    
    const response = await fetch(`${HACKATHON_API_URL}/team/${id}`, {
      method: 'GET',
      headers,
      mode: 'cors'
    })
    
    console.log(`[Team Service] Response status for team/${id}:`, response.status)
    
    if (!response.ok) {
      console.error(`[Team Service] Error fetching team ${id}, status:`, response.status)
      throw new ApiError(`Failed to fetch team: ${response.status}`, response.status)
    }
    
    const data = await response.json()
    console.log(`[Team Service] Team ${id} response:`, data)
    
    // Handle single team response
    if (!data || !data.id) {
      throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE)
    }
    
    return mapTeamToClientModel(data)
  } catch (error: unknown) {
    console.error(`[Team Service] Не удалось загрузить команду ${id}:`, error)
    
    const apiError = error as ApiError
    if (error instanceof Error && apiError.status === 401) {
      return handleAuthError(error)
    }
    
    // Mock data as fallback
    return {
      id,
      name: 'Команда (мок)',
      description: 'Мок данные при ошибке API',
      hackathonId: '1',
      members: [
        { id: '1', name: 'Вы', role: 'Владелец' }
      ],
      ownerID: '1',
      max_size: 5
    }
  }
}