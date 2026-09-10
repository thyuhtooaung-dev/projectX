# projectX

Frontend application for projectX, a responsive, state-of-the-art conversational AI client built with Angular 22, native Signals, Tailwind CSS v4, and a Shadcn-inspired design system.

---

## Architecture Overview

The client application implements a modern component-driven architecture using Angular 22 standalone components and reactive Signals for state synchronization.

### Technology Stack

* **Framework**: Angular 22 (Standalone Components, SSR)
* **Reactivity**: Angular Signals (`signal`, `computed`, `effect`)
* **Styling**: Tailwind CSS v4 with Shadcn zinc dark mode tokens
* **Icons**: Lucide Angular
* **Code Quality**: Biome 2.5 (linter and formatter)

### Project Structure

```
src/
├── app/
│   ├── core/                        # Core models, interfaces, and singletons
│   │   ├── models/                  # TypeScript data contracts (chat.model.ts)
│   │   └── services/                # API and streaming service (chat.service.ts)
│   ├── shared/                      # Reusable, design-system primitives
│   │   └── ui/
│   │       ├── button/              # Variant-based button (default, secondary, outline, ghost, destructive)
│   │       ├── badge/               # Status and model badges
│   │       └── dropdown/            # OpenRouter model selector dropdown
│   ├── features/                    # Domain feature modules
│   │   └── chat/
│   │       ├── components/
│   │       │   ├── chat-sidebar/    # Thread list, active thread selector, deletion
│   │       │   ├── chat-header/     # Thread title, model picker, and actions
│   │       │   ├── message-list/    # Message stream container and autoscroll
│   │       │   ├── message-item/    # Individual chat bubble with collapsible reasoning view
│   │       │   └── chat-input/      # Multi-line input with keyboard send handling
│   │       └── chat.component.ts    # Container orchestrating chat features
│   ├── app.component.ts             # Root router outlet wrapper
│   ├── app.config.ts                # Application providers and routing config
│   └── app.routes.ts                # Client routes (/ for new chat, /c/:id for thread loading)
└── environments/                    # Environment-specific configuration
    ├── environment.ts               # Development environment settings
    └── environment.production.ts    # Production environment settings
```

---

## Environment Configuration

Configuration files are located in `src/environments/`:

* **`src/environments/environment.ts`**:
  ```typescript
  export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:[PORT]/api',
  };
  ```

* **`src/environments/environment.production.ts`**:
  ```typescript
  export const environment = {
    production: true,
    apiBaseUrl: 'http://localhost:[PORT]/api',
  };
  ```

---

## Installation and Setup

1. Install project dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the local development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:[PORT]/
   ```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Start the local Angular dev server on port 4200 |
| `npm run build` | Build production bundles into `dist/client/` |
| `npm run watch` | Build in watch mode for development |
| `npm run lint` | Run Biome linter with unsafe fixes (`biome check --write --unsafe`) |
| `npm run format` | Format code with Biome (`biome format --write .`) |
| `npm test` | Run unit tests with Vitest |

---

## Code Quality Standards

This project uses **Biome** for code formatting, linting, and import management.

* Execute Biome checks and auto-fixes:
  ```bash
  npm run lint
  ```
* Format project files:
  ```bash
  npm run format
  ```
