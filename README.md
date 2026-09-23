# NES.css Design System

A retro 8-bit design system built on NES.css, shipped as a typed React component
library together with a live showcase site: foundations, a unified icon gallery,
per-component specification pages, a pixel-icon studio, and an accessibility
report.

**Live site:** https://design.2.MikeDemo.dev

## Key features

- **Typed React components** — `NesButton`, `NesBadge`, `NesBalloon`,
  `NesContainer`, `NesDialog`, `NesField`, `NesInput`, `NesTextarea`,
  `NesCheckbox`, `NesRadio`, `NesSelect`, `NesList`, `NesProgress`, `NesTable`,
  `NesText`, `NesAvatar`, `NesIcon`, `NesPixelArt`, `NesRuneIcon`,
  `NesPixelIcon`, all exported from `src/index.ts`.
- **Two palettes** — the original NES retro palette and a modern "fresh"
  palette, switchable at runtime and remembered between visits.
- **Component spec pages** — anatomy, spacing, colors, typography, states,
  accessibility notes, props table and a copyable snippet for each component.
- **Unified icon gallery** — NES icons, pixel-art sprites, 215 rune icons and
  your own saved icons in one grid with filtering, tabs and copy-to-clipboard.
- **Pixel icon studio** — draw 8/16/32px icons in the browser, undo/redo, load
  an existing sprite or rune as a starting point, save to the hosted backend,
  export SVG or code.
- **Accessibility pass** — skip link, AA-contrast text tokens, non-color status
  cues, finger-sized tap targets, reduced-motion and forced-colors fallbacks.
- **Fully prerendered** — every public page is written to static HTML at build
  time.

## Attribution & licenses

- **NES.css** — MIT. The stylesheet is vendored at `src/styles/nes.css`;
  see [`LICENSE-nes-css`](./LICENSE-nes-css). Upstream:
  https://github.com/nostalgic-css/NES.css (fork used:
  https://github.com/Mike-Demo/nes.css).
- **Rune Icons** — Apache 2.0; see [`LICENSE-runeicons`](./LICENSE-runeicons).
  Upstream: https://github.com/Nexvyn/runeicons.
- **Press Start 2P** — Open Font License, loaded from Google Fonts.

## Tech stack

| Area           | Choice                                        |
| -------------- | --------------------------------------------- |
| Framework      | React 19 + TanStack Start (SSR/prerender)      |
| Router         | TanStack Router (file-based, `src/routes/`)    |
| Data           | TanStack Query                                 |
| Styling        | Plain CSS + CSS custom-property tokens         |
| Build tool     | Vite 8                                         |
| Package manager| Bun                                            |
| Backend        | Supabase (browser-side only: auth + saved icons) |

## Local development

Prerequisites: **Node 22+** and **Bun 1.3+**.

```sh
bun install
cp .env.example .env   # fill in your own backend values
bun run dev            # http://localhost:8080
```

The site runs without `.env` — only sign-in and saved custom icons need it. See
[`docs/environment.md`](./docs/environment.md) for what each variable does.

Other scripts:

```sh
bun run lint        # ESLint
bunx tsgo --noEmit  # TypeScript typecheck
```

## Build & deployment

```sh
bun run build   # vite build && node scripts/copy-static-output.mjs
```

The build prerenders every public page to its own `<route>/index.html` and the
post-build script places the finished site in **`dist/client`**. That folder is
plain static files — upload it to any static host. Deep links work via
`public/_redirects`.

Full details: [`docs/deployment.md`](./docs/deployment.md) and
[`SPACEFAST.md`](./SPACEFAST.md).

## Documentation index

- [`docs/architecture.md`](./docs/architecture.md) — codebase layout, design
  decisions, gotchas.
- [`docs/deployment.md`](./docs/deployment.md) — hosting, build output,
  redirects, domain/DNS.
- [`docs/environment.md`](./docs/environment.md) — every environment variable.
- [`SPACEFAST.md`](./SPACEFAST.md) — host-specific build spec.
- [`roadmap.md`](./roadmap.md) — completed milestones and open work.
