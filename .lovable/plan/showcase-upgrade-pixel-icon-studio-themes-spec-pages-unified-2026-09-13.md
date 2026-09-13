# Showcase upgrade: pixel icon studio, themes, spec pages, unified gallery

Five additions to the NES.css design system, built in this order so each step can be verified before the next.

## 1. Pixel icon studio (draw by hand + AI generate, saved to Cloud)

A new showcase page, `/studio`, where you draw your own pixel icons and they appear on the Iconography page.

- **Grid editor**: 16x16 (switchable to 8x8 / 32x32) canvas with pencil, eraser, fill bucket, color picker limited to the active theme palette plus black/white/transparent, undo/redo, clear, and a live preview at small/medium/large. Keyboard-reachable; every tool is a real button with an accessible name.
- **Load existing art**: pick any of the 13 NES sprites or 215 rune icons as a starting point and edit it.
- **AI generate**: type a prompt ("a pixel heart potion"), Lovable AI produces an image, the studio snaps it onto the grid and the theme palette so it lands in the same style; you then edit it like any other icon. Progress and errors (e.g. out of credits) are shown in the panel.
- **Save**: name the icon and save it to Lovable Cloud. Saved icons show up in a "Custom icons" section on `/icons`, and each has an "Export" that copies SVG or the `NesPixelIcon` code snippet.
- **New library component `NesPixelIcon`**: renders a pixel grid from data (the same data the studio saves), with the standard `size` prop, `currentColor`-aware single-color mode, `aria-hidden` unless labeled, `className` merge and ref forwarding. This ships to consumers; the studio itself stays showcase-only.

Saving requires signing in (a simple email sign-in page) so only the library authors can add or delete icons; the gallery is readable by everyone. This is flagged as a decision point below.

## 2. Theme switcher: NES retro vs. Fresh (shipped as real themes)

- Extract the semantic colors from the stylesheet into tokens (`--nes-primary`, `--nes-success`, `--nes-warning`, `--nes-error`, `--nes-dark`, `--nes-bg`, `--nes-hover`, `--nes-shadow`, `--nes-disabled`, and their hover shades). The stylesheet is rewritten to read those tokens with the original values as fallbacks, so nothing changes for the default theme.
- **Fresh palette** (proposed): indigo primary `#5b5bd6`, mint success `#3fb98a`, amber warning `#f2b134`, coral error `#ef6f6c`, ink `#1f2233` on off-white `#fafaf7`, soft shadow `#c9cbd6`. Applied via `data-nes-theme="fresh"` on `<html>`.
- The NES pixel icons/sprites keep their drawn colors in both themes (they are artwork, not tokens); rune icons and custom icons follow the theme since they use `currentColor`.
- Toggle in the showcase nav, remembered between visits. The Colors page shows both palettes side by side.
- Consumers get both themes from the single stylesheet import and switch with the same attribute; the system guide documents this.

## 3. Component spec pages

Each of the 19 components gets its own page at `/components/<name>`, linked from the gallery and the sidebar:

- **Anatomy**: the rendered component with labeled parts.
- **Spacing**: padding, border width, shadow offset and gaps in px, read from the stylesheet and shown as an annotated diagram.
- **Colors**: which token each variant uses for background, text, border, hover, in both themes.
- **Typography**: font, size, line-height and casing rules.
- **States**: default, hover, focus-visible, active, disabled, error rendered live in a grid (forced-state classes so hover/focus are visible without interacting).
- **Accessibility**: element semantics, keyboard behavior, required labels, contrast notes for each variant/theme.
- **Props** table and a copyable usage snippet.

Spec content lives in one typed data file per component so it stays consistent and easy to update.

## 4. Unified icon gallery

- NES icons, sprites, rune icons and custom icons all render in the same tile: fixed 96px square, 4px pixel border, caption below, consistent gap, same hover (border turns primary, icon shifts up 2px in pixel steps) and focus-visible ring.
- One filter box across all sets, plus tabs (All / NES / Sprites / Runes / Custom) and per-set counts.
- Clicking a tile copies its import snippet; a toast confirms.

## Decisions to confirm

- Sign-in for saving custom icons: recommended (prevents anyone with the preview link from adding/deleting icons). Say so if you'd rather skip sign-in and keep it open.
- Fresh palette values above are a proposal; tweak any hex now or after seeing it live.

## Technical details

- **Cloud**: enable Lovable Cloud; table `pixel_icons` (id, owner_id, name, size, pixels jsonb, palette jsonb, created_at) with grants, RLS (public read, owner write), email/password auth, `_authenticated/studio` route gate.
- **AI**: server route `src/routes/api/generate-pixel-icon.ts` streaming from the Lovable AI image endpoint (`google/gemini-3-pro-image`, `messages` + `modalities`, `stream: true`); client downsamples the final PNG to the grid and quantizes to the palette. Error statuses surfaced per gateway semantics; `LOVABLE_API_KEY` stays server-side.
- **Tokens**: script-assisted rewrite of `src/styles/nes.css` replacing the semantic hex values with `var(--nes-*, <hex>)`; new `src/styles/tokens.css` imported first; `[data-nes-theme="fresh"]` overrides. `sources.yaml` gains a `css-variables` token entry so publish renders the token table.
- **Components**: `src/components/NesPixelIcon.tsx` exported from `src/index.ts`; `design-system.json` enrichment (usage, example, antipatterns).
- **Showcase** (stays under `src/showcase/**`, excluded via `.dsignore`): `studio/` editor, `specs/*.ts` data, `ThemeToggle`, unified `IconTile`; routes `/studio`, `/components/$name`, `/auth`. Icon data helpers (rune/sprite import into the editor) live in the showcase, not the library.
- **Tests**: unit tests for grid ops (fill, undo), palette quantization, and token overrides; browser verification of both themes, each spec page, editor draw/save round-trip, and AI generation.
- **Rollback**: each step is a separate commit; the token rewrite keeps original values as fallbacks, so reverting `tokens.css` restores the exact NES look.
