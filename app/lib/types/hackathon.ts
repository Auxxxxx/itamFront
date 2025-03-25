export interface Hackathon {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  location?: string
  status: 'upcoming' | 'active' | 'completed'
} 