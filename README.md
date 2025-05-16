# 10x-cards

A modern web application for creating, managing, and reviewing educational flashcards with AI assistance.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [Project Structure](#project-structure)
- [Database Structure](#database-structure)
- [Authentication](#authentication)
- [E2E Testing](#e2e-testing)
- [License](#license)

## Project Description

10x-cards is a web application that allows users to create, manage, and review educational flashcards. The application leverages LLM models (via API) to generate flashcard suggestions based on input text and integrates with the Leitner system for spaced repetition, ensuring effective learning.

### Key Features:

- **AI-powered flashcard generation**: Automatically generate high-quality flashcards from pasted text
- **Manual flashcard management**: Create, edit, and organize your own flashcards
- **User authentication**: Secure access to personalized flashcard sets
- **Leitner system integration**: Learn efficiently with a five-level spaced repetition algorithm that automatically adjusts review frequency based on your knowledge level
- **Performance tracking**: Monitor your learning progress and effectiveness with statistics for each Leitner level

## Tech Stack

### Frontend

- [Astro](https://astro.build/) v5.5.5
- [React](https://react.dev/) v19.0.0
- [TypeScript](https://www.typescriptlang.org/) v5.8.3
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17
- [Shadcn/UI](https://ui.shadcn.com/) - UI component library

### Backend

- [Supabase](https://supabase.com/) - Managed database and authentication
- [Node.js](https://nodejs.org/) adapter for Astro

### State Management

- [Zustand](https://github.com/pmndrs/zustand) v5.0.3 - State management solution

### AI Integration

- Ollama, OpenAI API, and Openrouter.ai for LLM capabilities

### Testing

- **Unit Testing:**

  - [Vitest](https://vitest.dev/) v1.3.1 - Fast unit test framework that integrates well with Astro
  - [Testing Library](https://testing-library.com/) v15.0.0 - For testing React components
  - [jsdom](https://github.com/jsdom/jsdom) v24.0.0 - DOM environment implementation for Node.js tests

- **End-to-End Testing:**

  - [Playwright](https://playwright.dev/) v1.43.1 - Modern E2E testing framework with Chrome browser
  - E2E tests use simplified MVP approach - focused on core functionality with single browser testing

- **CI/CD Tools:**
  - GitHub Actions - For test and deployment automation
  - v8 coverage - For code coverage reporting

### CI/CD & Hosting

- GitHub Actions
- Docker (locally or via DigitalOcean)

## Getting Started Locally

### Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/10x-cards.git
cd 10x-cards
```

2. Install dependencies:

```bash
npm install
```

3. Create an environment file:

```bash
cp .env.example .env
```

4. Update the environment variables in the `.env` file with your API keys and configuration.

5. Start the development server:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run auto-format` - Automatically format code with Prettier and fix ESLint issues
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests with Playwright on Chrome browser
- `npm run test:e2e:ui` - Run E2E tests with UI interface on Chrome browser
- `npm run test:e2e:debug` - Run E2E tests in debug mode on Chrome browser
- `npm run test:e2e:windows` - Run E2E tests on Windows platform
- `npm run test:e2e:setup` - Run only the setup test phase for E2E tests
- `npm run test:e2e:direct` - Run E2E tests directly
- `npm run test:e2e:smoke` - Run smoke tests
- `npm run test:e2e:auth` - Run authentication tests
- `npm run test:e2e:flashcards` - Run flashcard tests
- `npm run test:e2e:basic` - Run basic tests including smoke, auth, and flashcards
- `npm run clean:tmp` - Clean temporary files

## Project Scope

### MVP Includes:

- Automatic flashcard generation from pasted text (1,000-10,000 characters)
- Manual flashcard creation and management
- User authentication and account management
- Integration with the Leitner system for effective spaced repetition
- User progress tracking through five Leitner levels
- User statistics and AI generation logging

### Out of Scope for MVP:

- Custom, advanced spaced repetition algorithms beyond the basic Leitner system
- Document import (PDF, DOCX) - only manually pasted text supported
- Flashcard sharing between users
- Mobile applications (web version only initially)
- Public API
- Advanced gamification and notification features
- Advanced keyword search (standard full-text search with pagination only)

## Project Structure

The project follows a standard Astro structure with enhanced TypeScript support:

- `/src` - Source code
  - `/auth` - Authentication services and utilities
  - `/components` - Astro and React components
    - `/ui` - Shadcn UI components
    - `/auth` - Authentication components
    - `/flashcards` - Flashcard-related components
    - `/generate` - Components for AI generation
    - `/common` - Shared components
  - `/db` - Database client and type definitions
  - `/layouts` - Astro layout components
  - `/lib` - Utility functions and services
  - `/middleware` - Astro middleware for authentication and routing
  - `/pages` - Astro pages and API routes
    - `/api` - API endpoints
    - `/auth` - Authentication pages
  - `/stores` - Zustand stores for state management
  - `/styles` - Global CSS and Tailwind utilities
  - `/utils` - Helper functions
- `/supabase` - Supabase configuration and migrations
- `/tests` - Test files and utilities
- `/public` - Static assets

## Database Structure

The database structure includes tables for:

- Users (managed by Supabase Auth)
- Flashcards
- Collections (for organizing flashcards)
- Leitner system (for spaced repetition)
- User statistics and usage metrics

## Authentication

Authentication is implemented using Supabase Auth with:

- Email/password login
- Magic link login
- Password reset functionality
- JWT-based session management
- Server-side middleware protection for secure routes

## E2E Testing

### Issues and Solutions

During the implementation of E2E tests, we encountered issues with middleware and automatic redirections that prevented the login form tests from working properly. Here are the solutions we implemented:

1. **Special headers for tests**:

   - `X-Test-E2E: true` - identifies requests coming from E2E tests
   - `X-Test-Login-Form: true` - forces the login form to be displayed

2. **Middleware modifications**:

   - Detecting tests through headers and User-Agent
   - Disabling redirects for test requests
   - Removing session cookies for login form tests
   - Special handling for Windows platform tests

3. **Changes in pages and components**:

   - Adding meta tags for pages in test mode
   - Providing all elements with `data-testid` attributes
   - Adding diagnostic scripts to track component hydration
   - Adding a login form readiness indicator (`data-test-login-form-ready`)

4. **Test improvements**:
   - Cleaning cookies and localStorage before tests
   - Waiting for form loading and readiness
   - Adding diagnostic tests to check form state

### Running E2E Tests

To run E2E tests:

```bash
# All E2E tests
npm run test:e2e

# Only authentication tests
npx playwright test tests/e2e/auth.spec.ts

# Tests in debug mode
npx playwright test tests/e2e/auth.spec.ts --debug

# Windows-specific tests
npm run test:e2e:windows
```

## License

MIT
