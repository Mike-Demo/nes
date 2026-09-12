import { createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesText } from "../components/NesText";
import { NesList } from "../components/NesList";

export const Route = createFileRoute("/typography")({
  head: () => ({
    meta: [
      { title: "Typography — NES.css Design System" },
      { name: "description", content: "Press Start 2P type scale and text styles of the NES.css design system." },
      { property: "og:title", content: "Typography — NES.css Design System" },
      { property: "og:description", content: "Press Start 2P type scale and text styles of the NES.css design system." },
    ],
  }),
  component: TypographyPage,
});

function TypographyPage() {
  return (
    <ShowcaseShell>
      <h1>Typography</h1>
      <p className="lede">
        One font rules the system: Press Start 2P, loaded from Google Fonts.
        Base size 16px; keep copy short — pixel type rewards brevity.
      </p>

      <div className="showcase-section">
        <h2>Scale</h2>
        <div className="specimen">
          <h1 style={{ fontSize: 28 }}>INSERT COIN</h1>
          <span className="showcase-caption">display — h1 scaled up</span>
        </div>
        <div className="specimen" style={{ marginTop: 24 }}>
          <h2>SELECT YOUR PLAYER</h2>
          <span className="showcase-caption">h2 — section heading</span>
        </div>
        <div className="specimen" style={{ marginTop: 24 }}>
          <h3>WORLD 1-1</h3>
          <span className="showcase-caption">h3 — sub heading</span>
        </div>
        <div className="specimen" style={{ marginTop: 24 }}>
          <p>
            A long time ago, in a kingdom of 8 bits, every paragraph rendered in
            Press Start 2P at 16 pixels with a generous line height.
          </p>
          <span className="showcase-caption">body — p, 16px / 1.6</span>
        </div>
        <div className="specimen" style={{ marginTop: 24 }}>
          <a href="#sample">Continue to the next level</a>
          <span className="showcase-caption">link — a</span>
        </div>
        <div className="specimen" style={{ marginTop: 24 }}>
          <code>const lives = 3;</code>
          <span className="showcase-caption">code</span>
        </div>
      </div>

      <div className="showcase-section">
        <h2>Colored text</h2>
        <div className="specimen-row">
          {(["primary", "success", "warning", "error", "disabled"] as const).map((v) => (
            <div key={v} className="specimen">
              <NesText variant={v}>POWER UP</NesText>
              <span className="showcase-caption">NesText variant="{v}"</span>
            </div>
          ))}
        </div>
      </div>

      <div className="showcase-section">
        <h2>Lists</h2>
        <div className="specimen-row">
          <div className="specimen">
            <NesList variant="disc">
              <li>Super Mushroom</li>
              <li>Fire Flower</li>
              <li>Super Star</li>
            </NesList>
            <span className="showcase-caption">NesList variant="disc"</span>
          </div>
          <div className="specimen">
            <NesList variant="circle">
              <li>Super Mushroom</li>
              <li>Fire Flower</li>
              <li>Super Star</li>
            </NesList>
            <span className="showcase-caption">NesList variant="circle"</span>
          </div>
        </div>
      </div>
    </ShowcaseShell>
  );
}
