import { hackathonApiClient } from './api-client'
import type { Team } from '../types/team'

export async function getTeams(): Promise<Team[]> {
  try {
    const response = await hackathonApiClient.get<{ teams: Team[] } | Team[] | any>('/team')
    
    // Check if response has a teams property (the format shown in the API)
    if (response && response.teams && Array.isArray(response.teams)) {
      return response.teams.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.name, // Use name as description if missing
        hackathonId: team.hackathonId || '1', // Default hackathonId if missing
        members: team.hacker_ids ? team.hacker_ids.map((id: string) => ({
          id,
          name: `Участник ${id.substring(0, 4)}`,
        })) : [],
        // Add other properties from the API
        ownerID: team.ownerID,
        max_size: team.max_size,
        hacker_ids: team.hacker_ids
      }))
    }
    
    // Fallback to the original format
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Не удалось загрузить команды:', error)
    throw new Error('Не удалось загрузить команды. Пожалуйста, попробуйте позже.')
  }
}

export async function getTeamById(id: string): Promise<Team> {
  try {
    const response = await hackathonApiClient.get<Team | any>(`/team/${id}`)
    
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
    return await hackathonApiClient.post<Team>('/team', teamData)
  } catch (error) {
    console.error('Не удалось создать команду:', error)
    throw new Error('Не удалось создать команду. Пожалуйста, проверьте данные и попробуйте снова.')
  }
}

export async function joinTeam(teamId: string, userId: string): Promise<void> {
  try {
    await hackathonApiClient.post('/team/members', { teamId, userId })
  } catch (error) {
    console.error(`Не удалось присоединиться к команде ${teamId}:`, error)
    throw new Error('Не удалось присоединиться к команде. Пожалуйста, попробуйте позже.')
  }
} 