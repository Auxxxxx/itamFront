export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Backend service URL
const API_BASE_URL = 'http://45.10.41.58:8000'

// Generic API client for service communication
function createApiClient(baseUrl: string = API_BASE_URL) {
  async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`
    
    // Get JWT token from localStorage if we're in a browser environment
    let authToken: string | null = null;
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('auth_token');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers,
    }

    console.log(`API Request: ${options.method || 'GET'} ${url}`)
    if (options.body) {
      console.log(`Request body: ${options.body}`)
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })
      
      console.log(`API Response status: ${response.status}`)
      console.log(`API Response headers:`, Object.fromEntries([...response.headers.entries()]))
      
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json()
          console.log(`API JSON Response:`, data)
        } catch (e) {
          console.error('Error parsing JSON response:', e)
          const text = await response.text()
          console.log(`Failed JSON parse, raw response:`, text)
          data = null
        }
      } else {
        const text = await response.text()
        console.log(`API Text Response:`, text)
        
        // Try to parse as JSON anyway, sometimes servers send JSON without correct content-type
        try {
          data = JSON.parse(text)
          console.log(`Parsed text as JSON:`, data)
        } catch (e) {
          console.log(`Could not parse as JSON, using text`)
          data = text
        }
      }
      
      // Special handling for team creation success with empty response
      if (response.ok && options.method === 'POST' && endpoint.includes('/team')) {
        console.log('Special case: Team API response handling')
        
        // If we have data and it has an id, return it
        if (data && typeof data === 'object' && data.id) {
          console.log('Team created with ID:', data.id)
          return data as T
        }
        
        // Otherwise return a skeleton successful response
        console.log('No id returned, using temp-id')
        return { success: true, id: 'temp-id' } as unknown as T
      }
      
      console.log(`API Response processed:`, 
                  typeof data === 'object' ? 'Data structure: ' + (Array.isArray(data) ? 'Array' : 'Object') : 'Raw data')
      
      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data?.message 
          ? data.message 
          : typeof data === 'string' && data
            ? data
            : 'Что-то пошло не так'
            
        console.error('API Error details:', {
          status: response.status,
          url,
          method: options.method || 'GET',
          body: options.body,
          response: data
        })
            
        throw new ApiError(
          errorMessage,
          response.status,
          typeof data === 'object' && data?.code ? data.code : undefined
        )
      }
      
      // If we're expecting an array and got an object with data property that's an array,
      // return that directly (common API pattern)
      if (typeof data === 'object' && !Array.isArray(data)) {
        // Handle pagination response format with items array
        if (Array.isArray(data.items)) {
          console.log('Returning data.items array from response')
          return data.items as unknown as T
        }
        
        // Check for data array property (common pattern)
        if (Array.isArray(data.data)) {
          console.log('Returning data.data array from response')
          return data.data as unknown as T
        }
        
        // Check for hackathons array property (specific to this API)
        if (Array.isArray(data.hackathons)) {
          console.log('Returning data.hackathons array from response')
          return data.hackathons as unknown as T
        }
      }
      
      return data as T
    } catch (error) {
      console.error(`API Error for ${url}:`, error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Ошибка сети или сервера', 500)
    }
  }

  return {
    get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) =>
      fetchApi<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    put: <T>(endpoint: string, body: any) =>
      fetchApi<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, { method: 'DELETE' }),
  }
}

// Default API client
export const apiClient = createApiClient()

// Hackathon service client
export const hackathonApiClient = createApiClient() 