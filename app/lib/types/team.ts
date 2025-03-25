import type { User } from './user'

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  hackathonId: string;
  members: TeamMember[];
  // Additional properties from API
  ownerID?: string;
  max_size?: number;
  hacker_ids?: string[];
}

export interface CreateTeamInput {
  name: string;
  description: string;
  hackathonId: string;
}

export interface AddMemberInput {
  teamId: string;
  userId: string;
} 