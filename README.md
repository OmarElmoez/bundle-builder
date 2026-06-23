# Bundle Builder

Bundle Builder is a React-based product configurator for assembling a home security package. It lets users step through cameras, monitoring plans, sensors, and accessories, then review the live cart summary with pricing, discounts, shipping, and saved-state persistence.

## Purpose

- Guide users through a structured bundle selection flow
- Show a real-time review panel with selected items and totals
- Persist selections locally so the current configuration is restored on refresh

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand for state management and persistence
- Tailwind CSS 4 for styling

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts the local Vite development server.

## Build

```bash
npm run build
```

This runs the TypeScript build and produces an optimized production bundle in `dist/`.

## Preview

```bash
npm run preview
```

This serves the production build locally after running `npm run build`.

## Notes

- Product data, pricing, and shipping details are loaded from `src/db.json`
- The current bundle state is stored in the browser using Zustand persistence
