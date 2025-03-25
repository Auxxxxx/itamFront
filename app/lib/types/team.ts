import type { User } from './user'

export interface Team {
  id: string
  name: string
  description: string
  hackathonId: string
  members: User[]
  leaderId: string
}

export interface CreateTeamInput {
  name: string
  description: string
  hackathonId: string
}

export interface AddMemberInput {
  teamId: string
  userId: string
} 