import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesIcon, type NesIconName } from "../components/NesIcon";
import { NesPixelArt, type NesPixelArtName } from "../components/NesPixelArt";
import { NesInput } from "../components/NesInput";

export const Route = createFileRoute("/icons")({
  head: () => ({
    meta: [
      { title: "Iconography — NES.css Design System" },
      { name: "description", content: "Pixel icons and sprite art of the NES.css design system." },
      { property: "og:title", content: "Iconography — NES.css Design System" },
      { property: "og:description", content: "Pixel icons and sprite art of the NES.css design system." },
    ],
  }),
  component: IconsPage,
});

const ICONS: NesIconName[] = [
  "heart", "star", "coin", "trophy", "close", "like",
  "twitter", "facebook", "github", "google", "gmail", "medium",
  "linkedin", "instagram", "whatsapp", "youtube", "reddit", "twitch",
];

const SPRITES: NesPixelArtName[] = [
  "mario", "kirby", "ash", "pokeball", "bulbasaur", "charmander",
  "squirtle", "octocat", "bcrikko", "phone", "smartphone",
  "logo", "jp-logo",
];

function IconsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const icons = ICONS.filter((n) => n.includes(q));
  const sprites = SPRITES.filter((n) => n.includes(q));

  return (
    <ShowcaseShell>
      <h1>Iconography</h1>
      <p className="lede">
        Every pixel icon and sprite the system ships. NesIcon scales via the
        size prop; NesPixelArt sprites render at their drawn size.
      </p>

      <div className="search-field">
        <NesInput
          aria-label="Filter icons"
          placeholder="Filter icons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="showcase-section">
        <h2>Icons</h2>
        <div className="icon-grid">
          {icons.map((name) => (
            <div key={name} className="icon-cell">
              <NesIcon name={name} />
              <span className="showcase-caption">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="showcase-section">
        <h2>Sizes</h2>
        <div className="specimen-row" style={{ alignItems: "center" }}>
          {(["small", "medium", "large"] as const).map((size) => (
            <div key={size} className="specimen" style={{ alignItems: "center" }}>
              <NesIcon name="heart" size={size} />
              <span className="showcase-caption">size="{size}"</span>
            </div>
          ))}
          <div className="specimen" style={{ alignItems: "center" }}>
            <NesIcon name="heart" empty />
            <span className="showcase-caption">empty</span>
          </div>
        </div>
      </div>

      <div className="showcase-section">
        <h2>Pixel-art sprites</h2>
        <div className="icon-grid">
          {sprites.map((name) => (
            <div key={name} className="icon-cell">
              <NesPixelArt name={name} />
              <span className="showcase-caption">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </ShowcaseShell>
  );
}
