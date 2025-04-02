# ITAM Front

This is the frontend application for the ITAM platform, providing interfaces for hackathons, events, courses, and mentorship services.

## Project Structure

The application is built with Next.js 14 using the App Router architecture:

```
app/
├── (routes)/            # Route-specific page components
│   ├── hackathons/      # Hackathon-related pages
│   ├── events/          # Event-related pages
│   ├── courses/         # Course-related pages
│   └── mentorship/      # Mentorship-related pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions, services, and types
│   ├── services/        # API service modules
│   └── types/           # TypeScript type definitions
└── types/               # Global type definitions
```

## API Structure

The application directly interfaces with multiple backend services:

- Hackathons API: `http://45.10.41.58:8000` 
- Events API: `http://45.10.41.58:8002`
- Mentorship API: `http://45.10.41.58:8001`
- Auth API: `http://45.10.41.58:8080`

Each service module makes direct API calls to these endpoints without using proxy API routes.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (for containerized development)

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Docker Development

To run the application using Docker:

```bash
docker compose up -d
```

To restart after changes:

```bash
docker compose down
docker compose up -d
```

## Code Style Guidelines

### TypeScript & React

- Use functional components with TypeScript interfaces
- Follow functional, declarative programming patterns
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`)
- Prefer named exports for components
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)

### File Structure

Each file follows a consistent structure:

1. Imports (grouped by external, internal, and relative)
2. Constants (including API URLs, error messages)
3. Type definitions and interfaces
4. Helper functions
5. Main exports (components, functions, etc.)

### API Communication

- Make direct calls to external APIs with full URLs
- Define API base URLs as constants
- Include proper headers for authentication
- Handle CORS issues on the backend side
- Provide fallback data when API requests fail

### Component Style

- Use function declarations for components
- Place static content variables outside render functions
- Use JSDoc comments for props and complex functions
- Follow a mobile-first approach for responsive design

### Error Handling

- Handle errors at the beginning of functions using early returns
- Implement proper error boundaries
- Provide user-friendly error messages
- Log errors for debugging purposes

## Authentication

User authentication uses JWT tokens:

- Access token is stored in localStorage as `access_token`
- User profile is stored in localStorage as `user_profile`
- The user ID is accessed via `user_profile.ID`

## Data Handling

- Mock data is available as fallback when API requests fail
- All API requests should exactly match the API documentation
- API request formats should follow the documentation for each service

## Contributing

Please refer to the README.md files in each directory for specific guidelines about different parts of the application. 