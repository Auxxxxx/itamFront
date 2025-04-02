# Types Directory

This directory contains TypeScript type definitions and interfaces used throughout the application. It provides a centralized location for shared types to ensure consistency across the codebase.

## Structure

- Each domain entity should have its own file (e.g., `team.ts`, `hackathon.ts`)
- Global types should be placed in dedicated files based on their purpose

## Naming Conventions

- Use PascalCase for type and interface names
- Use camelCase for properties
- Suffix API response types with `Response` (e.g., `TeamResponse`)
- Suffix API request payloads with `Payload` (e.g., `CreateTeamPayload`)
- Prefix mapping functions with `map` (e.g., `mapApiTeamToTeam`)

## Best Practices

### Type Definitions

- Use interfaces for object shapes that might be extended
- Use type aliases for union types and complex types
- Export types that are used across multiple files
- Keep types focused on a single responsibility

```typescript
// Example of a well-structured type definition
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export type UserRole = 'admin' | 'user' | 'guest'
```

### Data Mapping

- Include mapping functions in the same file as the types they transform
- Make mapping functions pure with no side effects
- Handle edge cases and nullable values gracefully

```typescript
// Example of a mapping function
export function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name || 'Unknown',
    email: apiUser.email,
    role: validateUserRole(apiUser.role)
  }
}

function validateUserRole(role: string): UserRole {
  const validRoles: UserRole[] = ['admin', 'user', 'guest']
  return validRoles.includes(role as UserRole) 
    ? (role as UserRole) 
    : 'guest'
}
```

### API Response Types

- Mirror the actual API response structure
- Include all possible properties, even if optional
- Document any inconsistencies or variations in API responses

```typescript
export interface ApiUserResponse {
  id: string
  name?: string
  email: string
  role?: string
  // Additional properties that might be returned by the API
  created_at?: string
  updated_at?: string
}
```

### Type Guards

- Use type guards to narrow types at runtime
- Implement validation functions to ensure type safety

```typescript
export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string'
  )
}
```

### Generic Types

- Use generic types for reusable type patterns
- Provide clear constraints for generic type parameters

```typescript
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

## Guidelines for Adding New Types

When adding new types:

1. Consider where the type should live (domain-specific file or shared)
2. Follow the established naming conventions
3. Add JSDoc comments for complex types
4. Include mapping functions if the type transforms API data
5. Export the type if it's used outside the file 