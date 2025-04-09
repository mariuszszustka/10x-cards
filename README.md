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

## Project Description

10x-cards is a web application that allows users to create, manage, and review educational flashcards. The application leverages LLM models (via API) to generate flashcard suggestions based on input text and integrates with a ready-made spaced repetition algorithm for effective learning.

### Key Features:
- **AI-powered flashcard generation**: Automatically generate high-quality flashcards from pasted text
- **Manual flashcard management**: Create, edit, and organize your own flashcards
- **User authentication**: Secure access to personalized flashcard sets
- **Spaced repetition integration**: Efficiently learn using proven learning methods
- **Performance tracking**: Monitor your learning progress and effectiveness

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

## Project Scope

### MVP Includes:
- Automatic flashcard generation from pasted text (1,000-10,000 characters)
- Manual flashcard creation and management
- User authentication and account management
- Integration with an open-source spaced repetition algorithm
- User statistics and AI generation logging

### Out of Scope for MVP:
- Custom, advanced spaced repetition algorithm (using open-source solution instead)
- Document import (PDF, DOCX) - only manually pasted text supported
- Flashcard sharing between users
- Mobile applications (web version only initially)
- Public API
- Gamification and advanced notification features
- Advanced keyword search (standard full-text search with pagination only)

## Project Status

This project is currently in development. The MVP is being actively built with a focus on core flashcard functionality and AI integration.

## License

MIT 