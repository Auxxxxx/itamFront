export interface ApiHackathon {
  id: string
  name: string
  task_description: string
  start_of_registration: string
  end_of_registration: string
  start_of_hack: string
  end_of_hack: string
  amount_money: number
  type: string
}

export interface Hackathon {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  status: 'upcoming' | 'active' | 'completed' | string
  prize: number
}

// Convert API response format to our internal format
export function mapApiHackathonToHackathon(apiHackathon: ApiHackathon): Hackathon {
  // Determine status based on dates
  const now = new Date();
  const startDate = new Date(apiHackathon.start_of_hack);
  const endDate = new Date(apiHackathon.end_of_hack);
  
  let status: 'upcoming' | 'active' | 'completed';
  if (now < startDate) {
    status = 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    status = 'active';
  } else {
    status = 'completed';
  }
  
  return {
    id: apiHackathon.id,
    name: apiHackathon.name,
    description: apiHackathon.task_description,
    startDate: apiHackathon.start_of_hack,
    endDate: apiHackathon.end_of_hack,
    location: apiHackathon.type === 'online' ? 'Онлайн' : 
              apiHackathon.type === 'offline' ? 'Оффлайн' : 
              'Гибридный формат',
    status,
    prize: apiHackathon.amount_money
  };
} 