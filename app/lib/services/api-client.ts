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

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong',
        response.status,
        data.code
      )
    }

    return data as T
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