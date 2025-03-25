# Hackathon Team Management Platform

A frontend application for managing hackathons and teams, designed to be extensible for future services.

## Features

- User login with user ID
- Browse available hackathons
- View hackathon details
- Create teams for hackathons
- View your teams
- Manage team members

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Built-in Next.js API routes (for development)

## Project Structure

```
/app
  /api                 - API routes for development
    /hackathons        - Hackathon-related endpoints
    /teams             - Team-related endpoints
  /(routes)            - Application routes
    /dashboard         - Dashboard page
    /hackathons        - Hackathon listing and details
    /teams             - Team listing and details
  /components          - React components
    /hackathons        - Hackathon-specific components
    /teams             - Team-specific components
    /ui                - Reusable UI components
  /lib                 - Shared utilities and services
    /services          - API service functions
    /types             - TypeScript type definitions
    /utils             - Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hackathon-platform.git
cd hackathon-platform
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The project currently uses mock data through Next.js API routes. In a production environment, you would replace the API calls in the service files to point to your actual backend service:

- `/app/lib/services/hackathon-service.ts`
- `/app/lib/services/team-service.ts`

## Extensibility

The application is designed to be extensible for future services:

1. **Service Modules**: Each service has its own directory under `/app/lib/services`
2. **Type Definitions**: Clear type definitions in `/app/lib/types`
3. **API Client**: Generic API client in `/app/lib/services/api-client.ts` can be configured for different services
4. **Component Structure**: Components are organized by domain, making it easy to add new features

## License

MIT 