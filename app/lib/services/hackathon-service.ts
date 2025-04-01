import { hackathonApiClient } from './api-client'
import type { Hackathon, ApiHackathon } from '../types/hackathon'
import { mapApiHackathonToHackathon } from '../types/hackathon'

// Fallback mock data for when the API is unavailable
const MOCK_HACKATHONS: ApiHackathon[] = [
  {
    id: "1",
    name: "IT Hack 2023",
    task_description: "Разработка инновационного решения для городской инфраструктуры",
    start_of_registration: "2023-09-01T00:00:00Z",
    end_of_registration: "2023-09-15T23:59:59Z",
    start_of_hack: "2023-09-20T10:00:00Z",
    end_of_hack: "2023-09-22T18:00:00Z",
    amount_money: 500000,
    type: "hybrid"
  },
  {
    id: "2",
    name: "FinTech Challenge",
    task_description: "Создание инновационного финансового сервиса для молодежи",
    start_of_registration: "2023-10-01T00:00:00Z",
    end_of_registration: "2023-10-20T23:59:59Z",
    start_of_hack: "2023-10-25T09:00:00Z",
    end_of_hack: "2023-10-27T19:00:00Z",
    amount_money: 300000,
    type: "online"
  },
  {
    id: "3",
    name: "HealthTech Hackathon",
    task_description: "Разработка решений для телемедицины и удаленного мониторинга пациентов",
    start_of_registration: "2023-11-05T00:00:00Z",
    end_of_registration: "2023-11-20T23:59:59Z",
    start_of_hack: "2023-11-25T10:00:00Z",
    end_of_hack: "2023-11-27T18:00:00Z",
    amount_money: 400000,
    type: "offline"
  }
]

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    console.log('Attempting to fetch hackathons from API...')
    const response = await hackathonApiClient.get<{hackathons: ApiHackathon[]} | ApiHackathon[] | any>('/hackathons')
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
    console.error('Не удалось загрузить хакатоны из API:', error)
    
    // Fallback to mock data
    console.log('Falling back to mock hackathon data')
    const mockHackathons = MOCK_HACKATHONS.map(mapApiHackathonToHackathon)
    return mockHackathons
  }
}

export async function getHackathonById(id: string): Promise<Hackathon> {
  try {
    const apiHackathon = await hackathonApiClient.get<ApiHackathon>(`/hackathons/${id}`)
    return mapApiHackathonToHackathon(apiHackathon)
  } catch (error) {
    console.error(`Не удалось загрузить хакатон ${id}:`, error)
    
    // Fallback to mock data if ID matches
    const mockHackathon = MOCK_HACKATHONS.find(h => h.id === id)
    if (mockHackathon) {
      console.log(`Falling back to mock data for hackathon ${id}`)
      return mapApiHackathonToHackathon(mockHackathon)
    }
    
    throw new Error('Не удалось загрузить детали хакатона. Пожалуйста, попробуйте позже.')
  }
}

/**
 * Adds a winning solution to a hackathon
 * @param hackathonId - The ID of the hackathon
 * @param solution - The winning solution details
 */
export async function addWinningSolution(
  hackathonId: string, 
  solution: { 
    teamId: string;
    solutionUrl: string;
    description: string;
  }
): Promise<void> {
  try {
    await hackathonApiClient.post(`/hackathons/${hackathonId}/winner`, solution)
  } catch (error) {
    console.error(`Не удалось добавить победное решение для хакатона ${hackathonId}:`, error)
    throw new Error('Не удалось добавить победное решение. Пожалуйста, попробуйте позже.')
  }
}