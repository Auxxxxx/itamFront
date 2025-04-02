import { apiClient, ApiError } from './api-client'
import type { Mentor, MentorTime, MentorTimeReservation, User } from '../types/mentor'

// Mentorship API client
const MENTOR_API_BASE_URL = 'http://45.10.41.58:8000'
const mentorApiClient = apiClient

export async function getMentors(): Promise<Mentor[]> {
  try {
    return await mentorApiClient.get<Mentor[]>('/mentors')
  } catch (error) {
    console.error('Error fetching mentors:', error)
    throw error
  }
}

export async function getMentor(mentorId: number): Promise<Mentor> {
  try {
    return await mentorApiClient.get<Mentor>(`/mentors/${mentorId}`)
  } catch (error) {
    console.error(`Error fetching mentor ${mentorId}:`, error)
    throw error
  }
}

export async function createMentor(mentor: Omit<Mentor, 'id' | 'created' | 'lastUpdate'>): Promise<Mentor> {
  try {
    return await mentorApiClient.post<Mentor>('/mentors', mentor)
  } catch (error) {
    console.error('Error creating mentor:', error)
    throw error
  }
}

export async function updateMentor(mentorId: number, mentor: Partial<Mentor>): Promise<Mentor> {
  try {
    return await mentorApiClient.put<Mentor>(`/mentors/${mentorId}`, mentor)
  } catch (error) {
    console.error(`Error updating mentor ${mentorId}:`, error)
    throw error
  }
}

export async function getMentorTimes(mentorId: number): Promise<MentorTime[]> {
  try {
    return await mentorApiClient.get<MentorTime[]>(`/mentors/${mentorId}/times`)
  } catch (error) {
    console.error(`Error fetching mentor times for mentor ${mentorId}:`, error)
    throw error
  }
}

export async function createMentorTime(mentorTime: Omit<MentorTime, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTime> {
  try {
    return await mentorApiClient.post<MentorTime>('/mentor-times', mentorTime)
  } catch (error) {
    console.error('Error creating mentor time:', error)
    throw error
  }
}

export async function updateMentorTime(mentorTimeId: number, mentorTime: Partial<MentorTime>): Promise<MentorTime> {
  try {
    return await mentorApiClient.put<MentorTime>(`/mentor-times/${mentorTimeId}`, mentorTime)
  } catch (error) {
    console.error(`Error updating mentor time ${mentorTimeId}:`, error)
    throw error
  }
}

export async function reserveMentorTime(reservation: Omit<MentorTimeReservation, 'id' | 'created' | 'lastUpdate'>): Promise<MentorTimeReservation> {
  try {
    return await mentorApiClient.post<MentorTimeReservation>('/reservations', reservation)
  } catch (error) {
    console.error('Error reserving mentor time:', error)
    throw error
  }
}

export async function getUserReservations(userId: number): Promise<MentorTimeReservation[]> {
  try {
    return await mentorApiClient.get<MentorTimeReservation[]>(`/users/${userId}/reservations`)
  } catch (error) {
    console.error(`Error fetching reservations for user ${userId}:`, error)
    throw error
  }
}

export async function getMentorReservations(mentorId: number): Promise<MentorTimeReservation[]> {
  try {
    return await mentorApiClient.get<MentorTimeReservation[]>(`/mentors/${mentorId}/reservations`)
  } catch (error) {
    console.error(`Error fetching reservations for mentor ${mentorId}:`, error)
    throw error
  }
}

export async function updateReservation(reservationId: number, reservation: Partial<MentorTimeReservation>): Promise<MentorTimeReservation> {
  try {
    return await mentorApiClient.put<MentorTimeReservation>(`/reservations/${reservationId}`, reservation)
  } catch (error) {
    console.error(`Error updating reservation ${reservationId}:`, error)
    throw error
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    return await mentorApiClient.get<User>('/users/me')
  } catch (error) {
    console.error('Error fetching current user:', error)
    throw error
  }
} 