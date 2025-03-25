import { apiClient } from './api-client'
import type { Hackathon } from '../types/hackathon'

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    return await apiClient.get<Hackathon[]>('/hackathons')
  } catch (error) {
    console.error('Failed to fetch hackathons:', error)
    throw new Error('Failed to load hackathons. Please try again later.')
  }
}

export async function getHackathonById(id: string): Promise<Hackathon> {
  try {
    return await apiClient.get<Hackathon>(`/hackathons/${id}`)
  } catch (error) {
    console.error(`Failed to fetch hackathon ${id}:`, error)
    throw new Error('Failed to load hackathon details. Please try again later.')
  }
} 