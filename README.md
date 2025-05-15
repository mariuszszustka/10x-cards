# 10x-cards

A modern web application for creating, managing, and reviewing educational flashcards with AI assistance.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)
- [Testy E2E](#testy-e2e)
- [Problemy i rozwiązania](#problemy-i-rozwiązania)
- [Uruchamianie testów E2E](#uruchamianie-testów-e2e)

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
- [TypeScript](https://www.typescriptlang.org/) v5
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17
- [Shadcn/UI](https://ui.shadcn.com/) - UI component library

### Backend

- [Supabase](https://supabase.com/) - Managed database and authentication

### AI Integration

- Ollama, OpenAI API, and Openrouter.ai for LLM capabilities

### Testing

- **Unit Testing:**

  - [Vitest](https://vitest.dev/) - Fast unit test framework that integrates well with Astro
  - [Testing Library](https://testing-library.com/) - For testing React components
  - [jsdom](https://github.com/jsdom/jsdom) - DOM environment implementation for Node.js tests
  - [SuperTest](https://github.com/visionmedia/supertest) - For API testing

- **End-to-End Testing:**

  - [Playwright](https://playwright.dev/) - Modern E2E testing framework with Chrome browser
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

6. Open your browser and navigate to `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests with Playwright on Chrome browser
- `npm run test:e2e:ui` - Run E2E tests with UI interface on Chrome browser
- `npm run test:e2e:debug` - Run E2E tests in debug mode on Chrome browser
- `npm run test:e2e:setup` - Run only the setup test phase for E2E tests

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

## Project Status

This project is currently in development. The MVP is being actively built with a focus on core flashcard functionality, AI integration, and implementing the Leitner system for effective learning.

## License

MIT

## Testy E2E

### Problemy i rozwiązania

Podczas implementacji testów E2E napotkaliśmy na problemy z middleware i przekierowaniami automatycznymi, które uniemożliwiały prawidłowe działanie testów formularza logowania. Oto rozwiązania, które wdrożyliśmy:

1. **Nagłówki specjalne dla testów**:

   - `X-Test-E2E: true` - identyfikuje żądania pochodzące z testów E2E
   - `X-Test-Login-Form: true` - wymusza wyświetlenie formularza logowania

2. **Modyfikacja middleware**:

   - Wykrywanie testów przez nagłówki i User-Agent
   - Wyłączenie przekierowań dla żądań testowych
   - Usuwanie ciasteczek sesji dla testów formularza logowania

3. **Zmiany w stronach i komponentach**:

   - Dodanie meta tagów dla stron w trybie testowym
   - Zapewnienie wszystkim elementom atrybutów `data-testid`
   - Dodanie skryptów diagnostycznych do śledzenia hydratacji komponentów
   - Dodanie wskaźnika gotowości formularza (`data-test-login-form-ready`)

4. **Usprawnienia testów**:
   - Czyszczenie ciasteczek i localStorage przed testami
   - Oczekiwanie na załadowanie formularza i jego gotowość
   - Dodanie testów diagnostycznych do sprawdzania stanu formularza

### Uruchamianie testów E2E

Aby uruchomić testy E2E:

```bash
# Wszystkie testy E2E
npm run test:e2e

# Tylko testy autoryzacji
npx playwright test tests/e2e/auth.spec.ts

# Testy w trybie debugowania
npx playwright test tests/e2e/auth.spec.ts --debug
```
