# Routes Directory

This directory contains page components organized according to the Next.js App Router architecture. Each subdirectory corresponds to a route in the application.

## Directory Structure

Each route follows this structure:
- `page.tsx` - The main page component rendered at the route
- `layout.tsx` (optional) - Layout wrapper for the route and its children
- `loading.tsx` (optional) - Loading state component
- `error.tsx` (optional) - Error handling component
- Additional component files specific to the route

## Code Style Guidelines

### Page Components

- Use Server Components by default
- Add 'use client' directive only when necessary for client interactivity
- Follow a simple, declarative structure
- Keep pages as thin as possible, delegating business logic to services

### Client Components

When client interactivity is needed, follow these guidelines:

- Add 'use client' directive at the top of the file
- Keep client components focused on UI interactivity
- Use hooks for state management
- Delegate data fetching to server components or server actions where possible

### Server Actions

- Define server actions in separate files with the 'use server' directive
- Use Zod for input validation
- Implement proper error handling
- Return structured responses for client consumption

### Layouts

- Use layouts to share UI elements between related routes
- Keep layouts simple and focused on structure
- Implement error boundaries at appropriate levels

### Error Handling

- Implement error.tsx files for route-specific error handling
- Use proper error boundaries
- Provide user-friendly error messages
- Log errors for debugging

## Best Practices

1. **Data Fetching**:
   - Fetch data directly in Server Components where possible
   - Use React Server Components (RSC) for initial data loading
   - Implement Suspense boundaries for a better loading experience

2. **Form Handling**:
   - Use React Hook Form with Zod for form validation
   - Implement server actions for form submission
   - Provide proper client-side validation and feedback

3. **Navigation**:
   - Use Next.js Link component for client-side navigation
   - Implement proper loading states during navigation
   - Add prefetching for frequently accessed routes

4. **Error Handling**:
   - Implement both global and route-specific error boundaries
   - Provide user-friendly error messages
   - Implement proper error logging

5. **Accessibility**:
   - Ensure proper heading hierarchy (h1, h2, etc.)
   - Use semantic HTML elements
   - Implement keyboard navigation
   - Add appropriate ARIA attributes 