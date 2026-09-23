# Roadmap

Consolidated from the plan archive in `.lovable/plan/`.

## Completed

- [x] Port NES.css into a typed React component library with a barrel export
- [x] Live showcase: foundations, components, Lovable patterns pages
- [x] Add 215 rune icons (`NesRuneIcon`) with Apache 2.0 attribution
- [x] Tokenize the palette and add the "fresh" theme with a persisted switcher
- [x] `NesPixelIcon` component and unified icon gallery with tabs, filter and
      copy-to-clipboard
- [x] Component spec pages for all 20 components at `/specs/$name`
- [x] Pixel icon studio: drawing tools, undo/redo, import sprites/runes, save to
      the backend, SVG/code export
- [x] Backend: saved icons table with row-level security, email sign-in, `/auth`
- [x] Accessibility pass — skip link, AA text tokens, non-color status cues,
      44px tap targets, reduced-motion and forced-colors fallbacks, `/accessibility`
- [x] Static hosting: prerender all 30 public pages, `dist/client` output,
      sitemap, robots, `_redirects`
- [x] Remove all Cloudflare Worker build detection
- [x] Point the sitemap at `https://design.2.MikeDemo.dev`
- [x] Repository hand-off docs: README, `docs/architecture.md`,
      `docs/deployment.md`, `docs/environment.md`, `.env.example`

## Open

- [ ] AI icon generation on the static site — currently shows an "unavailable"
      message because it needs a request-time server. Options: host it as a
      separate function and call it from the browser, or hide the button in
      production.
- [ ] Keep `STATIC_PAGE_PATHS` and `public/sitemap.xml` in sync whenever a
      public page is added or removed (easy to forget; discovery is off).
- [ ] Automated regression tests for the studio and gallery interactions —
      verification is currently manual browser checks plus an axe scan.
- [ ] Enrich `usage` / `examples` / `antipatterns` in `.lovable/design-system.json`
      for the newer components.
