# VyLab

VyLab is a web-based virtual science laboratory built with React. It provides interactive, browser-based simulations for Physical Sciences, specifically aligned with the CAPS curriculum. The application allows students to manipulate experimental variables—such as voltage, current, and temperature—and observe real-time visual feedback and data changes.

This project is maintained by Vylex under SINCHUB NPC.

## Features

* **Interactive Simulations:** Includes modules for the Chlor-Alkali industry, electrolytic cells, and organic compound properties.
* **Real-time State Management:** Variables like time, voltage, and current directly drive the Framer Motion animations and data outputs.
* **Responsive UI:** Built with Tailwind CSS, featuring a collapsible sidebar for desktop environments and a bottom navigation bar for mobile devices.

## Tech Stack

* **Core:** React 18+, React Router v6
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion (`motion/react`)
* **Icons:** Lucide React
* **Components:** Custom UI components built on a shadcn/ui-style architecture

## Project Structure

```text
src/
├── components/
│   ├── ui/               # Reusable primitives (Button, Slider, Card, Badge)
│   └── simulations/      # Core interactive lab components
│       ├── ChlorAlkaliLab.tsx
│       ├── ElectrolyticCellLab.tsx
│       └── OrganicCompoundsLab.tsx
├── layouts/
│   └── AppLayout.tsx     # Main application shell and routing layout
├── pages/                # High-level route components
├── data/                 # Standardized experiment schemas and data
├── App.tsx               # Route definitions
└── main.tsx              # Entry point