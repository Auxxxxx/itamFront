import { hackathonApiClient } from './api-client'
import { ApiError } from './api-client'
import type { Team } from '../types/team'

export async function getTeams(): Promise<Team[]> {
  try {
    // Get current user ID from user_profile.ID in localStorage
    const userProfile = typeof window !== 'undefined' ? localStorage.getItem("user_profile.ID") : null
    if (!userProfile) {
      console.warn("No user_profile.ID found, returning empty teams array")
      return []
    }
    
    console.log("Fetching teams for user ID:", userProfile)
    const response = await hackathonApiClient.get<{ teams: Team[] } | Team[] | any>('/team/')
    console.log("Raw teams response:", response)
    
    let teamsArray: any[] = []
    
    // Check if response has a teams property (the format shown in the API)
    if (response && response.teams && Array.isArray(response.teams)) {
      teamsArray = response.teams
    } else if (Array.isArray(response)) {
      teamsArray = response
    } else if (response && typeof response === 'object') {
      teamsArray = [response] // Handle case when single team is returned
    }
    
    console.log("Teams array before filtering:", teamsArray)
    
    // Filter teams where user is a member or owner
    const userTeams = teamsArray.filter(team => {
      if (!team) return false;
      
      // Check if user is owner (handle different formats)
      if (team.ownerID === userProfile || team.owner_id === userProfile) return true;
      
      // Check if user is in hacker_ids array
      if (team.hacker_ids && Array.isArray(team.hacker_ids) && team.hacker_ids.includes(userProfile)) return true;
      
      // Check if user is in members array
      if (team.members && Array.isArray(team.members)) {
        return team.members.some((member: string | { id: string }) => 
          typeof member === 'string' 
            ? member === userProfile 
            : member.id === userProfile
        );
      }
      
      return false;
    })
    
    console.log("Filtered user teams:", userTeams)
    
    // Map API response to our Team type
    return userTeams.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description || team.name, // Use name as description if missing
      hackathonId: team.hackathon_id || team.hackathonId || '1', // Support both snake_case and camelCase
      members: team.hacker_ids ? team.hacker_ids.map((id: string) => ({
        id,
        name: id === userProfile ? "Вы" : `Участник ${id.substring(0, 4)}`,
        role: id === (team.ownerID || team.owner_id) ? 'Владелец' : 'Участник'
      })) : [],
      // Add other properties from the API
      ownerID: team.ownerID || team.owner_id,
      max_size: team.max_size,
      hacker_ids: team.hacker_ids
    }))
  } catch (error: unknown) {
    console.error('Не удалось загрузить команды:', error)
    
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
    
    throw new Error('Не удалось загрузить команды. Пожалуйста, попробуйте позже.')
  }
}

export async function getTeamById(id: string): Promise<Team> {
  try {
    const response = await hackathonApiClient.get<Team | any>(`/team/${id}`)
    
    // Get current user ID
    const userProfile = typeof window !== 'undefined' ? localStorage.getItem("user_profile.ID") : null
    
    // Handle response in the format returned by the API
    if (response && response.id && response.hacker_ids) {
      return {
        id: response.id,
        name: response.name,
        description: response.name, // Use name as description if missing
        hackathonId: response.hackathonId || '1', // Default hackathonId if missing
        members: response.hacker_ids ? response.hacker_ids.map((id: string) => ({
          id,
          name: userProfile && id === userProfile ? "Вы" : `Участник ${id.substring(0, 4)}`,
          role: id === response.ownerID ? 'Владелец' : 'Участник'
        })) : [],
        // Add other properties from the API
        ownerID: response.ownerID,
        max_size: response.max_size,
        hacker_ids: response.hacker_ids
      }
    }
    
    return response
  } catch (error: unknown) {
    console.error(`Не удалось загрузить команду ${id}:`, error)
    
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
    
    throw new Error('Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.')
  }
}

export async function createTeam(teamData: Partial<Team>): Promise<Team> {
  try {
    console.log('Creating team with data:', teamData)
    
    // Ensure required fields are present
    if (!teamData.name) {
      console.error('Missing required fields for team creation')
      throw new Error('Не удалось создать команду: отсутствует название команды')
    }
    
    // Get user_id from user_profile.ID in localStorage if not provided
    let ownerId = teamData.ownerID
    if (typeof window !== 'undefined' && !ownerId) {
      const userProfile = localStorage.getItem('user_profile.ID')
      if (!userProfile) {
        throw new Error('Не удалось получить ID пользователя')
      }
      ownerId = userProfile
    }
    
    // Prepare payload in the format expected by the API
    const payload = {
      name: teamData.name,
      ownerID: ownerId,
      max_size: teamData.max_size || 5
    }
    
    console.log('Sending team creation request with payload:', payload)
    const response = await hackathonApiClient.post<Team>('/team/', payload)
    console.log('Team creation response:', response)
    
    if (!response || !response.id) {
      throw new Error('Сервер вернул неверный ответ при создании команды')
    }
    
    return response
  } catch (error: unknown) {
    console.error('Не удалось создать команду:', error)
    
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
    
    throw new Error('Не удалось создать команду. Пожалуйста, проверьте данные и попробуйте снова.')
  }
}

export async function joinTeam(teamId: string, userId: string): Promise<void> {
  try {
    // If userId is not provided, try to get it from localStorage
    let hackerId = userId
    if (!hackerId && typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('user_profile.ID')
      if (!userProfile) {
        throw new Error('Не удалось получить ID пользователя')
      }
      hackerId = userProfile
    }
    
    await hackathonApiClient.post('/team/add_hacker', { 
      team_id: teamId, 
      hacker_id: hackerId 
    })
  } catch (error: unknown) {
    console.error(`Не удалось присоединиться к команде ${teamId}:`, error)
    
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
    
    throw new Error('Не удалось присоединиться к команде. Пожалуйста, попробуйте позже.')
  }
}

// Add a new function to get teams by hackathon ID
export async function getTeamsByHackathonId(hackathonId: string): Promise<Team[]> {
  try {
    if (!hackathonId) {
      console.warn("No hackathonId provided, returning empty teams array")
      return []
    }
    
    console.log(`Fetching teams for hackathon ID: ${hackathonId}`)
    const response = await hackathonApiClient.get<{ teams: Team[] } | Team[] | any>(`/team/`)
    console.log("Raw hackathon teams response:", response)
    
    // Get current user ID for displaying team members
    const userProfile = typeof window !== 'undefined' ? localStorage.getItem("user_profile.ID") : null
    
    let teamsArray: any[] = []
    
    // Check if response has a teams property
    if (response && response.teams && Array.isArray(response.teams)) {
      teamsArray = response.teams
    } else if (Array.isArray(response)) {
      teamsArray = response
    } else if (response && typeof response === 'object') {
      teamsArray = [response] // Handle case when single team is returned
    }
    
    // Filter teams for this hackathon
    const filteredTeams = teamsArray.filter(team => 
      team.hackathon_id === hackathonId || team.hackathonId === hackathonId
    )
    
    // Map API response to our Team type
    return filteredTeams.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description || team.name,
      hackathonId: team.hackathon_id || team.hackathonId || hackathonId,
      members: team.hacker_ids ? team.hacker_ids.map((id: string) => ({
        id,
        name: userProfile && id === userProfile ? "Вы" : `Участник ${id.substring(0, 4)}`,
        role: id === (team.ownerID || team.owner_id) ? 'Владелец' : 'Участник'
      })) : [],
      ownerID: team.ownerID || team.owner_id,
      max_size: team.max_size,
      hacker_ids: team.hacker_ids
    }))
  } catch (error: unknown) {
    console.error(`Не удалось загрузить команды для хакатона ${hackathonId}:`, error)
    
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
    
    throw new Error('Не удалось загрузить команды хакатона. Пожалуйста, попробуйте позже.')
  }
} 