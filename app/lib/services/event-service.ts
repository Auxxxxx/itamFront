import { eventApiClient } from './api-client';

// Event service interfaces
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registered_count?: number;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface CoworkingSpace {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  opening_hours: string;
  closing_hours: string;
  status: 'open' | 'closed' | 'maintenance';
}

export interface CoworkingReservation {
  id: string;
  space_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  image_url?: string;
}

// Mock data for fallback
let mockEvents: Event[] = [
  {
    id: "1",
    title: "IT Conference 2023",
    description: "Annual conference for IT professionals featuring workshops, keynotes, and networking opportunities.",
    date: "2023-12-15",
    location: "Москва",
    capacity: 200,
    registered_count: 150,
    image_url: "/images/placeholder.jpg",
    status: "upcoming"
  },
  {
    id: "2",
    title: "Web Development Workshop",
    description: "Hands-on workshop focused on modern web development techniques and best practices.",
    date: "2023-12-22",
    location: "Санкт-Петербург",
    capacity: 50,
    registered_count: 35,
    image_url: "/images/placeholder.jpg",
    status: "upcoming"
  },
  {
    id: "3",
    title: "AI and Machine Learning Summit",
    description: "Explore the latest advancements in AI and machine learning with industry experts.",
    date: "2024-01-10",
    location: "Онлайн",
    capacity: 500,
    registered_count: 230,
    image_url: "/images/placeholder.jpg",
    status: "upcoming"
  },
  {
    id: "4",
    title: "Cybersecurity Symposium",
    description: "Learn about the latest trends and challenges in cybersecurity from leading professionals.",
    date: "2024-01-25",
    location: "Казань",
    capacity: 150,
    registered_count: 120,
    image_url: "/images/placeholder.jpg",
    status: "upcoming"
  }
];

const mockCoworkingSpaces: CoworkingSpace[] = [
  {
    id: "1",
    name: "Tech Hub",
    location: "Москва, ул. Тверская, 15",
    capacity: 50,
    amenities: ["Wi-Fi", "Кофе", "Принтер", "Переговорные комнаты"],
    opening_hours: "09:00",
    closing_hours: "21:00",
    status: "open"
  },
  {
    id: "2",
    name: "Innovation Space",
    location: "Санкт-Петербург, Невский проспект, 30",
    capacity: 35,
    amenities: ["Wi-Fi", "Кухня", "Проектор", "Тихие зоны"],
    opening_hours: "08:00",
    closing_hours: "22:00",
    status: "open"
  },
  {
    id: "3",
    name: "Digital Workspace",
    location: "Казань, ул. Баумана, 5",
    capacity: 40,
    amenities: ["Wi-Fi", "Кофе", "Столы для пинг-понга", "Зона отдыха"],
    opening_hours: "10:00",
    closing_hours: "20:00",
    status: "open"
  }
];

// Mock data for create event fallback
const mockCreatedEvent: Event = {
  id: "new-event-id",
  title: "Новое мероприятие",
  description: "Описание нового мероприятия",
  date: new Date().toISOString().split('T')[0],
  location: "Москва",
  capacity: 50,
  registered_count: 0,
  image_url: "/images/placeholder.jpg",
  status: "upcoming"
};

// Event service API functions
export async function getAllEvents(): Promise<Event[]> {
  try {
    const events = await eventApiClient.get<Event[]>('/events');
    console.log('Fetched events:', events);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data if API call fails
    return mockEvents;
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const event = await eventApiClient.get<Event>(`/events/${eventId}`);
    return event;
  } catch (error) {
    console.error(`Error fetching event with id ${eventId}:`, error);
    // Find event in mock data if API call fails
    const mockEvent = mockEvents.find(e => e.id === eventId);
    return mockEvent || null;
  }
}

export async function registerForEvent(eventId: string): Promise<EventRegistration | null> {
  try {
    // Get user ID from localStorage
    const userProfileStr = localStorage.getItem('user_profile');
    let userId: string | null = null;
    
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userId = userProfile?.ID || null;
    }
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const registration = await eventApiClient.post<EventRegistration>('/event-registrations', {
      event_id: eventId,
      user_id: userId
    });
    
    return registration;
  } catch (error) {
    console.error(`Error registering for event ${eventId}:`, error);
    return null;
  }
}

export async function getUserEventRegistrations(): Promise<EventRegistration[]> {
  try {
    // Get user ID from localStorage
    const userProfileStr = localStorage.getItem('user_profile');
    let userId: string | null = null;
    
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userId = userProfile?.ID || null;
    }
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const registrations = await eventApiClient.get<EventRegistration[]>(`/user-registrations/${userId}`);
    return registrations;
  } catch (error) {
    console.error('Error fetching user event registrations:', error);
    return [];
  }
}

// Coworking service API functions
export async function getAllCoworkingSpaces(): Promise<CoworkingSpace[]> {
  try {
    const spaces = await eventApiClient.get<CoworkingSpace[]>('/coworking/spaces');
    return spaces;
  } catch (error) {
    console.error('Error fetching coworking spaces:', error);
    // Return mock data if API call fails
    return mockCoworkingSpaces;
  }
}

export async function getCoworkingSpaceById(spaceId: string): Promise<CoworkingSpace | null> {
  try {
    const space = await eventApiClient.get<CoworkingSpace>(`/coworking/spaces/${spaceId}`);
    return space;
  } catch (error) {
    console.error(`Error fetching coworking space with id ${spaceId}:`, error);
    // Find space in mock data if API call fails
    const mockSpace = mockCoworkingSpaces.find(s => s.id === spaceId);
    return mockSpace || null;
  }
}

export async function reserveCoworkingSpace(
  spaceId: string, 
  startTime: string, 
  endTime: string
): Promise<CoworkingReservation | null> {
  try {
    // Get user ID from localStorage
    const userProfileStr = localStorage.getItem('user_profile');
    let userId: string | null = null;
    
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userId = userProfile?.ID || null;
    }
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const reservation = await eventApiClient.post<CoworkingReservation>('/coworking/reservations', {
      space_id: spaceId,
      user_id: userId,
      start_time: startTime,
      end_time: endTime
    });
    
    return reservation;
  } catch (error) {
    console.error(`Error reserving coworking space ${spaceId}:`, error);
    return null;
  }
}

export async function getUserCoworkingReservations(): Promise<CoworkingReservation[]> {
  try {
    // Get user ID from localStorage
    const userProfileStr = localStorage.getItem('user_profile');
    let userId: string | null = null;
    
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userId = userProfile?.ID || null;
    }
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const reservations = await eventApiClient.get<CoworkingReservation[]>(`/coworking/user-reservations/${userId}`);
    return reservations;
  } catch (error) {
    console.error('Error fetching user coworking reservations:', error);
    return [];
  }
}

export async function createEvent(eventData: CreateEventRequest): Promise<Event> {
  try {
    const userProfile = localStorage.getItem('user_profile');
    if (!userProfile) {
      throw new Error('User not authenticated');
    }

    const userProfileData = JSON.parse(userProfile);
    const userId = userProfileData?.ID;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    // Include the user ID in the request
    const requestData = {
      ...eventData,
      organizer_id: userId,
      status: 'upcoming' // Default status for new events
    };
    
    console.log('Creating event with data:', requestData);
    
    const response = await eventApiClient.post<Event>('/events', requestData);
    console.log('Event created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating event:', error);
    // If it's a network error or server error, show the mock data
    // but for validation errors, we should rethrow to show the specific error message
    if (error instanceof Error && (
      error.message.includes('User not authenticated') || 
      error.message.includes('User ID not found')
    )) {
      throw error;
    }
    
    console.log('Returning mock event data due to API error');
    // Return mock data if API call fails
    const newEvent: Event = {
      ...mockCreatedEvent,
      id: `mock-${Date.now()}`, // Generate a unique ID
      title: eventData.title || mockCreatedEvent.title,
      description: eventData.description || mockCreatedEvent.description,
      date: eventData.date || mockCreatedEvent.date,
      location: eventData.location || mockCreatedEvent.location,
      capacity: eventData.capacity || mockCreatedEvent.capacity,
      image_url: eventData.image_url || mockCreatedEvent.image_url,
      registered_count: 0, // New event has 0 registrations
      status: 'upcoming' // Default status for new events as defined in the Event type
    };
    
    // Add the new event to mock data for future getAllEvents calls
    mockEvents = [newEvent, ...mockEvents];
    
    return newEvent;
  }
} 