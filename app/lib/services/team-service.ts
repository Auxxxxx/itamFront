import { hackathonApiClient } from './api-client'
import type { Team } from '../types/team'

export async function getTeams(): Promise<Team[]> {
  try {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      console.warn("No userId found, returning empty teams array")
      return []
    }
    
    console.log("Fetching teams for user ID:", userId)
    const response = await hackathonApiClient.get<{ teams: Team[] } | Team[] | any>('/teams')
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
      if (team.ownerID === userId || team.owner_id === userId) return true;
      
      // Check if user is in hacker_ids array
      if (team.hacker_ids && Array.isArray(team.hacker_ids) && team.hacker_ids.includes(userId)) return true;
      
      // Check if user is in members array
      if (team.members && Array.isArray(team.members)) {
        return team.members.some(member => 
          typeof member === 'string' 
            ? member === userId 
            : member.id === userId
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
        name: id === userId ? "Вы" : `Участник ${id.substring(0, 4)}`,
        role: id === (team.ownerID || team.owner_id) ? 'Владелец' : 'Участник'
      })) : [],
      // Add other properties from the API
      ownerID: team.ownerID || team.owner_id,
      max_size: team.max_size,
      hacker_ids: team.hacker_ids
    }))
  } catch (error) {
    console.error('Не удалось загрузить команды:', error)
    throw new Error('Не удалось загрузить команды. Пожалуйста, попробуйте позже.')
  }
}

export async function getTeamById(id: string): Promise<Team> {
  try {
    const response = await hackathonApiClient.get<Team | any>(`/teams/${id}`)
    
    // Handle response in the format returned by the API
    if (response && response.id && response.hacker_ids) {
      return {
        id: response.id,
        name: response.name,
        description: response.name, // Use name as description if missing
        hackathonId: response.hackathonId || '1', // Default hackathonId if missing
        members: response.hacker_ids ? response.hacker_ids.map((id: string) => ({
          id,
          name: `Участник ${id.substring(0, 4)}`,
          role: id === response.ownerID ? 'Владелец' : 'Участник'
        })) : [],
        // Add other properties from the API
        ownerID: response.ownerID,
        max_size: response.max_size,
        hacker_ids: response.hacker_ids
      }
    }
    
    return response
  } catch (error) {
    console.error(`Не удалось загрузить команду ${id}:`, error)
    throw new Error('Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.')
  }
}

export async function createTeam(teamData: Partial<Team>): Promise<Team> {
  try {
    console.log('Creating team with data:', teamData)
    
    // Ensure required fields are present
    if (!teamData.name || !teamData.hackathonId || !teamData.ownerID) {
      console.error('Missing required fields for team creation')
      throw new Error('Не удалось создать команду: отсутствуют обязательные поля')
    }
    
    // Prepare payload in the format expected by the API
    const payload = {
      name: teamData.name,
      hackathon_id: teamData.hackathonId, // Use snake_case for API
      owner_id: teamData.ownerID, // Use snake_case for API
      max_size: teamData.max_size || 5,
      hacker_ids: teamData.hacker_ids || [teamData.ownerID],
      description: teamData.description || teamData.name
    }
    
    console.log('Sending team creation request with payload:', payload)
    const response = await hackathonApiClient.post<Team>('/teams', payload)
    console.log('Team creation response:', response)
    
    // If the API doesn't return proper ID, generate one for frontend use
    if (!response || !response.id) {
      console.warn('API did not return team ID, generating temporary ID')
      return {
        id: `temp-${Date.now()}`,
        name: teamData.name || '',
        description: teamData.description || teamData.name || '',
        hackathonId: teamData.hackathonId || '',
        members: teamData.members || [],
        ownerID: teamData.ownerID,
        hacker_ids: teamData.hacker_ids || [teamData.ownerID || '']
      }
    }
    
    return response
  } catch (error) {
    console.error('Не удалось создать команду:', error)
    // Try with a mock response for testing if the API is not working
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('Returning mock team in development mode')
      return {
        id: `temp-${Date.now()}`,
        name: teamData.name || '',
        description: teamData.description || teamData.name || '',
        hackathonId: teamData.hackathonId || '',
        members: teamData.members || [],
        ownerID: teamData.ownerID,
        hacker_ids: teamData.hacker_ids || [teamData.ownerID || '']
      }
    }
    throw new Error('Не удалось создать команду. Пожалуйста, проверьте данные и попробуйте снова.')
  }
}

export async function joinTeam(teamId: string, userId: string): Promise<void> {
  try {
    await hackathonApiClient.post('/teams/members', { teamId, userId })
  } catch (error) {
    console.error(`Не удалось присоединиться к команде ${teamId}:`, error)
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
    const response = await hackathonApiClient.get<{ teams: Team[] } | Team[] | any>(`/teams/hackathon/${hackathonId}`)
    console.log("Raw hackathon teams response:", response)
    
    let teamsArray: any[] = []
    
    // Check if response has a teams property
    if (response && response.teams && Array.isArray(response.teams)) {
      teamsArray = response.teams
    } else if (Array.isArray(response)) {
      teamsArray = response
    } else if (response && typeof response === 'object') {
      teamsArray = [response] // Handle case when single team is returned
    }
    
    // Map API response to our Team type
    return teamsArray.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description || team.name,
      hackathonId: team.hackathon_id || team.hackathonId || hackathonId,
      members: team.hacker_ids ? team.hacker_ids.map((id: string) => ({
        id,
        name: `Участник ${id.substring(0, 4)}`,
        role: id === (team.ownerID || team.owner_id) ? 'Владелец' : 'Участник'
      })) : [],
      ownerID: team.ownerID || team.owner_id,
      max_size: team.max_size,
      hacker_ids: team.hacker_ids
    }))
  } catch (error) {
    console.error(`Не удалось загрузить команды для хакатона ${hackathonId}:`, error)
    
    // Instead of propagating the error, return an empty array
    // This handles the case when the API endpoint doesn't exist yet
    console.log("Returning empty array due to API error")
    return []
  }
} 