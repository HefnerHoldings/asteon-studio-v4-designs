# Asteon Studio Pro V4 — Designmockups

Kjørbare React/TypeScript/Vite-mockups for Builder-teamet. Alle 6 visninger er interaktive og animerte.

## Kom i gang

```bash
git clone https://github.com/HefnerHoldings/asteon-studio-v4-designs.git
cd asteon-studio-v4-designs
npm install
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173) i nettleseren.

## Visninger

| Rute | Komponent | Beskrivelse |
|------|-----------|-------------|
| `/` | `StudioProV4` | Hoved-editor: AI-chat, verden-canvas, agent-runs |
| `/world` | `StudioProV4World` | Verden-editor: Build/Content/Systems/Region/Director/Liv |
| `/expert` | `ExpertModeToolsV4` | Ekspertmodus: 13 verktøykategorier med sub-verktøy |
| `/code` | `StudioProV4Code` | Kode-editor: syntax highlighting, fil-tre, diagnostikk |
| `/kanban` | `KanbanV4` | Kanban-tavle: agentoppgaver med status |
| `/gitdiff` | `GitDiffReviewV4` | Git Diff-review: patch-godkjenning |

## Teknisk

- **Stack:** React 18 + TypeScript + Vite 5
- **Ikoner:** `lucide-react` (eneste avhengighet utover React)
- **Styling:** Inline styles, ingen CSS-framework
- **Design tokens:**
  - Bakgrunn: `#0a0c12`
  - Overflate: `#0e1118`
  - Accent: `#7cd4ff`
  - Varm: `#f5a96b`
  - God/OK: `#88d999`
  - Kant: `rgba(255,255,255,0.07)`

## Struktur

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Router + nav-bar
└── components/
    ├── StudioProV4.tsx           # Hoved-editor
    ├── StudioProV4World.tsx      # Verden-editor
    ├── views.tsx                 # Sub-visninger (Content/Systems/Region/Director/Liv)
    ├── ExpertModeToolsV4.tsx     # Ekspertmodus-verktøy
    ├── StudioProV4Code.tsx       # Kode-editor
    ├── KanbanV4.tsx              # Kanban-tavle
    └── GitDiffReviewV4.tsx       # Git Diff-review
```

## Integrasjon i Studio

Disse mockupene er referanseimplementasjoner. For produksjonsintegrasjon:

1. Kopiér ønskede komponenter inn i Studio-kodebasen
2. Erstatt placeholder-data med ekte API-kall
3. Erstatt `ASTEON`-tekst-logo med den ekte logoen fra assets
4. Tilpass `import`-stier til prosjektstruktur
5. Del opp store komponenter i mindre deler etter behov

---

Sendt fra Asteon til Builder-teamet via Sync CMSG #9792.
