# Bundle Builder

Bundle Builder is a React-based product configurator for assembling a home security package. It guides users through cameras, monitoring plans, sensors, and accessories, then presents a live review panel with pricing, discounts, shipping, and saved bundle state.

## Overview

- Step-by-step bundle builder for a home security system
- Live cart review with quantity controls and price calculations
- Persistent client-side state so the bundle survives refreshes

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- Tailwind CSS 4

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Build

Create an optimized production build:

```bash
npm run build
```

Preview the production output locally:

```bash
npm run preview
```

## Architecture

- Product and pricing data live in `src/db.json`
- The bundle state is managed with Zustand and persisted in the browser
- The UI is split into a builder flow and a review summary
- Static assets are served from `public` so Vite does not process them as bundled imports

## My Workflow (AI-Accelerated)

To maximize development velocity and explore multiple architectural approaches efficiently, this project was built using a structured, AI-assisted workflow. 

Rather than using AI for blind code generation, I established a strict **Architect vs. Executor** framework:

## The Architect (Human Role)
* **System Design & Architecture:** Defined the core directory structure, state management flow, and component relationships before touching code.
* **Strategic Decision-Making:** Utilized **Gemini** as a sounding board to stress-test architectural decisions, identify edge cases, and highlight blind spots in the initial design phase.

* **Code Review & QA:** Acted as the ultimate gatekeeper. Every single block of code generated or edited by tooling went through a manual code review to accept, modify, or deny the solution based on performance, type safety, and clean code principles.

### The Executor (AI Role)
* **Contextual Code Edits:** Utilized **Codex CLI** to execute scoped code modifications within isolated components, adhering strictly to the architecture and context provided by the architect.
* **Boilerplate & Syntax Automation:** Automated repetitive tasks, minor syntax formatting, and initial component shells to compress development time.

### Why This Workflow?
This approach decoupled **thinking** from **typing**. By delegating syntax execution to AI under strict supervision, I was able to rapidly prototype and contrast different implementation strategies, ensuring the final codebase is clean, scalable, and built on deliberate technical decisions.

## Decisions

- **State management: Zustand over React Context**
  - Chosen for its small hook-based API and low boilerplate
  - Components subscribe to only the slice of state they need, so they re-render only when that selected state changes
  - This avoids the broader consumer re-renders common with Context, where all consumers can update when the provider value changes even if they do not use the changed key
  - It also keeps bundle updates and derived cart logic centralized

- **Static assets in `public`**
  - The asset folder was moved into `public` so images can be referenced with stable URLs
  - Vite serves files in `public` directly during development and copies them into the production output

- **Data-driven defaults**
  - Default product variants and quantities are defined in `src/db.json`
  - Changing the default variant or quantity there updates the rendered bundle correctly

- **TypeScript deprecation handling**
  - `tsconfig.app.json` includes `"ignoreDeprecations": "6.0"`
  - This suppresses current deprecation warnings while keeping the existing compiler setup

## Notes

- Product images were optimized with Squoosh and converted to WebP
- Image sizes were reduced from `76KB`, `129KB`, `309KB`, `172KB`, and `128KB` to `10KB`, `21KB`, `57KB`, `18KB`, and `26KB` respectively
- The current bundle state is stored in the browser using Zustand persistence
