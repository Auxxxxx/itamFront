export interface Mentor {
  id: number
  userId: number
  firstName: string
  lastName: string
  avatar?: string
  email: string
  bio?: string
  expertise?: string[]
  available: boolean
  created: string
  lastUpdate: string
}

export interface MentorTime {
  id: number
  mentorId: number
  startTime: string
  endTime: string
  isAvailable: boolean
  type: 'call' | 'chat'
  created: string
  lastUpdate: string
}

export interface MentorTimeReservation {
  id: number
  mentorTimeId: number
  menteeId: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  topic?: string
  created: string
  lastUpdate: string
}

export interface User {
  id: number
  token: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  created: string
  lastUpdate: string
  privacyAccepted: boolean
  approved: boolean
}

export interface MentorProfileFormData {
  firstName: string
  lastName: string
  email: string
  bio: string
  expertise: string[]
} 