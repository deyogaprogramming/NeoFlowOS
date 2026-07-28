# Architecture Document

## High Level Architecture
NeoFlow OS is a single-page React application (SPA) built with Vite and TypeScript. It functions as a client-side heavy application with a Firebase backend for durable data persistence and user authentication.

## System Overview
The system is designed as a creative intelligence workspace, providing tools for ideation, prompt engineering, and visual DNA management. It leverages Google Gemini AI for intelligent text and image prompt generation.

## Folder Structure
```
/src
├── components/   # React components (UI and views)
├── lib/          # Utilities and third-party integrations (e.g., Firebase, Utils)
├── types.ts      # TypeScript interfaces and types
├── constants.ts  # Default data and constants
├── App.tsx       # Main application entry point and routing
├── index.css     # Global styles and Tailwind configuration
```

## Data Flow
- **State Management**: React state (`useState`, `useEffect`) manages local session data.
- **Persistence**: Firebase Firestore is used to persist user data (ideas, prompts, references) to the cloud. LocalStorage acts as a fallback or cache.
- **AI Integration**: The app calls Google Gemini API (via server or client abstraction) to process creative tasks.

## Technical Decisions
- **React 18 & Vite**: Chosen for fast development and optimal build performance.
- **Tailwind CSS**: Used for rapid UI styling with a custom "Neo-Noire" design language.
- **Framer Motion**: Adds fluid animations and layout transitions.
- **Firebase**: Provides serverless backend, real-time database (Firestore), and Authentication.
- **Google Gemini API**: Powers the AI-driven features like prompt building and moodboard analysis.

## Security Architecture
- Firebase Authentication is used to secure user sessions.
- Firestore Security Rules restrict data access to the authenticated owner (`request.auth.uid == userId`).
- Environment variables securely store API keys.

## Deployment Overview
The app can be deployed to static hosting (like Firebase Hosting, Vercel, or Netlify) or containerized via Cloud Run.
