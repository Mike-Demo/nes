# NES.css Design System — Agent Guide

A retro 8-bit design system built on the NES.css aesthetic: chunky pixel
borders, a Press Start 2P pixel font, hard shadows, no gradients, no
antialiasing. Everything should look like it belongs on an NES title screen.

## Setup (required)

Consumers must do two things before components render correctly:

1. Import the base stylesheet once, at the app root:
   ```ts
   import "@/design-system/nes/styles/nes.css";
   ```
   (Path may differ by attach slug — import the `styles/nes.css` file this
   library ships.)
2. Load the Press Start 2P webfont. Add to the document head:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
   ```
   Without the font, everything falls back to a system font and the aesthetic
   is lost.

## Hard constraints

- NEVER use inline styles or raw CSS values for color, border, or shadow on
  NES components. Visual variation is expressed ONLY through the `variant`,
  `state`, `size`, `dark`, and `rounded` props, which map to NES.css classes.
- NEVER add smooth/rounded CSS of your own; pixel corners come from the
  framework's border-image. Use the `rounded` prop instead.
- NEVER apply `border-radius`, `box-shadow`, or `transition` to NES
  components — they break the pixel borders and the stepped hover effect.
- Do NOT mix another component library's buttons/inputs with these in the
  same surface; the styles clash badly.
- The font is intentionally tiny and all-caps-friendly. Keep copy short.
  Long paragraphs in Press Start 2P are hard to read — use it for headings,
  labels, and short UI text.

## Conventions

- Every component wraps a documented NES.css class (`.nes-btn`,
  `.nes-container`, `.nes-balloon`, …). Consumers may also use the raw
  classes in plain HTML when no wrapper fits.
- Color variants are semantic and consistent across components:
  `primary` (blue), `success` (green), `warning` (yellow), `error` (red).
- Dark surfaces: pass `dark` to NesContainer/NesDialog/NesTable/NesRadio and
  ensure text inside uses light colors (the dark classes handle this).
- NesIcon and NesPixelArt render `<i>` elements that are `aria-hidden` by
  default. Pass `aria-label` when the icon IS the content (e.g. an icon-only
  like button).
- NesDialog is a native `<dialog>`; open it with `open` or
  `ref.current?.showModal()`.

## Accessibility baseline

- Always pair form controls with a visible label: use NesField, or the
  `label` prop on NesCheckbox/NesRadio.
- Icon-only controls must carry an `aria-label`.
- The error/warning variants alone are not enough to signal validation —
  pair them with a text message.

## Composition examples

Sign-in panel:
```tsx
<NesContainer title="LOGIN" centered rounded>
  <NesField label="Player" htmlFor="name">
    <NesInput id="name" placeholder="ASH KETCHUM" />
  </NesField>
  <NesButton variant="primary">Start</NesButton>
</NesContainer>
```

Dialogue:
```tsx
<NesBalloon from="left">
  <p>It's dangerous to go alone! Take this.</p>
</NesBalloon>
```
