import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { NesPixelIcon } from "../components/NesPixelIcon";
import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { PixelEditor } from "../showcase/studio/PixelEditor";
import type { SavedPixelIcon } from "../showcase/studio/pixel-icons.service";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Icon studio — NES.css Design System" },
      { name: "description", content: "Draw or AI-generate custom pixel icons in the NES.css style and save them to the gallery." },
      { property: "og:title", content: "Icon studio — NES.css Design System" },
      { property: "og:description", content: "Draw or AI-generate custom pixel icons in the NES.css style and save them to the gallery." },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  const [recent, setRecent] = useState<SavedPixelIcon[]>([]);

  return (
    <ShowcaseShell>
      <h1>Icon studio</h1>
      <p className="lede">
        Draw pixel icons on an 8, 16 or 32 grid with the active theme palette, start from an
        existing NES icon or rune, or describe one and let the AI draft it. Saved icons appear on
        the Iconography page and render through NesPixelIcon.
      </p>
      <PixelEditor onSaved={(icon) => setRecent((list) => [icon, ...list])} />
      {recent.length > 0 ? (
        <section className="showcase-section mt-12">
          <h2>Saved this session</h2>
          <div className="specimen-row">
            {recent.map((item) => (
              <div key={item.id} className="specimen is-centered">
                <NesPixelIcon icon={item.icon} size="large" aria-label={item.name} />
                <span className="showcase-caption">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </ShowcaseShell>
  );
}
