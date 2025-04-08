# FlowCraft AI

## Concept

FlowCraft AI is a web application designed for UX designers. It takes a natural language project brief as input (via text or voice), uses AI to generate a suggested user flow with steps and UI component ideas, and displays it as an interactive, editable diagram. Designers can tweak the flow, get AI-powered suggestions, and export their work in multiple formats.

## Standout Features

### Voice Input for Project Briefs

- Designers can speak their project brief instead of typing, making input faster and more accessible.

### AI-Powered Suggestions During Editing

- As designers modify the flow, they can request real-time AI suggestions for improvements or alternative steps.

### Export Options (JSON, SVG, PNG)

- Flows can be exported as structured JSON for developers
- SVG export for vector graphics
- PNG export for quick sharing
- Perfect for integrating into design workflows

### Save and Load Flows Locally

- Designers can save their work to their browser's local storage
- Load saved work later
- No backend required

### UI Suggestions Panel with Icons

- When a step in the flow is selected, a panel displays suggested UI components
- Visual icons for quick component identification (e.g., "form," "button")

## Tech Stack

### Frontend Framework

- Next.js (App Router)
- Handles frontend and API routes
- Leverages server-side capabilities

### AI Integration

- Vercel AI SDK
- Powers AI-driven flow generation and suggestions
- Seamless integration with Next.js

### Flow Visualization

- React Flow
- Interactive, editable flow diagram
- Visual flow manipulation

### UI Components & Styling

- Shadcn UI for components
- Tailwind CSS for styling
- Responsive and modern design
- Heroicons for clean, simple icons

### Additional Technologies

- Web Speech API for voice-to-text functionality
- html2canvas for PNG exports

## Feature Implementation Details

### Project Brief Input

- Form with text area for typing
- Microphone button for voice input
- Web Speech API integration
- "Generate Flow" submission button

### AI-Generated UX Flow

- Processes brief to output 4-6 step user flow
- Each step paired with UI component suggestions
- JSON array output structure
- API route using Vercel AI SDK

### Interactive Flow Diagram

- Drag-and-drop node manipulation
- Add/remove steps
- Connect nodes
- JSON to React Flow mapping

### AI Suggestions System

- "Get Suggestions" button
- Sidebar/modal display
- Up to 3 contextual suggestions
- Based on current flow state

### UI Component Visualization

- Keyword-to-icon mapping
- Side panel display
- Interactive component selection
- Visual component representation

### Export System

- JSON data export
- SVG vector diagram export
- PNG image export
- Multiple format support

### Local Storage Integration

- Save flow to localStorage
- Load flow from localStorage
- Simple browser API integration
- Persistent data storage
