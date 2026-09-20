# Accessibility pass, with graceful fallbacks

I read through the showcase pages, the component wrappers and the stylesheet. A lot is already right: one main area per page, labelled navigation, labelled filter fields, icon-only buttons that carry names, the drawing canvas is keyboard-operable, and status messages announce themselves. The gaps below are what an accessibility review would flag, plus fallbacks for people whose device or browser settings change how the pages render.

## What to fix

### 1. Keyboard users can't skip the menu
Every page starts with nine navigation links before the content. Add a "Skip to content" link that appears on the first Tab press and jumps to the main area.

### 2. Text colors that are too faint to read
Measured against the page background, several palette colors fail the standard for normal text:

| Color | Retro | Fresh |
| --- | --- | --- |
| Primary (blue / indigo) | 2.98 | 5.13 |
| Success (green / mint) | 1.92 | 2.36 |
| Warning (yellow / amber) | 1.45 | 1.81 |
| Error (red / coral) | 3.11 | 2.80 |

Normal text needs 4.5. The colors stay exactly as they are on buttons, borders, badges and icons — those are large or non-text. For *text* (the colored status words, captions, links), add a darker text-only shade per color to the palette and use it wherever the colored text appears. The retro look is preserved; only small colored words get darker.

### 3. Status shown by color alone
Colored words and the input success/warning/error frames rely on color only. Add a small icon or a word to the field states in the showcase examples and in the guidance so meaning survives for people who can't tell the colors apart.

### 4. The set tabs on the Iconography page
They are marked as tabs but behave as buttons, so a screen reader announces a tab strip that doesn't work like one. Switch them to a pressed-button group (same look, same behaviour, honest announcement).

### 5. Small tap targets
The delete "×" on a custom icon and some compact controls fall below the 44px comfortable touch size on phones. Enlarge their hit area without changing how they look.

### 6. Reduced-motion fallback
Tiles lift on hover, the toast slides in, and the stylesheet has a blinking animation. Add a rule so all of that stops for anyone who has asked their device to reduce motion.

### 7. High-contrast / forced-colors fallback
Many pixel elements (icons, checkboxes, radios, badges) are drawn with shadows that disappear in Windows high-contrast mode. Add a fallback that keeps borders, focus rings and controls visible, and note the limitation for pixel sprites.

### 8. Font and cursor fallbacks
The pixel font is loaded from the web and the cursor is a custom image. Add a readable system fallback font in the stack and confirm the standard cursor fallback stays, so a blocked download never leaves an unreadable or invisible pointer.

### 9. Focus visibility everywhere
Focus rings exist on the menu, icon tiles and canvas cells, but not consistently on buttons, inputs, selects and links in content. Add one consistent, high-contrast focus ring across all of them.

### 10. Write it down
Add an "Accessibility" page to the showcase summarising these rules and the contrast table, and record the same rules in the system guide so projects using this design system inherit them.

## Technical notes

- New text-only tokens (`--nes-primary-text`, `--nes-success-text`, `--nes-warning-text`, `--nes-error-text`) defined for both palettes in `src/styles/nes.css`; `.nes-text.is-*` and showcase captions read them, while fills and borders keep the existing tokens.
- Skip link added in `src/showcase/ShowcaseShell.tsx` with `id="showcase-main"` on `<main>`; styles in `src/showcase/showcase.css`.
- `@media (prefers-reduced-motion: reduce)` and `@media (forced-colors: active)` blocks added to both stylesheets; `forced-color-adjust` left default so system colors win.
- Tabs in `src/showcase/IconGallery.tsx` move from `role="tab"`/`aria-selected` to `aria-pressed` inside a labelled group.
- `min-height`/`min-width` of 44px via padding on `.icon-tile-delete` and compact studio controls.
- Font stack becomes `"Press Start 2P", "Courier New", monospace`.
- New route `src/routes/accessibility.tsx` plus a nav entry; guidance appended to `.lovable/system.md`.
- Verified after the change with a keyboard pass and an automated axe run over the showcase routes.
