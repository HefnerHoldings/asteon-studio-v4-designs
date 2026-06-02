# Asteon Studio Pro V4 — UI Mockup Components

React/TypeScript UI mockup components for the Asteon GameOS Builder Studio.
All components share the same dark design language, color palette, and Lucide icon set used across the Asteon platform.

## Components

| Component | File | Description | Lines |
|-----------|------|-------------|-------|
| **StudioProV4** | `components/builder-style-studio-pro-v4/StudioProV4.tsx` | Main editor — AI chat rail, NPC/Zone/content cards, auto-mode system, progress rings | 1412 |
| **StudioProV4World** | `components/studio-pro-v4-world/StudioProV4World.tsx` | World builder — 3-tab canvas (watch/play/world), asset browser with sort+filter, world file tree | 1473 |
| **StudioProV4World views** | `components/studio-pro-v4-world/views.tsx` | Sub-views for the World editor (Content, Systems, Region, Director, Liv tabs) | — |
| **ExpertModeToolsV4** | `components/expert-mode-tools-v4/ExpertModeToolsV4.tsx` | Expert tool palette — 13 categories (zones, props, roads, terrain, water, light, NPC, buildings, audio, traffic, weather, measure, layers) | 940 |
| **StudioProV4Code** | `components/studio-pro-v4-code/StudioProV4Code.tsx` | Code editor — syntax highlighting, file tree, tab bar, diagnostics panel, terminal | 1324 |
| **KanbanV4** | `components/builder-view-kanban-v4/KanbanV4.tsx` | Kanban task board — agent run status, animated status dots, AI column | 329 |
| **GitDiffReviewV4** | `components/git-diff-review-v4/GitDiffReviewV4.tsx` | Git diff + patch review — file list with +/- stats, unified diff view, inline comments, AI reviewer | 566 |

## Design System

All components use a shared token set (inline constants):

```ts
const B      = '#0a0c12';   // background
const SURF   = '#0e1118';   // surface
const PANEL  = '#131720';   // panel
const RAISED = '#181c26';   // raised card
const BRD    = 'rgba(255,255,255,0.07)';  // border
const T      = '#ededed';   // text primary
const M      = '#6b6b70';   // text muted
const ACCENT = '#7cd4ff';   // accent (ice blue)
const WARM   = '#f5a96b';   // warm (amber)
const GOOD   = '#88d999';   // success (green)
const BAD    = '#f08a82';   // error (red)
```

Icons: [Lucide React](https://lucide.dev/) — consistent `strokeWidth={1.5}` throughout.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** dev server (same setup as Asteon Studio)
- **Lucide React** for icons
- Inline styles (no CSS framework dependency — portable by design)

## Setup

### Prerequisites
- Node.js 20+
- pnpm 9+

### Run in isolation (standalone Vite preview)

```bash
# Clone
git clone https://github.com/HefnerHoldings/asteon-studio-v4-designs.git
cd asteon-studio-v4-designs

# Install a minimal Vite + React scaffold
npm create vite@latest preview -- --template react-ts
cd preview
npm install
npm install lucide-react

# Copy a component in
cp ../components/builder-style-studio-pro-v4/StudioProV4.tsx src/App.tsx

# Edit src/main.tsx to render <App />
npm run dev
```

### Run inside the Asteon monorepo (recommended)

The components live in `artifacts/mockup-sandbox` in the Asteon monorepo.
The preview server is already wired up:

```bash
pnpm --filter @workspace/mockup-sandbox run dev
# Preview at: http://localhost:<PORT>/preview/builder-style-studio-pro-v4
```

Each component is registered in the mockup-sandbox index at:
`artifacts/mockup-sandbox/src/components/mockups/`

## Integration into Asteon Studio

These are **design mockups** intended as the visual reference for the production Studio implementation.
When graduating a component from mockup to production:

1. Import the component into `artifacts/aurora` or the Builder Studio artifact.
2. Replace inline style constants with shared design tokens from `lib/design-tokens` (when available).
3. Wire API calls (`fetch` / React Query hooks from `lib/api-client-react`) to replace the static mock data arrays inside each component.
4. Run `pnpm --filter @workspace/aurora run typecheck` to confirm no TS errors.

## Component interaction model

- **StudioProV4** — top-level shell; renders the left icon rail, AI chat panel, and the main content canvas. The `AutoCtx` React context propagates "auto-mode" state to child cards.
- **StudioProV4World** — renders inside the canvas area of StudioProV4 when the World tab is active. Imports sub-views from `views.tsx`.
- **ExpertModeToolsV4** — renders as a floating/docked tool overlay in the canvas. Receives the active `TopTab` from the parent shell.
- **StudioProV4Code** — renders in the canvas area when the Code tab is active.
- **KanbanV4** — standalone view for the Kanban rail mode.
- **GitDiffReviewV4** — standalone view for the Git rail mode.

## Contact

Asteon platform team — sync via [Sync Portal](https://sync.asteon.ai) or CMSG to `asteon-agent`.
