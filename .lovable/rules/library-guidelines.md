# NES — Guidelines

## Components

The design system exports these components — import them from `@ws-q44iemhjvr3azhdcenod/2d41e7ac-ac8d-4713-844e-300c9d4181e6` and compose them before building anything from scratch:

`NesAvatar`, `NesBadge`, `NesBalloon`, `NesButton`, `NesCheckbox`, `NesContainer`, `NesDialog`, `NesField`, `NesIcon`, `NesInput`, `NesList`, `NesPixelArt`, `NesProgress`, `NesRadio`, `NesSelect`, `NesTable`, `NesText`, `NesTextarea`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-q44iemhjvr3azhdcenod/2d41e7ac-ac8d-4713-844e-300c9d4181e6/styles/nes.css` (source — preferred import)

