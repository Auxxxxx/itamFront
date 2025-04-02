# Lib Directory

This directory contains utility functions, services, and types that are used throughout the application. It serves as a central place for shared code that doesn't fit into the Next.js App Router's conventional directories.

## Directory Structure

- `/services` - API service modules for different features
- `/types` - Shared TypeScript interfaces and types
- `/utils.ts` - General utility functions

## Code Style Guidelines

### Utility Functions

- Use pure functions when possible
- Prefer named function declarations over arrow functions
- Implement proper TypeScript typing for parameters and return values
- Keep functions small and focused on a single responsibility

```typescript
// Good
export function formatDate(date: Date, format = 'yyyy-MM-dd'): string {
  // Implementation
}

// Avoid
export const formatDate = (date, format = 'yyyy-MM-dd') => {
  // Implementation with mixed responsibilities
}
```

### Type Definitions

- Use interfaces for object shapes that might be extended
- Use type aliases for union types, intersections, and complex types
- Export types that are used across multiple files
- Use descriptive names that indicate the purpose of the type

```typescript
// Object shape - use interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Union type - use type alias
export type UserRole = 'admin' | 'user' | 'guest'

// Complex type - use type alias
export type ApiResponse<T> = {
  data: T
  status: number
  message: string
  success: boolean
}
```

### Constants

- Use uppercase for constant values
- Group related constants in objects
- Export constants that are used across the application

```typescript
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  USERS: {
    GET: '/api/users',
    CREATE: '/api/users'
  }
}
```

### Error Handling

- Create reusable error handling utilities
- Use typed error objects
- Implement proper error logging
- Provide user-friendly error messages

```typescript
export interface ApiError {
  message: string
  code: string
  status: number
}

export function handleApiError(error: unknown): ApiError {
  console.error('API Error:', error)
  
  if (error instanceof Response) {
    return {
      message: 'Server error occurred',
      code: 'SERVER_ERROR',
      status: error.status
    }
  }
  
  return {
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500
  }
}
```

### Importing and Exporting

- Use named exports for most functions and types
- Use barrel exports in index.ts files to simplify imports
- Organize imports by external, internal, and relative sources
- Use absolute imports with the @ alias for paths from the project root

```typescript
// Good import organization
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { ApiResponse } from '@/lib/types'
import { handleApiError } from '@/lib/utils'

import { fetchData } from './api'
```

## Guidelines for Adding New Code

When adding new code to the lib directory:

1. Consider if the code is truly reusable and belongs in the lib directory
2. Follow the established patterns and naming conventions
3. Add appropriate documentation and types
4. Consider testability from the beginning
5. Avoid tight coupling with specific components or pages 