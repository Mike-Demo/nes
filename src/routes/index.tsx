import { createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesButton } from "../components/NesButton";
import { NesContainer } from "../components/NesContainer";
import { NesBalloon } from "../components/NesBalloon";
import { NesPixelArt } from "../components/NesPixelArt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NES.css Design System" },
      { name: "description", content: "Retro 8-bit design system: pixel-perfect React components built on NES.css." },
      { property: "og:title", content: "NES.css Design System" },
      { property: "og:description", content: "Retro 8-bit design system: pixel-perfect React components built on NES.css." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <ShowcaseShell>
      <h1>NES.css Design System</h1>
      <p className="lede">
        A retro 8-bit design system. Chunky pixel borders, hard shadows, and the
        Press Start 2P font — every component looks like it belongs on a
        cartridge title screen.
      </p>

      <div className="showcase-section">
        <NesContainer title="HELLO, PLAYER 1" centered rounded>
          <div className="specimen-row" style={{ alignItems: "center" }}>
            <NesPixelArt name="mario" />
            <NesBalloon from="left">
              <p>Press start to explore the system.</p>
            </NesBalloon>
          </div>
          <div className="specimen-row" style={{ marginTop: 24 }}>
            <NesButton variant="primary">Start</NesButton>
            <NesButton variant="success">Continue</NesButton>
            <NesButton variant="error">Quit</NesButton>
          </div>
        </NesContainer>
      </div>

      <div className="showcase-section">
        <h2>What's inside</h2>
        <div className="specimen-row">
          <div>
            <NesContainer rounded>
              <p>16 COMPONENTS</p>
              <span className="showcase-caption">Buttons, forms, dialogs, tables, sprites and more</span>
            </NesContainer>
          </div>
          <div>
            <NesContainer rounded>
              <p>5 SEMANTIC COLORS</p>
              <span className="showcase-caption">primary, success, warning, error + neutrals</span>
            </NesContainer>
          </div>
          <div>
            <NesContainer rounded>
              <p>1 PIXEL FONT</p>
              <span className="showcase-caption">Press Start 2P everywhere</span>
            </NesContainer>
          </div>
        </div>
      </div>
    </ShowcaseShell>
  );
}
