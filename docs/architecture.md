# Architecture

## Codebase layout

| Path                    | Responsibility |
| ----------------------- | -------------- |
| `src/components/`       | The shipped component library. One file per component, each a typed named export with `className` merging and ref forwarding. Also holds icon data (`runes.ts`, `pixel-icon.ts`). |
| `src/index.ts`          | Public barrel. Everything a consuming project may import is re-exported here. Adding a component without adding it here drops it from the published catalog. |
| `src/lib/`              | Shipped runtime helpers: `NesProvider.tsx` (loads the pixel font and applies the saved palette), `theme.ts` (palette switching API), `utils.ts`. |
| `src/styles/nes.css`    | Vendored NES.css plus the token layer: palette custom properties, the two themes, the accessibility layer (AA text colors, focus ring, reduced-motion and forced-colors blocks). |
| `src/styles.css`        | App-level base styles for the showcase shell. |
| `src/showcase/`         | The demo site only — shell, nav, theme toggle, icon gallery, spec data, studio editor. Never part of the published library. |
| `src/routes/`           | TanStack Router file-based routes. `__root.tsx` holds providers plus the pre-paint theme script; one file per public page. |
| `src/integrations/supabase/` | Generated backend clients. Do not hand-edit. |
| `scripts/`              | `copy-static-output.mjs` — idempotent copy of the prerender output into `dist/client`. |
| `.lovable/`             | Design-system metadata: `meta.yaml`, `system.md`, `sources.yaml`, generated `rules/`, archived plans in `plan/`. |
| `public/`               | `sitemap.xml`, `robots.txt`, `_redirects`, favicon. |

## Library vs showcase split

`.dsignore` excludes `src/showcase/**` and `src/integrations/**`. Anything a
consuming project needs must live outside those folders and be re-exported from
`src/index.ts`; anything in them is preview-only. A barrel entry pointing at an
excluded file breaks consumer builds, so keep the two in step.

## Design decisions

- **Theming.** Palettes are CSS custom properties toggled by
  `data-nes-theme="retro" | "fresh"` on `<html>`. The choice is persisted in
  `localStorage` under `nes-theme`. `src/showcase/theme.ts` wraps this in a
  shared store built on `useSyncExternalStore`, so every component re-renders on
  a switch without a page reload. `src/lib/theme.ts` is the shipped version of
  the same API for consumers.
- **No flash of the wrong palette.** `src/routes/__root.tsx` injects a tiny
  inline script that reads `localStorage` and sets the attribute before first
  paint, alongside a cloak/reveal script that keeps the body hidden until fonts
  are ready. Both must stay inline in `<head>` — moving them into a component
  reintroduces the flash.
- **State management.** Local component state only, plus TanStack Query for
  backend reads. There is no global store.
- **URL search params.** Route search params are validated with Zod through
  `validateSearch` — `/auth` takes a `next` param for the post-sign-in return
  path, read with `Route.useSearch()`. Never read `window.location.search`
  directly during render; it breaks hydration on prerendered pages.
- **Client vs server.** Everything is client-side. Sign-in, listing, saving and
  deleting custom icons talk to the hosted backend straight from the browser, so
  every public page renders identical HTML for every visitor. The single
  exception is `src/routes/api/generate-pixel-icon.ts` (AI icon generation),
  which needs a request-time server and therefore does not work on the static
  host — the UI shows a plain unavailable message there.
- **Styling.** Plain CSS, no CSS-in-JS and no Tailwind. Component variation is
  expressed as named props mapped to NES.css classes, never inline styles.

## Gotchas & lessons learned

- **The prerender page list is manual.** `src/showcase/spec-names.ts` exports
  `SPEC_PAGE_NAMES` and `STATIC_PAGE_PATHS`; `vite.config.ts` feeds the latter
  into `tanstackStart({ pages, prerender: { enabled: true,
  autoStaticPathsDiscovery: false } })`. Discovery is off on purpose, so a new
  public route that is not added there is silently not prerendered. Add it to
  `public/sitemap.xml` in the same change.
- **No Cloudflare Worker entrypoint.** The static host rejects a build that
  emits a Worker. All Cloudflare build detection and config was removed; do not
  reintroduce `wrangler.jsonc` or a Worker plugin.
- **Do not set `nitro: { preset: "static" }`.** It breaks the build with
  "rolldownOptions.input should not be an html file". The normal build already
  prerenders.
- **Build must exit.** If the build writes every page and then hangs, a timer is
  holding the process open (module-scope timers, TanStack Query `gcTime`, eager
  clients). Fix with lazy creation, `.unref()`, or a `process.env.TSS_PRERENDERING`
  guard — never by shortening the timeout.
- **Accessibility tokens are separate.** Fill/border colors and text colors are
  different variables (`--nes-primary` vs `--nes-primary-text`). Use the
  `-text` variants for anything read as text, or contrast drops below AA.
- **Tap targets.** Small controls (the custom-icon delete "×") keep a 44×44
  hit area while rendering at 24px, and destructive actions confirm first.
- **Browser-only code.** Read `localStorage`, `window` or `document` in an
  effect, not in a `useState` initializer — a `typeof window` guard still
  produces a hydration mismatch on prerendered pages.
