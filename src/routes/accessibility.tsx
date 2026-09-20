import { createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesText } from "../components/NesText";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — NES.css Design System" },
      {
        name: "description",
        content:
          "Contrast ratios, focus, touch targets and reduced-motion and forced-colors fallbacks for the NES.css design system.",
      },
      { property: "og:title", content: "Accessibility — NES.css Design System" },
      {
        property: "og:description",
        content:
          "Contrast ratios, focus, touch targets and reduced-motion and forced-colors fallbacks for the NES.css design system.",
      },
    ],
  }),
  component: AccessibilityPage,
});

interface ContrastRow {
  readonly label: string;
  readonly fill: string;
  readonly retro: string;
  readonly fresh: string;
  readonly textToken: string;
}

const CONTRAST: readonly ContrastRow[] = [
  { label: "Primary", fill: "--nes-primary", retro: "2.98", fresh: "5.13", textToken: "--nes-primary-text" },
  { label: "Success", fill: "--nes-success", retro: "1.92", fresh: "2.36", textToken: "--nes-success-text" },
  { label: "Warning", fill: "--nes-warning", retro: "1.45", fresh: "1.81", textToken: "--nes-warning-text" },
  { label: "Error", fill: "--nes-error", retro: "3.11", fresh: "2.80", textToken: "--nes-error-text" },
];

const RULES: readonly string[] = [
  "Every page has one main region and a skip link that appears on the first Tab press.",
  "Interactive elements keep a 4px focus ring in the palette's focus color; never remove it without a replacement.",
  "State is never carried by color alone — pair a colored frame or word with written text.",
  "Icon-only controls carry an aria-label; decorative icons are aria-hidden.",
  "Touch targets are at least 44x44px on coarse pointers.",
  "Headings step down one level at a time; tables use real th cells and a caption.",
];

const FALLBACKS: readonly string[] = [
  "Reduced motion: hover lifts, transitions and the blink animation are disabled when the device asks for less motion.",
  "Forced colors: borders, focus rings and control outlines switch to system colors so nothing disappears in Windows high-contrast mode. Multi-color pixel sprites are decorative there and should always have a text label nearby.",
  "Blocked web font: the type stack falls back to Courier New and then a generic monospace, so text stays readable.",
  "Custom cursor: the pixel pointer always declares the standard pointer as its fallback.",
  "No stored preference: the palette falls back to NES retro when local storage is unavailable.",
];

function AccessibilityPage() {
  return (
    <ShowcaseShell>
      <h1>Accessibility</h1>
      <p className="lede">
        What this system guarantees, how color is measured, and how it degrades
        when a browser or device changes the rules.
      </p>

      <section className="showcase-section">
        <h2>Color contrast</h2>
        <p>
          Palette colors are tuned for pixel fills, borders and icons — several
          are too light for small text. Use the matching text token whenever a
          color appears as words.
        </p>
        <table className="spec-table">
          <caption className="sr-only">Contrast of each palette color against the page background</caption>
          <thead>
            <tr>
              <th>Color</th>
              <th>Retro</th>
              <th>Fresh</th>
              <th>Use for text</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map((row) => (
              <tr key={row.label}>
                <td>
                  <span className="spec-swatch" style={{ backgroundColor: `var(${row.fill})` }} aria-hidden="true" />
                  <code>{row.fill}</code>
                </td>
                <td>{row.retro}:1</td>
                <td>{row.fresh}:1</td>
                <td>
                  <span className="spec-swatch" style={{ backgroundColor: `var(${row.textToken})` }} aria-hidden="true" />
                  <code>{row.textToken}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Normal text needs 4.5:1. The text tokens clear it in both palettes:{" "}
          <NesText variant="success">success</NesText>,{" "}
          <NesText variant="warning">warning</NesText> and{" "}
          <NesText variant="error">error</NesText> all read cleanly at body size.
        </p>
      </section>

      <section className="showcase-section">
        <h2>Rules</h2>
        <ul className="spec-metric">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="showcase-section">
        <h2>Fallbacks</h2>
        <ul className="spec-metric">
          {FALLBACKS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </ShowcaseShell>
  );
}
