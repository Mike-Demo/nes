# NES.css Design System Library

Port the uploaded NES.css retro 8-bit CSS framework (SCSS source + prebuilt CSS + stories) into this project as a publishable design system library with React component wrappers.

## What ships

1. **Base stylesheet** — the compiled NES.css stylesheet plus the Press Start 2P webfont and bundled cursor assets, wired as the single theme entry consumers import.
2. **React component wrappers** — typed PascalCase components over the NES.css classes:
   - Buttons (primary, success, warning, error, disabled)
   - Badges (with icon variants)
   - Balloons (speech bubbles, from-left/from-right)
   - Containers (rounded, dark, with centered title)
   - Dialogs
   - Forms: inputs, textarea, checkboxes, radios, selects
   - Lists (disc/circle)
   - Progress bars (all color variants)
   - Tables
   - Text helpers
   - Avatars
   - Pixel-art icons (heart, star, coin, trophy, social icons, NES sprites like Mario/Kirby/Pokéball)
3. **Showcase page at /** — renders every component and variant for visual verification (preview-only).
4. **Library knowledge files**:
   - `.lovable/meta.yaml` — framework: react, css_framework: plain-css, source_type: local, starter: custom_design_system
   - `.lovable/system.md` — design philosophy (8-bit retro aesthetic), hard constraints (token classes over inline styles, NES.css class conventions), component usage rules
   - `.lovable/sources.yaml` — points the publish extractor at the barrel and CSS tokens
   - `src/index.ts` — barrel re-exporting every component (drives the file-copy attach)
5. **Route metadata** — proper title/description for the showcase route.

## Technical notes

- The uploaded zip's `docs/nes.min.css` is the upstream compiled output; the SCSS sources reference it. Components wrap the documented NES.css class API so consumers can also use raw classes.
- Cursors (`cursor.png`, `cursor-click.png`) ship under `src/assets/` so they propagate to consumers.
- No .git metadata will be copied from the zip; only the needed source files.
- Upstream is MIT-licensed; LICENSE file is included with attribution.

## Verification

- Showcase page renders all component groups in the preview without errors.
- Barrel exports resolve (typecheck).
