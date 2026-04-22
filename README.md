# VyLab

VyLab is a client-side virtual science laboratory application aligned with the South African CAPS Physical Sciences syllabus (Grades 10-12). It provides interactive physics and chemistry simulations directly in the browser.

## Architecture Overview

The system is built as a static frontend application to maximize accessibility and minimize operational costs. 

- **Local Processing**: Core simulation engines execute natively within the browser using JavaScript. State changes (e.g., adjusting voltage in a circuit or temperature in a reaction) trigger local recalculations and immediate UI updates. No backend compute is required for the physics or chemistry models.
- **External Services**: The application makes external network requests solely for the AI Syllabus Tutor, which integrates with a remote language model API.
- **Storage**: User session data, including the integrated session notebook, is handled via local device storage.

## Tech Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v7
- **Styling & Components**: Tailwind CSS v4, Base UI, Shadcn UI
- **Visualization & Animation**: D3.js, Recharts, Motion

## Development Setup

### Prerequisites

- Node.js
- npm

### Installation Steps

1. Clone the repository and navigate to the project directory.
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory based on `.env.example` and populate the required API keys.
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The Vite server will start, typically accessible at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Starts the local development server.
- `npm run build` - Builds the application for production.
- `npm run preview` - Serves the production build locally.
- `npm run lint` - Executes TypeScript type checking.
- `npm run clean` - Removes the build output directory (`dist`).

## Additional Documentation

Detailed information regarding supported curriculum units, simulation logic, and platform specifications can be found in the [VyLab Whitepaper](./VyLab_Whitepaper.md).