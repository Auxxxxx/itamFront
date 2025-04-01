import { hackathonApiClient } from './api-client'
import { ApiError } from './api-client'

// Helper function to get user ID from localStorage
function getUserIdFromLocalStorage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userProfileString = localStorage.getItem('user_profile');
    if (!userProfileString) return null;
    
    const userProfile = JSON.parse(userProfileString);
    return userProfile?.ID || null;
  } catch (error) {
    console.error('Error parsing user_profile from localStorage:', error);
    return null;
  }
}

// Interface for the upsert hacker request
interface UpsertHackerRequest {
  user_id: string;
  name: string;
}

// Interface for the upsert hacker response
interface UpsertHackerResponse {
  id: string;
}

/**
 * Upserts the current user as a hacker in the system
 * Called when a user visits the hackathons tab
 */
export async function upsertCurrentHacker(): Promise<boolean> {
  try {
    // Get user ID from localStorage
    const userId = getUserIdFromLocalStorage();
    if (!userId) {
      console.warn('No user ID found in localStorage');
      return false;
    }
    
    // Get user display name (using "Пользователь" as fallback)
    let userName = 'Пользователь';
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile?.name) {
          userName = userProfile.name;
        }
      }
    } catch (error) {
      console.error('Error getting user name:', error);
    }
    
    // Prepare the request payload
    const payload: UpsertHackerRequest = {
      user_id: userId,
      name: userName
    };
    
    console.log('Upserting current user as hacker:', payload);
    
    // Use our local proxy API endpoint to avoid CORS issues
    const authToken = localStorage.getItem('auth_token');
    const response = await fetch('/api/hacker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Hacker upsert response:', data);
    
    return !!data?.id;
  } catch (error: unknown) {
    console.error('Error upserting user as hacker:', error);
    
    // Don't throw an error to the UI - this is a background operation
    return false;
  }
} 