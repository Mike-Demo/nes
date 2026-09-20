# Add Rune pixel icons to the design system

## Goal

Bring the pixelated icon set from [Nexvyn/runeicons](https://github.com/Nexvyn/runeicons)
(215 pixel-style SVG icons in 16 categories, Apache 2.0) into the NES.css design
system as a first-class component, browsable on the Iconography page.

## What you'll get

- A new `NesRuneIcon` component: pick an icon by name, scale it with a `size`
  prop (`small` / `medium` / `large`), and it inherits the surrounding text
  color — so it works inside buttons, badges, and colored text out of the box.
- All 215 pixelated icons available by name, grouped by category
  (arrows, code, gadgets, nature, playback, tools, ...).
- The Iconography page gains a "Rune icons" section with category groups that
  work with the existing filter box.

## How it's built

1. **Fetch the source SVGs** from the repo's `public/pixelated/` folders via
   the GitHub API (read-only; Apache 2.0 license file included in the project
   as attribution).
2. **Generate one data module** (`src/components/runes.ts`) by script: each
   SVG is parsed into `{ viewBox, paths[] }` and its fixed black fill is
   rewritten to `currentColor`, so icons follow text color like the rest of
   the system. Names stay kebab-case (`arrow-down`, `battery-low`, ...).
3. **Create `NesRuneIcon`** (`src/components/NesRuneIcon.tsx`): typed props
   (`name`, `size`), decorative-by-default with `aria-hidden` unless an
   `aria-label` is given, `className` merge and ref forwarding, matching the
   conventions of the existing `NesIcon`.
4. **Wire it in**: barrel export in `src/index.ts`, component docs entry, and
   a category-grouped, filterable section on `/icons`.

## Technical details

- No new dependencies; SVGs are vendored as data, no runtime fetching.
- License: Apache 2.0 — attribution file added alongside `LICENSE-nes-css`.
- `.lovable/system.md` gets a short note on when to use rune icons vs the
  NES.css native `NesIcon` set.
- Verified in the preview: every icon tile renders, filter works, sizes scale.

## Out of scope

- The other four rune styles (outline, duotone, fill, glass) — they clash with
  the pixel aesthetic. Easy to add later if wanted.
