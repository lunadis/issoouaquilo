# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server at http://localhost:3000
npm test         # Run tests in interactive watch mode
npm test -- --watchAll=false   # Run tests once (CI mode)
npm run build    # Production build to ./build
```

Node 20.x is required (set in `package.json` engines).

## Architecture

Single-page React app ("Isso ou Aquilo" / "This or That") — a decision helper that randomly picks from a list of user-provided options.

The entire app lives in `src/App.js`. There are no routes, no context providers, no custom hooks, and no additional components. State is managed with `useState`:

- `inputs` — array of `{ label, id }` objects representing the current options (starts with 2)
- `resposta` — the randomly selected option value after form submission
- `mostrarResposta` — boolean controlling visibility of the result `Alert`

Form handling uses `react-hook-form`. Each input is registered by its numeric string `id` (e.g., `"1"`, `"2"`). On submit, all fields are validated as non-empty before a random index is chosen with `Math.floor(Math.random() * inputs.length)`.

UI is built with **Reactstrap** (Bootstrap 5 React components) + Bootstrap CSS imported globally in `index.js`.
