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
const API_BASE_URL = 'http://109.73.198.186:8000'

// Generic API client for service communication
function createApiClient(baseUrl: string = API_BASE_URL) {
  async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    console.log(`API Request: ${options.method || 'GET'} ${url}`)
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })
      
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
      
      console.log(`API Response status: ${response.status}`, 
                  typeof data === 'object' ? 'Data structure: ' + (Array.isArray(data) ? 'Array' : 'Object') : 'Raw data')
      
      if (!response.ok) {
        throw new ApiError(
          typeof data === 'object' && data?.message ? data.message : 'Что-то пошло не так',
          response.status,
          typeof data === 'object' && data?.code ? data.code : undefined
        )
      }
      
      // If we're expecting an array and got an object with data property that's an array,
      // return that directly (common API pattern)
      if (typeof data === 'object' && !Array.isArray(data)) {
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
export const hackathonApiClient = createApiClient(`${API_BASE_URL}`) 