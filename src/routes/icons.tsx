import { createFileRoute, Link } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { IconGallery } from "../showcase/IconGallery";
import { NesIcon } from "../components/NesIcon";
import { NesRuneIcon } from "../components/NesRuneIcon";

export const Route = createFileRoute("/icons")({
  head: () => ({
    meta: [
      { title: "Iconography — NES.css Design System" },
      { name: "description", content: "Pixel icons, sprites, rune glyphs and custom icons of the NES.css design system." },
      { property: "og:title", content: "Iconography — NES.css Design System" },
      { property: "og:description", content: "Pixel icons, sprites, rune glyphs and custom icons of the NES.css design system." },
    ],
  }),
  component: IconsPage,
});

const SIZES = ["small", "medium", "large"] as const;

function IconsPage() {
  return (
    <ShowcaseShell>
      <h1>Iconography</h1>
      <p className="lede">
        Every icon the system ships in one gallery: NES icons, pixel-art sprites, the 215 rune
        glyphs and icons you draw in the <Link to="/studio" className="spec-link">Icon studio</Link>.
        Click a tile to copy its snippet.
      </p>

      <IconGallery />

      <div className="showcase-section mt-12">
        <h2>Sizes</h2>
        <div className="specimen-row items-center">
          {SIZES.map((size) => (
            <div key={`nes-${size}`} className="specimen is-centered">
              <NesIcon name="heart" size={size} />
              <span className="showcase-caption">NesIcon size="{size}"</span>
            </div>
          ))}
          <div className="specimen is-centered">
            <NesIcon name="heart" empty />
            <span className="showcase-caption">empty</span>
          </div>
          {SIZES.map((size) => (
            <div key={`rune-${size}`} className="specimen is-centered">
              <NesRuneIcon name="star" size={size} />
              <span className="showcase-caption">NesRuneIcon size="{size}"</span>
            </div>
          ))}
        </div>
      </div>
    </ShowcaseShell>
  );
}
