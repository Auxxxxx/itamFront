import { hackathonApiClient } from './api-client'
import type { Hackathon, ApiHackathon } from '../types/hackathon'
import { mapApiHackathonToHackathon } from '../types/hackathon'

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    const response = await hackathonApiClient.get<{hackathons: ApiHackathon[]} | ApiHackathon[] | any>('/hackathon')
    console.log('Raw hackathons response:', response)
    
    // Handle nested response structure {hackathons: [...]}
    let apiHackathons: ApiHackathon[] = [];
    if (typeof response === 'object' && !Array.isArray(response) && Array.isArray(response.hackathons)) {
      console.log('Extracted hackathons array from response', response.hackathons.length)
      apiHackathons = response.hackathons;
    } else if (Array.isArray(response)) {
      apiHackathons = response;
    }
    
    // Map API hackathons to our internal format
    const hackathons = apiHackathons.map(mapApiHackathonToHackathon);
    console.log('Mapped hackathons:', hackathons.length);
    
    return hackathons;
  } catch (error) {
    console.error('Не удалось загрузить хакатоны:', error)
    throw new Error('Не удалось загрузить хакатоны. Пожалуйста, попробуйте позже.')
  }
}

export async function getHackathonById(id: string): Promise<Hackathon> {
  try {
    const apiHackathon = await hackathonApiClient.get<ApiHackathon>(`/hackathon/${id}`)
    return mapApiHackathonToHackathon(apiHackathon)
  } catch (error) {
    console.error(`Не удалось загрузить хакатон ${id}:`, error)
    throw new Error('Не удалось загрузить детали хакатона. Пожалуйста, попробуйте позже.')
  }
}