# Contributing to Nomad EHR

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd nomad-ehr
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    # or
    pnpm run dev
    ```
    Open http://localhost:3000 to view the app (configured in `vite.config.ts`).

## Code Style
*   **Framework**: React 19 + TypeScript.
*   **Styling**: Tailwind CSS (via CDN in `index.html`). Use utility classes for everything. Avoid custom CSS files unless for complex animations.
*   **Formatting**: Prettier recommended. Run `npm run format` (if script exists) or rely on IDE settings.
*   **Type Safety**: Strict TypeScript. Use interfaces from `types.ts` for all data structures.
*   **Animations**: Framer Motion for transitions and interactions. Use `motion.*` components and `AnimatePresence` for view transitions.

## Project Structure
```
nomad-ehr/
├── pages/              # Top-level views (Landing, Access, Dashboard)
│   └── dashboard/      # Dashboard sub-pages (Overview, Notes, History)
├── components/         # Reusable UI elements (Navbar, Footer, DecryptOverlay)
├── context/            # Global state management (AppContext)
├── constants.ts        # Mock data definitions (MOCK_RECORD)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Root component with view switching
├── index.tsx           # React DOM entry point
├── index.html          # HTML template with Tailwind CDN config
└── vite.config.ts      # Vite build configuration
```

*Note: No `/src` directory - files are at the root level.*

## Development Guidelines
*   **Mock Data**: Do not connect to a real backend yet. Use `MOCK_RECORD` in `constants.ts`.
*   **Encryption**: **DO NOT IMPLEMENT REAL CRYPTO**. This is a prototype. Use visual simulations (Framer Motion animations, backdrop blur, rotating icons) only. See `DecryptOverlay.tsx` for reference.
*   **Commits**: Follow the "Git for Health" model. Every data change must generate a `Commit` object in the state:
    *   Structure updates → `Commit` type `'structure'`
    *   Note additions → `Commit` type `'note'`
    *   Access events → `Commit` type `'access'`
*   **Attribution**: Always use `currentUser.name` from `AppContext` for `author` and `updatedBy` fields.
*   **State Management**: All state updates go through `AppContext` methods. Never mutate `record` directly.

## Available Scripts

Check `package.json` for available scripts:
*   `npm run dev` - Start development server (Vite)
*   `npm run build` - Build for production
*   `npm run preview` - Preview production build

*Note: Type checking and linting scripts are not currently configured. Consider adding:*
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

## Pull Request Checklist
- [ ] Code compiles without TypeScript errors.
- [ ] No console warnings or errors.
- [ ] "Encryption" animations are smooth and performant (test `DecryptOverlay`).
- [ ] All state updates generate corresponding `Commit` objects.
- [ ] Attribution uses `currentUser.name` correctly.
- [ ] Mobile responsiveness is checked (test on small screens).
- [ ] Emergency mode toggle works correctly (test dark/yellow theme).
- [ ] All three dashboard tabs function correctly (Overview, Notes, History).
