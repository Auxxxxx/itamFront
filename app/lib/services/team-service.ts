import { apiClient } from './api-client'
import type { Team, CreateTeamInput, AddMemberInput } from '../types/team'

export async function getTeams(userId: string): Promise<Team[]> {
  try {
    return await apiClient.get<Team[]>(`/teams?userId=${userId}`)
  } catch (error) {
    console.error('Failed to fetch teams:', error)
    throw new Error('Failed to load teams. Please try again later.')
  }
}

export async function getTeamById(id: string): Promise<Team> {
  try {
    return await apiClient.get<Team>(`/teams/${id}`)
  } catch (error) {
    console.error(`Failed to fetch team ${id}:`, error)
    throw new Error('Failed to load team details. Please try again later.')
  }
}

export async function createTeam(teamData: CreateTeamInput): Promise<Team> {
  try {
    return await apiClient.post<Team>('/teams', teamData)
  } catch (error) {
    console.error('Failed to create team:', error)
    throw new Error('Failed to create team. Please try again later.')
  }
}

export async function addMemberToTeam(data: AddMemberInput): Promise<Team> {
  try {
    return await apiClient.post<Team>('/teams/members', data)
  } catch (error) {
    console.error('Failed to add member to team:', error)
    throw new Error('Failed to add member. Please try again later.')
  }
} 