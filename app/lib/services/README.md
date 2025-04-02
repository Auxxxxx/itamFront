# Services Directory

This directory contains service modules that handle API communication and data transformations for the application.

## Code Style Guidelines

### Function Structure

- Use named functions with descriptive names following the pattern: `getResource`, `createResource`, etc.
- Place error handling at the beginning of functions using early returns
- Put the "happy path" at the end of the function for improved readability
- Use TypeScript for all function signatures

```typescript
export async function getResource(id: string): Promise<Resource> {
  // Validation first
  if (!id) throw new Error('ID is required')
  
  try {
    // Happy path - direct API call to external endpoint
    const response = await fetch(`${API_BASE_URL}/resource/${id}`)
    
    // Response validation
    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    // Error handling
    handleApiError(error)
  }
}
```

### Error Handling

- Use custom error handlers for common errors
- Prefer specific error messages that describe the action that failed
- Log errors to console for debugging
- Return user-friendly error messages that can be displayed in the UI

### API Communication

- Always use direct calls to external API endpoints
- Define API base URLs as constants at the top of files
- Include authorization headers consistently
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Validate API responses before returning them

### Data Transformation

- Create helper functions for repetitive data transformations
- Use explicit typing for API responses and transformations
- Keep transformation logic separate from API request logic
- Handle inconsistent API response formats gracefully

### Type Safety

- Define interfaces for all API request payloads and responses
- Use specific types rather than `any` wherever possible
- Export types that are used across multiple files

## File Structure

Each service file should follow this structure:

1. Imports
2. Constants (API URLs, error messages)
3. Helper functions and types
4. Main service functions
5. Data transformation functions

## External APIs

The application interfaces with multiple backend services:

- Hackathons API: `http://45.10.41.58:8000` 
- Events API: `http://45.10.41.58:8002`
- Mentorship API: `http://45.10.41.58:8001`
- Auth API: `http://45.10.41.58:8080`

Always use direct API calls to these endpoints rather than creating proxy API routes.

## Testing

Services should be designed to be testable:
- Functions should have clear inputs and outputs
- Side effects should be isolated and mockable
- Error cases should be handled consistently 