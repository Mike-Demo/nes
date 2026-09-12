import { createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";

export const Route = createFileRoute("/colors")({
  head: () => ({
    meta: [
      { title: "Colors — NES.css Design System" },
      { name: "description", content: "Semantic color tokens of the NES.css design system." },
      { property: "og:title", content: "Colors — NES.css Design System" },
      { property: "og:description", content: "Semantic color tokens of the NES.css design system." },
    ],
  }),
  component: ColorsPage,
});

interface Swatch {
  name: string;
  role: string;
  color: string;
  textColor?: string;
}

const SEMANTIC: Swatch[] = [
  { name: "is-primary", role: "Primary actions, links, focus", color: "#209cee" },
  { name: "is-success", role: "Confirmations, valid states", color: "#92cc41" },
  { name: "is-warning", role: "Caution, pending states", color: "#f7d51d" },
  { name: "is-error", role: "Errors, destructive actions", color: "#e76e55" },
];

const NEUTRALS: Swatch[] = [
  { name: "is-dark / base", role: "Text, borders, dark surfaces", color: "#212529", textColor: "#fff" },
  { name: "background", role: "Default page background", color: "#ffffff" },
  { name: "hover (default)", role: "Hover shade for default controls", color: "#e7e7e7" },
  { name: "shadow", role: "Hard pixel shadow under controls", color: "#adafbc" },
  { name: "is-disabled", role: "Disabled controls and text", color: "#d3d3d3" },
];

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div>
      <div
        className="swatch-box"
        style={{ background: swatch.color, color: swatch.textColor ?? "#212529", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}
      >
        Aa
      </div>
      <p style={{ fontSize: 10, marginTop: 8 }}>{swatch.name}</p>
      <span className="showcase-caption">{swatch.role}</span>
    </div>
  );
}

function ColorsPage() {
  return (
    <ShowcaseShell>
      <h1>Colors</h1>
      <p className="lede">
        Reach for the semantic class (is-primary, is-success…) via each
        component's variant prop — never the raw value.
      </p>

      <div className="showcase-section">
        <h2>Semantic</h2>
        <div className="swatch-grid">
          {SEMANTIC.map((s) => (
            <SwatchCard key={s.name} swatch={s} />
          ))}
        </div>
      </div>

      <div className="showcase-section">
        <h2>Neutrals</h2>
        <div className="swatch-grid">
          {NEUTRALS.map((s) => (
            <SwatchCard key={s.name} swatch={s} />
          ))}
        </div>
      </div>
    </ShowcaseShell>
  );
}
