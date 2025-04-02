# Components Directory

This directory contains reusable React components used throughout the application.

## Code Style Guidelines

### Component Declaration

- Use function declarations for components, not arrow functions
- Use named exports for components
- Follow PascalCase naming convention for component files and exports

```typescript
// Preferred
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// Avoid
const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>
}
```

### Component Structure

Each component file should follow this structure:
1. Import statements
2. Main component export
3. Sub-components (if applicable)
4. Helper functions
5. Static content variables
6. Type definitions and interfaces

```typescript
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Dropdown({ items, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>{label}</button>
      {isOpen && <DropdownMenu items={items} />}
    </div>
  )
}

// Sub-component
function DropdownMenu({ items }: { items: string[] }) {
  return (
    <ul className="absolute mt-1 border rounded shadow-sm">
      {items.map((item) => (
        <DropdownItem key={item} label={item} />
      ))}
    </ul>
  )
}

// Helper function
function DropdownItem({ label }: { label: string }) {
  return <li className="px-4 py-2 hover:bg-gray-100">{label}</li>
}

// Type definition
interface DropdownProps {
  items: string[]
  label: string
}
```

### State Management

- Keep state as local as possible
- Use appropriate hooks for state management (useState, useReducer)
- Prefer controlled components where possible
- Use custom hooks to encapsulate complex state logic

### Styling

- Use Tailwind CSS for styling components
- Apply styles using className prop
- Use the cn utility for conditional class names
- Compose styles with Tailwind's modifiers

### Props and Types

- Define explicit interfaces for component props
- Use descriptive prop names with auxiliary verbs (e.g., isLoading, hasError)
- Provide default values for optional props
- Use proper TypeScript types for all props

### Error Handling

- Handle edge cases with appropriate UI feedback
- Use error boundaries for catching rendering errors
- Provide fallback UI for error states

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Include appropriate ARIA attributes
- Test with keyboard navigation and screen readers

### Responsive Design

- Use mobile-first approach
- Implement breakpoints consistently
- Test on multiple device sizes

### Performance

- Use React.memo for expensive renders
- Avoid unnecessary re-renders
- Use virtualization for long lists
- Optimize event handlers with useCallback 